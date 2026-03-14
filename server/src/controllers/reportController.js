import asyncHandler from "express-async-handler";
import PDFDocument from "pdfkit";
import Interview from "../models/Interview.js";

export const getReport = asyncHandler(async (req, res) => {
  const interview = await Interview.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!interview) {
    res.status(404);
    throw new Error("Interview report not found.");
  }

  if (interview.status !== "completed") {
    res.status(400);
    throw new Error("Interview must be completed before generating a report.");
  }

  res.json({
    success: true,
    data: {
      id: interview._id,
      jobRole: interview.jobRole,
      interviewType: interview.interviewType,
      experienceLevel: interview.experienceLevel,
      scores: interview.scores,
      summary: interview.summary,
      durationSeconds: interview.durationSeconds,
      createdAt: interview.createdAt
    }
  });
});

export const downloadReportPdf = asyncHandler(async (req, res) => {
  const interview = await Interview.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!interview) {
    res.status(404);
    throw new Error("Interview report not found.");
  }

  const filename = `mock-interview-report-${interview._id}.pdf`;

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=\"${filename}\"`);

  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(res);

  doc.fontSize(24).text("AI Mock Interview Report", { align: "left" });
  doc.moveDown(0.5);
  doc.fontSize(12).text(`Role: ${interview.jobRole}`);
  doc.text(`Type: ${interview.interviewType}`);
  doc.text(`Experience: ${interview.experienceLevel}`);
  doc.text(`Duration: ${interview.durationSeconds}s`);
  doc.moveDown();

  doc.fontSize(16).text("Scores");
  doc.fontSize(12).text(`Overall: ${interview.scores.overall}`);
  doc.text(`Communication: ${interview.scores.communication}`);
  doc.text(`Technical: ${interview.scores.technical}`);
  doc.text(`Confidence: ${interview.scores.confidence}`);
  doc.moveDown();

  doc.fontSize(16).text("Strengths");
  (interview.summary?.strengths || []).forEach((item) => doc.fontSize(12).text(`- ${item}`));
  doc.moveDown();

  doc.fontSize(16).text("Weaknesses");
  (interview.summary?.weaknesses || []).forEach((item) => doc.fontSize(12).text(`- ${item}`));
  doc.moveDown();

  doc.fontSize(16).text("Improvement Tips");
  (interview.summary?.tips || []).forEach((item) => doc.fontSize(12).text(`- ${item}`));

  doc.end();
});
