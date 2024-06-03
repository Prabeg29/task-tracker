import { userStub } from "../../users/__tests__/user.stub";
import { TaskCreateDto, TaskUpdateDto, TaskWithUsers } from "../task.type";

const taskStub = (): TaskWithUsers[] => {
  return [
    {
      id         : 1,
      title      : "Push code to github",
      description: "Push the latest commit to github",
      createdBy  : userStub()[0],
      assignedTo : null,
      status     : "todo",
      completedAt: null,
      createdAt  : new Date("2024-12-09 00:00:00"),
      updatedAt  : new Date("2024-12-09 00:00:00"),
      deletedAt  : null,
    }
  ];
};

const createTaskDtoStub = (): TaskCreateDto => {
  return {
    title: "Push code to github",
    description: "Push the latest commit to github"
  };
};

const updateTaskDtoStub = (): TaskUpdateDto => {
  return {
    title: "Push code to github",
    description: "Push the latest commit to github",
    status: "in_progress",
    assignedTo: userStub()[0].id
  };
};

export { taskStub, createTaskDtoStub, updateTaskDtoStub };
