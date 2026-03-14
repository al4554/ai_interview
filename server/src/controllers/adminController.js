import asyncHandler from "express-async-handler";
import Interview from "../models/Interview.js";
import User from "../models/User.js";

export const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("name email role createdAt").sort({ createdAt: -1 });

  res.json({
    success: true,
    data: users
  });
});

export const getAnalytics = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalInterviews,
    completedInterviews,
    avgScores,
    interviewsByType,
    activeUsers
  ] = await Promise.all([
    User.countDocuments(),
    Interview.countDocuments(),
    Interview.countDocuments({ status: "completed" }),
    Interview.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: null,
          overall: { $avg: "$scores.overall" },
          communication: { $avg: "$scores.communication" },
          technical: { $avg: "$scores.technical" },
          confidence: { $avg: "$scores.confidence" }
        }
      }
    ]),
    Interview.aggregate([
      {
        $group: {
          _id: "$interviewType",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]),
    Interview.distinct("user")
  ]);

  const scoreBlock = avgScores[0] || {
    overall: 0,
    communication: 0,
    technical: 0,
    confidence: 0
  };

  res.json({
    success: true,
    data: {
      totals: {
        totalUsers,
        activeUsers: activeUsers.length,
        totalInterviews,
        completedInterviews
      },
      averageScores: {
        overall: Math.round(scoreBlock.overall || 0),
        communication: Math.round(scoreBlock.communication || 0),
        technical: Math.round(scoreBlock.technical || 0),
        confidence: Math.round(scoreBlock.confidence || 0)
      },
      interviewsByType
    }
  });
});
