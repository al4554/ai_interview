import asyncHandler from "express-async-handler";
import Interview from "../models/Interview.js";
import { evaluateAnswer, generateFinalSummary, generateFirstQuestion } from "../services/interviewEngine.js";

const mergeUnique = (base, incoming, limit = 6) => {
  const merged = [...(base || []), ...(incoming || [])].filter(Boolean);
  return [...new Set(merged)].slice(0, limit);
};

const averageScores = (currentScores, newScores, turnCount) => {
  const safeTurns = Math.max(turnCount, 1);

  const communication = Math.round(
    (currentScores.communication * (safeTurns - 1) + newScores.communication) / safeTurns
  );
  const technical = Math.round((currentScores.technical * (safeTurns - 1) + newScores.technical) / safeTurns);
  const confidence = Math.round((currentScores.confidence * (safeTurns - 1) + newScores.confidence) / safeTurns);

  return {
    communication,
    technical,
    confidence,
    overall: Math.round((communication + technical + confidence) / 3)
  };
};

const getSessionConfig = (interview) => ({
  jobRole: interview.jobRole,
  experienceLevel: interview.experienceLevel,
  interviewType: interview.interviewType,
  resumeText: interview.resumeText || ""
});

export const startInterview = asyncHandler(async (req, res) => {
  const { jobRole, experienceLevel, interviewType, resumeText = "" } = req.body;

  if (!jobRole || !interviewType) {
    res.status(400);
    throw new Error("Job role and interview type are required.");
  }

  const firstTurn = await generateFirstQuestion({
    jobRole,
    experienceLevel: experienceLevel || "Junior",
    interviewType,
    resumeText
  });

  const interview = await Interview.create({
    user: req.user._id,
    jobRole,
    experienceLevel: experienceLevel || "Junior",
    interviewType,
    resumeText,
    questionCount: 1,
    messages: [
      {
        role: "assistant",
        content: firstTurn.question,
        feedback: firstTurn.feedback
      }
    ],
    scores: {
      communication: firstTurn.scores.communication,
      technical: firstTurn.scores.technical,
      confidence: firstTurn.scores.confidence,
      overall: Math.round(
        (firstTurn.scores.communication + firstTurn.scores.technical + firstTurn.scores.confidence) / 3
      )
    },
    summary: {
      strengths: firstTurn.strengths,
      weaknesses: firstTurn.weaknesses,
      tips: firstTurn.tips
    }
  });

  res.status(201).json({
    success: true,
    data: {
      interview,
      currentQuestion: firstTurn.question,
      questionType: firstTurn.questionType,
      difficulty: firstTurn.difficulty
    }
  });
});

export const uploadResumeText = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("Resume file is required.");
  }

  const text = req.file.buffer.toString("utf-8").replace(/\s+/g, " ").trim();

  res.json({
    success: true,
    data: {
      resumeText: text.slice(0, 8000)
    }
  });
});

export const answerQuestion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { answer, maxQuestions = 10 } = req.body;

  if (!answer) {
    res.status(400);
    throw new Error("Answer is required.");
  }

  const interview = await Interview.findOne({ _id: id, user: req.user._id });

  if (!interview) {
    res.status(404);
    throw new Error("Interview not found.");
  }

  if (interview.status === "completed") {
    res.status(400);
    throw new Error("Interview is already completed.");
  }

  interview.messages.push({
    role: "user",
    content: answer
  });

  const conversation = interview.messages.map((message) => ({
    role: message.role,
    content: message.content
  }));

  const turn = await evaluateAnswer({
    config: getSessionConfig(interview),
    conversation,
    answer,
    questionNumber: interview.questionCount,
    maxQuestions: Number(maxQuestions)
  });

  interview.messages.push({
    role: "assistant",
    content: turn.question,
    feedback: turn.feedback
  });

  interview.questionCount += 1;
  interview.scores = averageScores(interview.scores, turn.scores, interview.questionCount);
  interview.summary = {
    strengths: mergeUnique(interview.summary?.strengths, turn.strengths, 6),
    weaknesses: mergeUnique(interview.summary?.weaknesses, turn.weaknesses, 6),
    tips: mergeUnique(interview.summary?.tips, turn.tips, 8)
  };

  if (turn.isInterviewComplete) {
    interview.status = "completed";
    interview.endedAt = new Date();
    interview.durationSeconds = Math.max(
      1,
      Math.round((interview.endedAt.getTime() - interview.startedAt.getTime()) / 1000)
    );
  }

  await interview.save();

  res.json({
    success: true,
    data: {
      interviewId: interview._id,
      status: interview.status,
      questionCount: interview.questionCount,
      aiMessage: turn.question,
      feedback: turn.feedback,
      difficulty: turn.difficulty,
      questionType: turn.questionType,
      scores: interview.scores,
      isInterviewComplete: turn.isInterviewComplete
    }
  });
});

export const completeInterview = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const interview = await Interview.findOne({ _id: id, user: req.user._id });

  if (!interview) {
    res.status(404);
    throw new Error("Interview not found.");
  }

  const conversation = interview.messages.map((message) => ({
    role: message.role,
    content: message.content
  }));

  const report = await generateFinalSummary({
    config: getSessionConfig(interview),
    conversation
  });

  interview.status = "completed";
  interview.endedAt = new Date();
  interview.durationSeconds = Math.max(
    1,
    Math.round((interview.endedAt.getTime() - interview.startedAt.getTime()) / 1000)
  );
  interview.scores = {
    overall: report.overallScore,
    communication: report.communicationScore,
    technical: report.technicalScore,
    confidence: report.confidenceScore
  };
  interview.summary = {
    strengths: report.strengths,
    weaknesses: report.weaknesses,
    tips: report.tips
  };

  await interview.save();

  res.json({
    success: true,
    data: interview
  });
});

export const getInterviewHistory = asyncHandler(async (req, res) => {
  const interviews = await Interview.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .select("jobRole experienceLevel interviewType status scores summary createdAt questionCount durationSeconds");

  res.json({
    success: true,
    data: interviews
  });
});

export const getInterviewById = asyncHandler(async (req, res) => {
  const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id });

  if (!interview) {
    res.status(404);
    throw new Error("Interview not found.");
  }

  res.json({
    success: true,
    data: interview
  });
});
