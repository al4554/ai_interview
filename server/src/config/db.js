import mongoose from "mongoose";

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is missing in environment variables");
  }

  const conn = await mongoose.connect(mongoUri, {
    autoIndex: true
  });

  return conn.connection.host;
};
