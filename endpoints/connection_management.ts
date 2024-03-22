import io from "socket.io";

import * as util from "../util";
import logger from "../logger";
import EndpointNames from "./endpoint_names";
import Orchestrator from "../app/orchestrator";
import User from "../app/user";
import ErrorCodes  from "./error_codes";

/**
 * Cleans up the session by removing the user from it. If the leaving user
 * also was the admin of the session, the session itself is deleted. The
 * function returns true if the session was deleted in addition to removing
 * the user from it or false if the session itself was not removed.
 *
 * @param orchestrator Reference to an orchestrator instance
 * @param user User for which to clean up the session
 * @returns True if the session was also deleted
 */
function cleanUpActiveSession(orchestrator: Orchestrator, user: User) {
  const { session } = user;
  session?.removeUser(user);

  if (session?.administrator.id == user.id) {
    session.closeSession();
    orchestrator.removeSession(session);

    return true;
  }

  return false;
}

/**
 * Gets all sessions that the given user is administrator of and forcibly
 * closes them. This serves the purpose of cleaning up dangling sessions.
 *
 * @param orchestrator Reference to an orchestrator instance
 * @param user User for which to clean up dangling sessions
 * @returns Number of sessions closed
 */
function cleanUpDanglingSessions(orchestrator: Orchestrator, user: User) {
  const administratedSessions = orchestrator.getAdministratedSessions(user);

  administratedSessions.forEach((s) => {
    s.closeSession();
    orchestrator.removeSession(s);
  });

  return administratedSessions.length;
}

/**
 * Installs a handler which responds to the `LOGIN` message and creates a new
 * user object. The handler returns a promise which, when resolved, contains a
 * new user object instantiated with the params received in the request.
 *
 * @param orchestrator Reference to the orchestrator
 * @param socket Reference to socket that received the connection
 * @returns A promise that resolves to a new user object, or rejects if the user could not be instantiated
 */
export const installLoginHandler =  async (orchestrator: Orchestrator, socket: io.Socket): Promise<User> => {
  return new Promise((resolve, reject) => {
    /**
     * Creates a new user with the given username which is stored in the
     * enclosing promise. If the received data contained no username, causes
     * the promise to reject.
     */
    socket.on(EndpointNames.LOGIN, (data, callback) => {
      const { userName }: { userName: string | undefined } = data;
      logger.debug(EndpointNames.LOGIN, "Starting login process with username", userName);

      if (!userName) {
        callback(util.createResponse(ErrorCodes.MISSING_CREDENTIALS));

        logger.warn(EndpointNames.LOGIN, "No username supplied");
        reject("No username supplied");
        return;
      }

      const existingUser = orchestrator.findUser(userName);
      if (existingUser) {
        logger.warn(EndpointNames.LOGIN, `Found existing user with username ${userName} (${existingUser.id}). Terminating connection...`);
        existingUser.socket.disconnect();
      }

      const user = new User(userName, socket);
      orchestrator.addUser(user);

      logger.debug(EndpointNames.LOGIN, "Added user", user.name, "to orchestrator");
      resolve(user);

      callback(util.createCommandResponse(data, ErrorCodes.OK, {
        userId: user.id
      }));
    });
  });
};

const installHandlers = (orchestrator: Orchestrator, user: User) => {
  const { socket } = user;


  /**
   * Logs the user out from the orchestrator, removing them from their session
   * first.
   */
  socket.on(EndpointNames.LOGOUT, (data, callback) => {
    logger.debug(EndpointNames.LOGOUT, "Logged out user", user.name);

    if (cleanUpActiveSession(orchestrator, user)) {
      logger.debug(EndpointNames.LOGOUT, "User was admin, closing session");
    }

    const numSessionsCleaned = cleanUpDanglingSessions(orchestrator, user);
    logger.debug(EndpointNames.LOGOUT, `Destroyed ${numSessionsCleaned} dangling sessions`);

    orchestrator.removeUser(user);
    callback?.(util.createCommandResponse(data, ErrorCodes.OK));
  });

  /**
   * Handles a disconnect received from a socket by removing the associated user
   * from their session and the orchestrator.
   */
  socket.on("disconnect", () => {
    logger.debug("[DISCONNECT] Disconnected user", user.name);

    if (cleanUpActiveSession(orchestrator, user)) {
      logger.debug("[DISCONNECT] User was admin, closing session");
    }

    const numSessionsCleaned = cleanUpDanglingSessions(orchestrator, user);
    logger.debug(`[DISCONNECT] Destroyed ${numSessionsCleaned} dangling sessions`);

    orchestrator.removeUser(user);
  });
};

export default installHandlers;
