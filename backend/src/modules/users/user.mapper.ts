import config from '../../config';
import { roles } from '../../enums/roles.enum';
import { User, UserResponseDto } from './user.type';

export class UserMapper {
  public static toResponseDto (user: User & { token?: string; }): UserResponseDto {
    return {
      id        : user.id,
      attributes: {
        name     : user.name,
        email    : user.email,
        role     : roles[user.role].toLowerCase(),
        createdAt: user.createdAt.toDateString(),
        updatedAt: user.updatedAt.toDateString(),
      },
      token: user.token ? user.token : undefined,
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
