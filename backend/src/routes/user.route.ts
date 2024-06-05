import { Router } from "express";

import { tryCatchWrapper } from "../utils/try-catch.util";
import { UserService } from "../modules/users/user.service";
import { UserController } from "../modules/users/user.controller";
import { authenticate } from "../middlewares/authenticate.middleware";
import { KnexUserRepository } from "../modules/users/knex-user.repository";

const router: Router = Router();
const userController = new UserController(new UserService(new KnexUserRepository()));

router.get(
  "/",
  authenticate,
  tryCatchWrapper(userController.fetchAll)
);

export default router;
