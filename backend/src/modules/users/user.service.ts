import { User } from "./user.type";
import { UserRepositoryInterface } from "./user.irepository";

export class UserService {
  constructor(
    protected readonly userRepository: UserRepositoryInterface
  ) {}

  public async fetchAll(): Promise<User[]> {
    return await this.userRepository.fetchAll();
  }
}
