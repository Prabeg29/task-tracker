import { Router } from "express";

import { tryCatchWrapper } from "../utils/try-catch.util";
import { UserService } from "../modules/users/user.service";
import { validate } from "../middlewares/validator.middleware";
import { AuthController } from "../modules/auth/auth.controller";
import { KnexUserRepository } from "../modules/users/knex-user.repository";
import { registrationSchema, loginSchema } from "../modules/auth/auth.schema";

const router: Router = Router();
const authController = new AuthController(new UserService(new KnexUserRepository()));

router.post("/register", validate(registrationSchema), tryCatchWrapper(authController.register));
router.post("/login", validate(loginSchema), tryCatchWrapper(authController.login));

export default router;
