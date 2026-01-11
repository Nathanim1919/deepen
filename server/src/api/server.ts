import "dotenv/config";
import express, { Express } from "express";
import cors from "cors";
import captureRoutes from "./routes/captureRoutes";
import collectionRoutes from "./routes/collectionRoute";
import sourceRoutes from "./routes/sourceRoute"; // Import source routes
import { userProfileRoutes } from "./routes/userRoute";
import aiChatRoutes from "./routes/chatRoutes";
import brainAiRoutes from "./routes/brainAiRoute";
import feedbackRoutes from "./routes/feedbackRoutes";
import waitlistRoutes from "./routes/waitlistRoute";
import { auth } from "../lib/auth";
import { toNodeHandler } from "better-auth/node";
import { Request, Response } from "express";
import dotenv from "dotenv";
// import bodyParser from "body-parser";
import { connectMongo } from "../common/config/database";
dotenv.config();

const app: Express = express();

// Connect to MongoDB
connectMongo();

// Prefer the platform-provided PORT; fallback to 3000 for local dev
const port = Number(process.env.PORT) || 3000;
// Prefer the platform-provided HOST; bind to 0.0.0.0 by default so health checks can reach the process
const host = process.env.HOST || "0.0.0.0";

// Increase payload limit to 10MB

// Configure CORS middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://deepen.live",
      "https://www.deepen.live",
      "https://deepen-ten.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);

app.all("/api/auth/*splat", (req: Request, res: Response) => {
  toNodeHandler(auth)(req, res);
});

// JSON body parser (ensure enough limit for large text content)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Routes
app.use("/api/v1/captures", captureRoutes);
app.use("/api/v1/folders", collectionRoutes);
app.use("/api/v1/sources", sourceRoutes); // Use source routes
app.use("/api/v1/user", userProfileRoutes);
app.use("/api/v1/ai", aiChatRoutes);
app.use("/api/v1/brain", brainAiRoutes);
app.use("/api/v1/feedback", feedbackRoutes);
app.use("/api/v1/waitlist", waitlistRoutes);

// Health check
app.get("/health", (_: Request, res: Response) => {
  res.json({ status: "ok", message: "Server is healthy" });
});

// Start server
app.listen(port, host, () => {
  console.log(`⚡️[server]: Server is running at http://${host}:${port}`);
});
