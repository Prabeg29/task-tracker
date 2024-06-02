import config from "../../config";
import { UserMapper } from "../users/user.mapper";
import { TaskResponseDto, TaskWithUsers } from "./task.type";

export class TaskMapper {
  public static toResponseDto(task: TaskWithUsers): TaskResponseDto {
    return {
      id: task.id,
      attributes: {
        title: task.title,
        description: task?.description,
        status: task.status,
        completedAt: task.completedAt?.toDateString(),
        createdAt: task.createdAt.toDateString(),
        updatedAt: task.updatedAt.toDateString(),
        deletedAt: task.deletedAt?.toDateString(),
      },
      relationships: {
        createdBy: UserMapper.toResponseDto(task.createdBy),
        assignedTo: task.assignedTo ? UserMapper.toResponseDto(task.assignedTo) : undefined,
      }
    };
  }

  public static toResponseDtoCollection(tasks: TaskWithUsers[]): TaskResponseDto[] {
    return tasks.map(task => {
      return {
        ...TaskMapper.toResponseDto(task),
        meta: {
          link: new URL(`${config.app.url}/api/tasks/${task.id}`),
        }
      };
    });
  }
}
