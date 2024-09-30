import { Router } from "express";

import { loginSchema } from "../modules/auth/auth.schema";
import { tryCatchWrapper } from "../utils/try-catch.util";
import { AuthService } from "../modules/auth/auth.service";
import { validate } from "../middlewares/validator.middleware";
import { AuthController } from "../modules/auth/auth.controller";
import { KnexUserRepository } from "../modules/users/knex-user.repository";

const router: Router = Router();
const authController = new AuthController(new AuthService(new KnexUserRepository()));

router.post("/google/consent", tryCatchWrapper(authController.googleConsent));
router.post("/google/callback", validate(loginSchema), tryCatchWrapper(authController.googleCallback));
router.post("/generate-access-token", tryCatchWrapper(authController.generateAccessToken));

export default router;
