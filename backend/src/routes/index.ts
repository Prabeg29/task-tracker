import { Router } from "express";

import authRoute from "./auth.route";

const router: Router = Router();

router.get("/ping", (_req, res) => res.json({ message: 'pong' }));
router.use("/auth", authRoute);

export default router;
