import { dbConn } from "../../utils/db.util";
import { dbTables } from "../../enums/db-tables.enum";
import { TaskRepositoryInterface } from "./task.irepository";
import { PaginationInfo, paginate } from "../../utils/db.util";
import { Task, TaskCreateDto, TaskQueryDto, TaskUpdateDto, TaskWithUsers } from "./task.type";

export class KnexTaskRepository implements TaskRepositoryInterface {
  protected selectParams = [
    `${dbTables.TASKS}.id`,
    `${dbTables.TASKS}.title`,
    `${dbTables.TASKS}.description`,
    `${dbTables.TASKS}.status`,
    `${dbTables.TASKS}.completedAt`,
    `${dbTables.TASKS}.createdAt`,
    `${dbTables.TASKS}.updatedAt`,
    dbConn.raw(
      `JSON_OBJECT(
        "id", createdByUser.id,
        "name", createdByUser.name,
        "email", createdByUser.email,
        "role", createdByUser.role,
        "createdAt", DATE_FORMAT(createdByUser.createdAt, "%Y-%m-%dT%H:%i:%sZ"),
        "updatedAt", DATE_FORMAT(createdByUser.updatedAt, "%Y-%m-%dT%H:%i:%sZ"),
        "deletedAt", IFNULL(DATE_FORMAT(createdByUser.deletedAt, "%Y-%m-%dT%H:%i:%sZ"), NULL)
      ) AS createdBy`
    ),
    dbConn.raw(
      `CASE WHEN assignedToUser.id IS NULL
        AND assignedToUser.name IS NULL
        AND assignedToUser.email IS NULL
        AND assignedToUser.role IS NULL
        AND assignedToUser.createdAt IS NULL
        AND assignedToUser.updatedAt IS NULL
        AND assignedToUser.deletedAt IS NULL
      THEN NULL
      ELSE JSON_OBJECT(
        "id", assignedToUser.id,
        "name", assignedToUser.name, 
        "email", assignedToUser.email,
        "role", assignedToUser.role,
        "createdAt", DATE_FORMAT(assignedToUser.createdAt, "%Y-%m-%dT%H:%i:%sZ"),
        "updatedAt", DATE_FORMAT(assignedToUser.updatedAt, "%Y-%m-%dT%H:%i:%sZ"),
        "deletedAt", IFNULL(DATE_FORMAT(assignedToUser.deletedAt, "%Y-%m-%dT%H:%i:%sZ"), NULL)
      ) END AS assignedTo`
    )
  ];

  public async fetchAllPaginated(taskQuery: TaskQueryDto): Promise<{ data: TaskWithUsers[]; paginationInfo: PaginationInfo; }> {
    const query = dbConn<Task>(dbTables.TASKS)
      .join(`${dbTables.USERS} as createdByUser`, `${dbTables.TASKS}.createdBy`, "createdByUser.id")
      .leftJoin(`${dbTables.USERS} as assignedToUser`, `${dbTables.TASKS}.assignedTo`, "assignedToUser.id");

    // if (taskQuery.search) {
    //   query.whereLike(`${dbTables.TASKS}.title`, `%${taskQuery.search}%`)
    // }

    if (taskQuery.status) {
      query.orWhere("status", taskQuery.status);
    }

    if (taskQuery.sortBy && taskQuery.sortOrder) {
      query.orderBy(taskQuery.sortBy, taskQuery.sortOrder);
    }

    return await paginate<TaskWithUsers>(query, {
      currentPage : taskQuery.currentPage as number,
      perPage     : taskQuery.perPage as number,
      selectParams: this.selectParams,
    });
  }

  public async fetchOneById(id: number): Promise<TaskWithUsers | undefined> {
    return await dbConn<TaskWithUsers>(dbTables.TASKS)
      .join(`${dbTables.USERS} as createdByUser`, `${dbTables.TASKS}.createdBy`, "createdByUser.id")
      .leftJoin(`${dbTables.USERS} as assignedToUser`, `${dbTables.TASKS}.assignedTo`, "assignedToUser.id")
      .where(`${dbTables.TASKS}.id`, id)
      .first(this.selectParams);
  }

  public async create(taskData: TaskCreateDto): Promise<TaskWithUsers> {
    const [taskId] = await dbConn(dbTables.TASKS)
      .insert({ ...taskData, status: "todo", createdBy: 1 }, ["id"]);

    return await this.fetchOneById(taskId);
  }

  public async update(id: number, taskData: TaskUpdateDto): Promise<TaskWithUsers> {
    await dbConn(dbTables.TASKS)
      .where("id", id)
      .update({ ...taskData, completedAt: taskData.status === "complete" ? new Date() : null });

    return await this.fetchOneById(id);
  }

  public async delete(id: number): Promise<number> {
    return await dbConn(dbTables.TASKS).where("id", id).del();
  }
}
