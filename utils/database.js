
import mongoose from "mongoose";

export const mongoConnect = async (cb) => {
  try {
    const uri = process.env.MONGO_URL;

    if (!uri) {
      throw new Error("MONGO_URL environment variable missing");
    }

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB Atlas connected successfully");

    if (cb) cb();
  } catch (err) {
  console.error("Error name:", err.name);
  console.error("Error message:", err.message);

  if (err.reason?.servers) {
    for (const [address, server] of err.reason.servers) {
      console.log("Server:", address);
      console.log("Server type:", server.type);
      console.log("Server error:", server.error?.message);
    }
  }
};
}