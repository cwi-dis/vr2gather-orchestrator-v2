import childProcess from "child_process";
import { v4 as uuidv4 } from "uuid";

import logger from "../logger";
import Transport, { TransportUrls } from "./transport";
import Serializable from "../app/serializable";
import User from "../app/user";
import Session from "../app/session";

abstract class ExternalTransport implements Transport, Serializable {
  protected id = uuidv4();
  protected process?: childProcess.ChildProcessWithoutNullStreams;
  protected port: number;

  protected abstract type: string;
  protected abstract cmdLine: Array<string>;
  protected abstract tls: boolean;

  #sessions: Array<Session> = [];

  public constructor(protected externalHostname: string) {
  }

  /**
   * Starts a new SFU process if one is not already running.
   */
  public start(): void {
    if (this.process) {
      return;
    }

    if(!this.cmdLine || this.cmdLine.length < 1){
      logger.error("No command line provided for SFU");
      return;
    }

    const command = this.cmdLine[0];
    const params = this.cmdLine.slice(1).map((param) => {
      return param.replace("%SFU_PORT%", this.port.toString());
    });

    logger.info("Launching new SFU process with ID ", this.id, "for", this.type, "with:", command, params);

    this.process = childProcess.spawn(
      command,
      params,
      { detached: true }
    );

    this.process.stdout.on("data", (data) => {
      logger.debug("SFU", this.id, "stdout:", data);
    });

    this.process.stderr.on("data", (data) => {
      logger.debug("SFU", this.id, "stderr:", data);
    });

    this.process.on("error", (err) => {
      logger.error("SFU", this.id, "error:", err);
    });

    this.process.on("exit", (code) => {
      logger.debug("SFU", this.id, "exit with code:", code);
      this.destroy();
    });
  }

  /**
   * Kills a running SFU process.
   */
  public destroy(): void {
    this.process?.kill("SIGTERM");
    this.process = undefined;
  }

  public abstract getUrls(user: User): TransportUrls;

  public countSessions(): number {
    return this.#sessions.length;
  }

  public serialize() {
    return {
      sfuId: this.id,
      sfuData: {},
      sfuPort: this.port,
      sfuTls: this.tls
    };
  }
}

export default ExternalTransport;
