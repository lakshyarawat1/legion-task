import express from "express";
import dotenv from "dotenv";
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

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(clerkMiddleware({
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY,
}));

import { requireAuthMiddleware, requireLocalUser } from "./middleware/authMiddleware";

app.get("/", (req, res) => {
  res.send("Hello World!");
});



app.use("/projects", requireAuthMiddleware, requireLocalUser, projectRoutes);
app.use("/tasks", requireAuthMiddleware, requireLocalUser, taskRoutes);
app.use("/users", requireAuthMiddleware, requireLocalUser, userRoutes);
app.use("/teams", requireAuthMiddleware, requireLocalUser, teamRoutes);
app.use("/search", requireAuthMiddleware, requireLocalUser, searchRoutes);
app.use("/comments", requireAuthMiddleware, requireLocalUser, commentRoutes);
app.use("/attachments", requireAuthMiddleware, requireLocalUser, attachmentRoutes);
app.use("/orgs", requireAuthMiddleware, requireLocalUser, orgRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});