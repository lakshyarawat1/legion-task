import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import projectRoutes from "./routes/ProjectRoutes";
import taskRoutes from "./routes/TaskRoutes";
import userRoutes from "./routes/UserRoutes";
import teamRoutes from "./routes/TeamRoutes";
import searchRoutes from "./routes/SearchRoutes";
import commentRoutes from "./routes/CommentRoutes";
import attachmentRoutes from "./routes/AttachmentRoutes";
import orgRoutes from "./routes/OrgRoutes";
import { clerkMiddleware } from "@clerk/express";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:3000", "http://localhost:3001"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl/Postman requests)
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));

// Global logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(clerkMiddleware({
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY,
}));

import { requireAuthMiddleware, requireLocalUser, requireOrg } from "./middleware/authMiddleware";

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/orgs", requireAuthMiddleware, requireLocalUser, orgRoutes);
app.use("/projects", requireAuthMiddleware, requireLocalUser, requireOrg, projectRoutes);
app.use("/tasks", requireAuthMiddleware, requireLocalUser, requireOrg, taskRoutes);
app.use("/users", requireAuthMiddleware, requireLocalUser, requireOrg, userRoutes);
app.use("/teams", requireAuthMiddleware, requireLocalUser, requireOrg, teamRoutes);
app.use("/search", requireAuthMiddleware, requireLocalUser, requireOrg, searchRoutes);
app.use("/comments", requireAuthMiddleware, requireLocalUser, requireOrg, commentRoutes);
app.use("/attachments", requireAuthMiddleware, requireLocalUser, requireOrg, attachmentRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});