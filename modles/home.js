import mongoose from "mongoose";

const homeSchema = new mongoose.Schema({
  houseName: { type: String, required: true },
  price: { type: String, required: true },
  location: { type: String, required: true },
  file: { type: String, required: true },
});

export const Home = mongoose.model("Home", homeSchema);
