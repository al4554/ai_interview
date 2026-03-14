import { Router } from "express";
import multer from "multer";
import {
  answerQuestion,
  completeInterview,
  getInterviewById,
  getInterviewHistory,
  startInterview,
  uploadResumeText
} from "../controllers/interviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(protect);
router.post("/start", startInterview);
router.post("/upload-resume", upload.single("resume"), uploadResumeText);
router.post("/:id/answer", answerQuestion);
router.post("/:id/complete", completeInterview);
router.get("/history", getInterviewHistory);
router.get("/:id", getInterviewById);

export default router;
