import { Router } from "express";

import { dbConn } from "../utils/db.util";
import { tryCatchWrapper } from "../utils/try-catch.util";
import { UserService } from "../modules/users/user.service";
import { validate } from "../middlewares/validator.middleware";
import { AuthController } from "../modules/auth/auth.controller";
import { registrationSchema } from "../modules/auth/auth.schema";
import { KnexUserRepository } from "../modules/users/knex-user.repository";

const router: Router = Router();
const authController = new AuthController(new UserService(new KnexUserRepository(dbConn)));

router.post("/register", validate(registrationSchema), tryCatchWrapper(authController.register));

export default router;
