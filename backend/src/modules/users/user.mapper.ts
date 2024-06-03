import config from "../../config";
import { roles } from "../../enums/roles.enum";
import { User, UserResponseDto } from "./user.type";

export class UserMapper {
  public static toResponseDto (user: User & { accessToken?: string; }): UserResponseDto {

    if (typeof user.createdAt === "string") {
      user.createdAt = new Date(user.createdAt);
    }

    if (typeof user.updatedAt === "string") {
      user.updatedAt = new Date(user.updatedAt);
    }

    return {
      id        : user.id,
      attributes: {
        name     : user.name,
        email    : user.email,
        role     : roles[Number(user.role)].toLowerCase(),
        createdAt: user.createdAt.toDateString(),
        updatedAt: user.updatedAt.toDateString(),
      },
      accessToken: user.accessToken ?? undefined,
      type       : user.accessToken ? "Bearer" : undefined
    };
  }

  public static toResponseDtoDtoCollection(users: User[]): Array<UserResponseDto> {
    return users.map(user => {
      return {
        ...UserMapper.toResponseDto(user),
        meta: {
          link: new URL(`${config.app.url}/api/users/${user.id}`),
        }
      };
    });
  }
}
