import mongoose, { ConnectOptions } from "mongoose";
import config from "./config/config";

export async function connectToDatabase() {
  try {
    const mongooseOptions = {
      w: "majority",
      retryWrites: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions;

    const db = await mongoose.connect(config.mongo.url, mongooseOptions);
    console.log("Connected to MongoDB! Using", db.connection.name);
  } catch (error) {
    console.log((error as Error).stack);
  }
}
