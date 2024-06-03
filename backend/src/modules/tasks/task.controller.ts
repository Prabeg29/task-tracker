import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ParamsDictionary } from "express-serve-static-core";

import { TaskService } from "./task.service";
import { TaskMapper } from "./task.mapper";
import { TaskCreateDto, TaskQueryDto, TaskUpdateDto, TaskWithUsers } from "./task.type";

export class TaskController {
  constructor(
    protected readonly taskService: TaskService
  ) { }

  public fetchAll = async (
    req: Request<ParamsDictionary, unknown, unknown, { search: string; sortBy: string; sortOrder: string; currentPage: string; perPage: string;}>,
    res: Response
  ): Promise<void> => {
    const { data: tasks, paginationInfo } = await this.taskService.fetchAllPaginated(req.query as TaskQueryDto);

    res.status(StatusCodes.OK).json({
      message: "Tasks fetched successfully",
      tasks  : TaskMapper.toResponseDtoCollection(tasks),
      meta   : {
        paginationInfo: paginationInfo
      },
    });
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    const task: TaskWithUsers = await this.taskService.create(req.body as TaskCreateDto);

    res.status(StatusCodes.CREATED).json({
      message: "Task created successfully.",
      task   : TaskMapper.toResponseDto(task)
    });
  };

  public fetchOne = async (req: Request, res: Response): Promise<void> => {
    const task: TaskWithUsers = await this.taskService.fetchOneById(parseInt(req.params.id));

    res.status(StatusCodes.CREATED).json({
      message: "Task created successfully.",
      task   : TaskMapper.toResponseDto(task)
    });
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    const task: TaskWithUsers = await this.taskService.update(parseInt(req.params.id), req.body as TaskUpdateDto);

    res.status(StatusCodes.OK).json({
      message: "Task updated successfully",
      task   : TaskMapper.toResponseDto(task)
    });
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    await this.taskService.delete(parseInt(req.params.id));

    res.status(StatusCodes.OK).json({ message: "Task deleted successfully" });
  };
}
