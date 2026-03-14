import { Router } from "express";
import { getAnalytics, listUsers } from "../controllers/adminController.js";
import { protect, requireAdmin } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect, requireAdmin);
router.get("/users", listUsers);
router.get("/analytics", getAnalytics);

export default router;
