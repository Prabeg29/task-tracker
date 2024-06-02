import { Router } from "express";

import { tryCatchWrapper } from "../utils/try-catch.util";
import { TaskService } from "../modules/tasks/task.service";
import { TaskController } from "../modules/tasks/task.controller";
import { authenticate } from "../middlewares/authenticate.middleware";
import { KnexTaskRepository } from "../modules/tasks/knex-task.repository";

const router: Router = Router();
const taskController = new TaskController(new TaskService(new KnexTaskRepository()));

router.get("/", authenticate, tryCatchWrapper(taskController.fetchAll));
router.post("/", authenticate, tryCatchWrapper(taskController.create));
router.get("/:id", authenticate, tryCatchWrapper(taskController.fetchOne));
router.put("/:id", authenticate, tryCatchWrapper(taskController.update));
router.delete("/:id", authenticate, tryCatchWrapper(taskController.delete));

export default router;
