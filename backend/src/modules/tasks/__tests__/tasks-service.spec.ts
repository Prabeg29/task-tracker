import { HttpException } from "../../../exceptions/http.exception";
import { KnexTaskRepository } from "../knex-task.repository";
import { TaskRepositoryInterface } from "../task.irepository";
import { TaskService } from "../task.service";
import { TaskCreateDto, TaskWithUsers } from "../task.type";
import { createTaskDtoStub, taskStub } from "./task.stub";

describe("Task Service", () => {
  const knexTaskRepository: TaskRepositoryInterface = new KnexTaskRepository();
  const taskService: TaskService = new TaskService(knexTaskRepository);

  let res;
  let error: HttpException;

  let mockCreate: jest.SpyInstance<Promise<TaskWithUsers>, [taskData: TaskCreateDto]>;

  beforeEach(() => {
    mockCreate = jest.spyOn(knexTaskRepository, "create");
  });

  afterEach(() => jest.clearAllMocks());

  describe("create", () => {
    it("should create a task", async () => {
      mockCreate.mockResolvedValue(taskStub()[0]);

      res = await taskService.create(createTaskDtoStub());

      expect(mockCreate).toHaveBeenCalledWith(createTaskDtoStub());
      expect(res).toMatchObject(taskStub()[0]);
    });
  });
});
