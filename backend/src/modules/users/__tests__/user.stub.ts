import { roles } from "../../../enums/roles.enum";
import { CreateUserDto, User } from "../user.type";

const userStub = (): User[] => {
  return [
    {
      id       : 1,
      name     : "Timi Hemdrix",
      email    : "voodoochild@gmail.com",
      role     : roles.MEMBER,
      createdAt: new Date("2024-12-09 00:00:00"),
      updatedAt: new Date("2024-12-09 00:00:00")
    }
  ];
};

const createUserDtoStub = (): CreateUserDto => {
  return {
    name    : "Timi Hemdrix",
    email   : "voodoochild@gmail.com",
    password: "P@ssword123$",
    role    : roles.MEMBER
  };
};

export { userStub, createUserDtoStub };
