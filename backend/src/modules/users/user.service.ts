import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";

import { CreateUserDto, User } from "./user.type";
import { UserRepositoryInterface } from "./user.irepository";
import { HttpException } from "../../exceptions/http.exception";

export class UserService {
  constructor(
    protected readonly userRepository: UserRepositoryInterface
  ) {}

  public async create(userData: CreateUserDto): Promise<User> {
    const isExistingUser = await this.userRepository.fetchOneByEmail(userData.email);

    if (isExistingUser) {
      throw new HttpException("User with the provided email already exists",StatusCodes.BAD_REQUEST);
    }

    userData.password = await bcrypt.hash(userData.password, 10);

    return await this.userRepository.create(userData);
  }
}
