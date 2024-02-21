import { Dict } from "../util";
import Transport, { TransportUrls } from "./transport";
import Serializable from "app/serializable";

class ExternalTransport implements Transport, Serializable {
  public start(): void {
  }

  public destroy(): void {
  }

  public getUrls(): TransportUrls {
    return {
      url_gen: "",
      url_audio: "",
      url_pcc: ""
    };
  }

  public serialize(): Dict {
    return {};
  }
}

export default ExternalTransport;
