import cors from "cors";
import express, { Response } from "express";
import { CORS_ORIGIN, GUILD_ID, PORT } from "./config";
import { loginToBot } from "./discord";
import routes from "./routes";
import dbConnect from "./utils/dbconn.util";
import { deployCommandsToGuild } from "./utils/discord.utils";
import { errorHandler } from "./middlewares/errorHandler.middleware";

// CORS configuration options
const corsOptions = {
  origin: CORS_ORIGIN, // Ensure this is set to the required origin
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "ngrok-skip-browser-warning",
  ],
} as cors.CorsOptions;

const app = express();

// Middleware setup
app.use(cors(corsOptions));
app.use(express.json());
app.use(routes);

// Connect to the database and start the server
dbConnect()
  .then(() => {
    app.listen(PORT, async () => {
      console.log(`Server listening on port ${PORT}`);
      await deployCommandsToGuild(GUILD_ID);
      loginToBot();
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1); // Exit the process if the database connection fails
  });

// Home route handler
app.get("/", (_, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "Hello from authify!!",
  });
});

// 404 route handler
app.use((_, res: Response) => {
  return res.status(404).json({
    success: false,
    code: 404,
    error: "Not found",
  });
});

// Error handling middleware
app.use(errorHandler);
