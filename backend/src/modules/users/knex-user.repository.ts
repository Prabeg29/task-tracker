import { dbConn } from "../../utils/db.util";
import { CreateUserDto, User } from "./user.type";
import { dbTables } from "../../enums/db-tables.enum";
import { UserRepositoryInterface } from "./user.irepository";

export class KnexUserRepository implements UserRepositoryInterface {
  public async fetchOneByEmail(email: string): Promise<User | undefined> {
    return await dbConn<User>(dbTables.USERS).where("email", email).first();
  }

  public async fetchOneById(id: number): Promise<User | undefined> {
    return await dbConn<User>(dbTables.USERS).where("id", id).first();
  }
  
  public async create(userData: CreateUserDto): Promise<User> {
    const [userId] = await dbConn(dbTables.USERS).insert({ ...userData }, ["id"]);

    return await this.fetchOneById(userId);
  }

  public async fetchAll(): Promise<User[]> {
    return await dbConn<User>(dbTables.USERS);
  }
}
