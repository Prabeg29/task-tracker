import { PaginationInfo } from "../../utils/db.util";
import { TaskCreateDto, TaskQueryDto, TaskUpdateDto, TaskWithUsers } from "./task.type";

export interface TaskRepositoryInterface {
  fetchAllPaginated(taskQuery: TaskQueryDto): Promise<{ data: TaskWithUsers[]; paginationInfo: PaginationInfo; }>;
  fetchOneById(id: number): Promise<TaskWithUsers | undefined>;
  create(authId: number, taskData: TaskCreateDto): Promise<TaskWithUsers>;
  update(id: number, taskData: TaskUpdateDto): Promise<TaskWithUsers>
  delete(id: number): Promise<number>;
}
