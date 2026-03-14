import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["system", "assistant", "user"],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    feedback: {
      type: String,
      default: ""
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    _id: false
  }
);

const scoreSchema = new mongoose.Schema(
  {
    overall: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
    technical: { type: Number, default: 0 },
    confidence: { type: Number, default: 0 }
  },
  { _id: false }
);

const summarySchema = new mongoose.Schema(
  {
    strengths: { type: [String], default: [] },
    weaknesses: { type: [String], default: [] },
    tips: { type: [String], default: [] }
  },
  { _id: false }
);

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    jobRole: {
      type: String,
      required: true,
      trim: true
    },
    experienceLevel: {
      type: String,
      enum: ["Intern", "Junior", "Mid", "Senior", "Lead"],
      default: "Junior"
    },
    interviewType: {
      type: String,
      enum: ["Technical", "Behavioral", "System Design", "Mixed"],
      required: true
    },
    status: {
      type: String,
      enum: ["in_progress", "completed"],
      default: "in_progress"
    },
    questionCount: {
      type: Number,
      default: 0
    },
    messages: {
      type: [messageSchema],
      default: []
    },
    scores: {
      type: scoreSchema,
      default: () => ({})
    },
    summary: {
      type: summarySchema,
      default: () => ({})
    },
    resumeText: {
      type: String,
      default: ""
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    endedAt: {
      type: Date,
      default: null
    },
    durationSeconds: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

interviewSchema.index({ user: 1, createdAt: -1 });

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;
