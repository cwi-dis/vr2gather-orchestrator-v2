import Serializable from "./serializable";
import User from "./user";

class RemoteDataStream implements Serializable {
  #id: string;
  #userId: string;

  constructor(user: User, public type: string, public description: string) {
    this.#id = `${user.id}::${type}`;
    this.#userId = user.id;
  }

  public get id() {
    return this.#id;
  }

  public serialize() {
    return {
      dataStreamUserId: this.#userId,
      dataStreamKind: this.type,
      dataStreamDescription: this.description
    };
  }
}

export default RemoteDataStream;
