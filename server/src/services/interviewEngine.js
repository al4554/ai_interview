import { requestGroqCompletion } from "./groqService.js";
import { parseModelOutput } from "../utils/parseModelOutput.js";

const defaultTurn = {
  question: "Tell me about a recent project you worked on and what impact it created.",
  questionType: "Behavioral",
  difficulty: "Medium",
  feedback: "Good start. Add more measurable impact and technical specifics.",
  scores: {
    communication: 72,
    technical: 68,
    confidence: 70
  },
  strengths: ["Clear structure"],
  weaknesses: ["Could include stronger metrics"],
  tips: ["Use STAR framework and mention outcomes with numbers."],
  isInterviewComplete: false
};

const buildSystemPrompt = ({ jobRole, experienceLevel, interviewType, resumeText }) => {
  return [
    "You are an expert AI interviewer.",
    "Conduct a mock interview one question at a time.",
    `Target role: ${jobRole}`,
    `Experience level: ${experienceLevel}`,
    `Interview type: ${interviewType}`,
    resumeText ? `Candidate resume context: ${resumeText.slice(0, 2000)}` : "No resume provided.",
    "Instructions:",
    "1) Ask only one concise question.",
    "2) Adapt question difficulty based on previous answer quality.",
    "3) Ask follow-ups when answer depth is low.",
    "4) Evaluate latest answer and provide tactical feedback.",
    "Return only valid JSON with schema:",
    "{",
    '  "question": "string",',
    '  "questionType": "Technical|Behavioral|System Design|Mixed",',
    '  "difficulty": "Easy|Medium|Hard",',
    '  "feedback": "string",',
    '  "scores": { "communication": 0-100, "technical": 0-100, "confidence": 0-100 },',
    '  "strengths": ["string"],',
    '  "weaknesses": ["string"],',
    '  "tips": ["string"],',
    '  "isInterviewComplete": true|false',
    "}"
  ].join("\n");
};

const normalizeTurn = (output) => {
  const parsed = parseModelOutput(output, defaultTurn);

  const communication = Number(parsed?.scores?.communication ?? defaultTurn.scores.communication);
  const technical = Number(parsed?.scores?.technical ?? defaultTurn.scores.technical);
  const confidence = Number(parsed?.scores?.confidence ?? defaultTurn.scores.confidence);

  return {
    question: parsed?.question || defaultTurn.question,
    questionType: parsed?.questionType || defaultTurn.questionType,
    difficulty: parsed?.difficulty || defaultTurn.difficulty,
    feedback: parsed?.feedback || defaultTurn.feedback,
    scores: {
      communication: Math.max(0, Math.min(100, communication)),
      technical: Math.max(0, Math.min(100, technical)),
      confidence: Math.max(0, Math.min(100, confidence))
    },
    strengths: Array.isArray(parsed?.strengths) ? parsed.strengths.slice(0, 3) : defaultTurn.strengths,
    weaknesses: Array.isArray(parsed?.weaknesses) ? parsed.weaknesses.slice(0, 3) : defaultTurn.weaknesses,
    tips: Array.isArray(parsed?.tips) ? parsed.tips.slice(0, 5) : defaultTurn.tips,
    isInterviewComplete: Boolean(parsed?.isInterviewComplete)
  };
};

export const generateFirstQuestion = async (config) => {
  const messages = [
    { role: "system", content: buildSystemPrompt(config) },
    {
      role: "user",
      content: "Start the interview. Ask question 1 only and return JSON."
    }
  ];

  const output = await requestGroqCompletion({
    messages,
    temperature: 0.4,
    maxTokens: 500
  });

  return normalizeTurn(output);
};

export const evaluateAnswer = async ({ config, conversation, answer, questionNumber, maxQuestions = 10 }) => {
  const messages = [
    { role: "system", content: buildSystemPrompt(config) },
    ...conversation,
    {
      role: "user",
      content: [
        `Latest candidate answer: ${answer}`,
        `Current question number: ${questionNumber}`,
        `Maximum questions allowed: ${maxQuestions}`,
        "Evaluate the answer, then provide the next question in JSON format."
      ].join("\n")
    }
  ];

  const output = await requestGroqCompletion({
    messages,
    temperature: 0.55,
    maxTokens: 700
  });

  const turn = normalizeTurn(output);

  if (questionNumber >= maxQuestions) {
    turn.isInterviewComplete = true;
  }

  return turn;
};

export const generateFinalSummary = async ({ config, conversation }) => {
  const fallback = {
    overallScore: 70,
    communicationScore: 72,
    technicalScore: 68,
    confidenceScore: 70,
    strengths: ["Clear thought process", "Good collaboration mindset"],
    weaknesses: ["Needs sharper technical depth in edge cases"],
    tips: ["Practice concise architecture explanations", "Use metrics in answers"]
  };

  const messages = [
    { role: "system", content: buildSystemPrompt(config) },
    ...conversation,
    {
      role: "user",
      content: [
        "Create a final interview report as JSON only.",
        "Schema:",
        "{",
        '  "overallScore": 0-100,',
        '  "communicationScore": 0-100,',
        '  "technicalScore": 0-100,',
        '  "confidenceScore": 0-100,',
        '  "strengths": ["string"],',
        '  "weaknesses": ["string"],',
        '  "tips": ["string"]',
        "}"
      ].join("\n")
    }
  ];

  const output = await requestGroqCompletion({
    messages,
    temperature: 0.3,
    maxTokens: 600
  });

  const parsed = parseModelOutput(output, fallback);

  return {
    overallScore: Number(parsed?.overallScore ?? fallback.overallScore),
    communicationScore: Number(parsed?.communicationScore ?? fallback.communicationScore),
    technicalScore: Number(parsed?.technicalScore ?? fallback.technicalScore),
    confidenceScore: Number(parsed?.confidenceScore ?? fallback.confidenceScore),
    strengths: Array.isArray(parsed?.strengths) ? parsed.strengths.slice(0, 4) : fallback.strengths,
    weaknesses: Array.isArray(parsed?.weaknesses) ? parsed.weaknesses.slice(0, 4) : fallback.weaknesses,
    tips: Array.isArray(parsed?.tips) ? parsed.tips.slice(0, 6) : fallback.tips
  };
};
