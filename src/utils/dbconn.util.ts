import mongoose from "mongoose";
import { MONGO_URI } from "../config";

/**
 * Connects to MongoDB
 * @returns {Promise<void>}
 * @throws {Error}
 * @description Connects to MongoDB using the MONGO_URI config variable.
 */
async function dbConnect(): Promise<void> {
	try {
		console.log("Connecting to MongoDB...");
		mongoose.set("strictQuery", false);
		await mongoose.connect(MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		} as mongoose.ConnectOptions);
		console.log("Connected to MongoDB !\n");
		mongoose.connection.on("error", (error: Error) => {
			console.error("Connection error:", error);
			throw error;
		});
	} catch (error) {
		throw error;
	}
}

export default dbConnect;
