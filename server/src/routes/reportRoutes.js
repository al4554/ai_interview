import { Router } from "express";
import { downloadReportPdf, getReport } from "../controllers/reportController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);
router.get("/:id", getReport);
router.get("/:id/pdf", downloadReportPdf);

export default router;
