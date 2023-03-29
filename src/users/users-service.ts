import { ApiConfig } from "@/config";
import { validateToken } from "./jwt";
import { IUserService, IUserDB, User, UserBasic } from "./types";

export class UserService implements IUserService {

  private userDb: IUserDB
  private config: ApiConfig
  constructor(userDb: IUserDB, config: ApiConfig) {
    this.userDb = userDb
    this.config = config;
  }
  async create(user: UserBasic): Promise<UserBasic> {
    return this.userDb.create(user)
  }

  async get(token: string): Promise<User> {
    const user = await validateToken(token, this.config.secret)
    return user;
  }
}
