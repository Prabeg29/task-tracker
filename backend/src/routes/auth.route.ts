import { Router } from "express";

import { tryCatchWrapper } from "../utils/try-catch.util";
import { AuthService } from "../modules/auth/auth.service";
import { validate } from "../middlewares/validator.middleware";
import { AuthController } from "../modules/auth/auth.controller";
import { KnexUserRepository } from "../modules/users/knex-user.repository";
import { googleLoginSchema, loginSchema, registrationSchema } from "../modules/auth/auth.schema";

const router: Router = Router();
const authController = new AuthController(new AuthService(new KnexUserRepository()));

router.post("/register", validate(registrationSchema), tryCatchWrapper(authController.register));
router.post("/login", validate(loginSchema), tryCatchWrapper(authController.login));
router.post("/google/consent", tryCatchWrapper(authController.googleConsent));
router.post("/google/callback", validate(googleLoginSchema), tryCatchWrapper(authController.googleCallback));
router.post("/generate-access-token", tryCatchWrapper(authController.generateAccessToken));

export default router;
