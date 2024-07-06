import { Router } from "express";

import { tryCatchWrapper } from "../utils/try-catch.util";
import { TaskService } from "../modules/tasks/task.service";
import { validate } from "../middlewares/validator.middleware";
import { checkPermission } from "../middlewares/rbac.middleware";
import { TaskController } from "../modules/tasks/task.controller";
import { authenticate } from "../middlewares/authenticate.middleware";
import { KnexTaskRepository } from "../modules/tasks/knex-task.repository";
import { taskCreateSchema, taskUpdateSchema } from "../modules/tasks/task.schema";

const router: Router = Router();
const taskController = new TaskController(new TaskService(new KnexTaskRepository()));

router.get("/", authenticate, checkPermission("read_tasks"), tryCatchWrapper(taskController.fetchAll));
router.post(
  "/",
  authenticate,
  checkPermission("create_tasks"),
  validate(taskCreateSchema),
  tryCatchWrapper(taskController.create)
);
router.get("/:id", authenticate, checkPermission("read_tasks"), tryCatchWrapper(taskController.fetchOne));
router.put(
  "/:id",
  authenticate,
  checkPermission("update_tasks"),
  validate(taskUpdateSchema),
  tryCatchWrapper(taskController.update)
);
router.delete("/:id", authenticate, checkPermission("delete_tasks"), tryCatchWrapper(taskController.delete));

export default router;
