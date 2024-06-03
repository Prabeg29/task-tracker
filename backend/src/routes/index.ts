import { Router } from "express";

import authRoute from "./auth.route";
import taskRoute from "./task.route";

const router: Router = Router();

router.get("/ping", (_req, res) => res.json({ message: "pong" }));
router.use("/auth", authRoute);
router.use("/tasks", taskRoute);

export default router;
