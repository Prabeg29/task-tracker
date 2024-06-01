import { CreateUserDto, User } from "./user.type";

export interface UserRepositoryInterface {
  fetchOneByEmail(email: string): Promise<User | undefined>;
  fetchOneById(id: number): Promise<User | undefined>;
  create(userData: CreateUserDto): Promise<User>;
};
