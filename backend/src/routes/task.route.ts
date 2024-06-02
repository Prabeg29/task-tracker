import { Router } from "express";

import { tryCatchWrapper } from "../utils/try-catch.util";
import { TaskService } from "../modules/tasks/task.service";
import { TaskController } from "../modules/tasks/task.controller";
import { KnexTaskRepository } from "../modules/tasks/knex-task.repository";

const router: Router = Router();
const taskController = new TaskController(new TaskService(new KnexTaskRepository()));

router.get("/", tryCatchWrapper(taskController.fetchAll));
router.post("/", tryCatchWrapper(taskController.create));
router.get("/:id", tryCatchWrapper(taskController.fetchOne));
router.put("/:id", tryCatchWrapper(taskController.update));
router.delete("/:id", tryCatchWrapper(taskController.delete));

export default router;
