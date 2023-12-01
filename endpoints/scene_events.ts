import * as util from "../util";

import EndpointNames from "./endpoint_names";
import User from "../app/user";
import ErrorCodes  from "./error_codes";

const installHandlers = (user: User) => {
  const { socket } = user;

  /**
   * Sends a scene event to the master of the user's current session. If the
   * user is not in any session, the request data is empty or the session has
   * no master, an error is issued.
   */
  socket.on(EndpointNames.SEND_SCENE_EVENT_TO_MASTER, (sceneEvent, callback) => {
    const { session } = user;

    if (!session) {
      return callback(util.createResponse(
        ErrorCodes.SESSION_USER_NOT_IN_ANY_SESSION
      ));
    }

    if (!sceneEvent) {
      return callback(util.createResponse(
        ErrorCodes.SCENE_EVENT_NO_DATA
      ));
    }

    const { master } = session;
    if (!master) {
      return callback(util.createResponse(
        ErrorCodes.SCENE_EVENT_NO_MASTER
      ));
    }

    master.sendSceneEvent(
      "SceneEventToMaster",
      user,
      sceneEvent
    );
  });

  /**
   * Sends a scene event from a session master to a regular user. If the
   * master is not in any session or the request data is empty, an error is
   * issued. An error is also returned if the calling user is not the master of
   * their session.
   */
  socket.on(EndpointNames.SEND_SCENE_EVENT_TO_USER, (targetId, sceneEvent, callback) => {
    const { session } = user;
    if (!session) {
      return callback(util.createResponse(
        ErrorCodes.SESSION_USER_NOT_IN_ANY_SESSION
      ));
    }

    if (!session.isMaster(user)) {
      return callback(util.createResponse(
        ErrorCodes.SCENE_EVENT_USER_IS_NOT_MASTER
      ));
    }

    if (!targetId) {
      return callback(util.createResponse(
        ErrorCodes.SCENE_EVENT_NO_TARGET_ID
      ));
    }

    const targetUser = session.getUser(targetId);
    if (!targetUser) {
      return callback(util.createResponse(
        ErrorCodes.SESSION_USER_NOT_IN_SESSION
      ));
    }

    if (!sceneEvent) {
      return callback(util.createResponse(
        ErrorCodes.SCENE_EVENT_NO_DATA
      ));
    }

    user.sendSceneEvent(
      "SceneEventToUser",
      targetUser,
      sceneEvent
    );
  });

  /**
   * Sends a scene event from a session master to all users of the session. If
   * the master is not in any session or the request data is empty, an error is
   * issued. An error is also returned if the calling user is not the master of
   * their session.
   */
  socket.on(EndpointNames.SEND_SCENE_EVENT_TO_ALL, (sceneEvent, callback) => {
    const { session } = user;
    if (!session) {
      return callback(util.createResponse(
        ErrorCodes.SESSION_USER_NOT_IN_ANY_SESSION
      ));
    }

    if (!session.isMaster(user)) {
      return callback(util.createResponse(
        ErrorCodes.SCENE_EVENT_USER_IS_NOT_MASTER
      ));
    }

    if (!sceneEvent) {
      return callback(util.createResponse(
        ErrorCodes.SCENE_EVENT_NO_DATA
      ));
    }

    session.sendSceneEvent(sceneEvent);
  });
};

export default installHandlers;
