# LegionTask — Server AI Context

> Backend-specific context. Read `../../AGENTS.md` first for the full project overview.

---

## 1. Overview

Express REST API server written in TypeScript. Uses Prisma ORM to communicate with a PostgreSQL database.

- **Entry point:** `src/index.ts`
- **Port:** `3000` (default, overridable via `PORT` env var)
- **Type:** `commonjs` (Node.js module system)
- **Dev runner:** `nodemon --ext ts --exec node --loader ts-node/esm src/index.ts`

## 2. Folder Structure

```
server/src/
├── index.ts              ← Express app setup and server startup
├── controllers/
│   ├── ProjectController.ts  ← getProjects, createProject
│   └── TaskController.ts     ← getTasks, createTask, updateTaskStatus
└── routes/
    ├── ProjectRoutes.ts      ← GET /projects, POST /projects
    └── TaskRoutes.ts         ← GET /tasks, POST /tasks, PATCH /tasks/:taskId/status

server/prisma/
└── schema.prisma         ← Database schema (source of truth)
```

## 3. Adding New Endpoints

Follow this pattern for every new feature:

1. **Add to `schema.prisma`** if a new model or field is needed → run `pnpm exec prisma migrate dev`.
2. **Create/update controller** in `src/controllers/` — one file per resource.
3. **Create/update route file** in `src/routes/` — one file per resource.
4. **Register route** in `src/index.ts` with `app.use('/resource', resourceRoutes)`.

**Controller template:**
```ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getItems = async (req: Request, res: Response): Promise<void> => {
    try {
        const items = await prisma.item.findMany();
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: "Error retrieving items.", err });
    }
};
```

## 4. Current API Endpoints

### Projects — `src/routes/ProjectRoutes.ts`

| Method | Path | Controller | Description |
|---|---|---|---|
| GET | `/projects` | `getProjects` | Fetch all projects |
| POST | `/projects` | `createProject` | Create a new project |

**POST /projects body:**
```json
{ "name": "string", "description": "string?", "startDate": "ISO8601?", "endDate": "ISO8601?" }
```

### Tasks — `src/routes/TaskRoutes.ts`

| Method | Path | Controller | Description |
|---|---|---|---|
| GET | `/tasks` | `getTasks` | Get tasks (filter by `?projectId=`) |
| POST | `/tasks` | `createTask` | Create a new task |
| PATCH | `/tasks/:taskId/status` | `updateTaskStatus` | Update task status only |

**GET /tasks query params:** `projectId` (number, required for filtering)

**POST /tasks body:**
```json
{
  "title": "string",
  "description": "string?",
  "status": "string?",
  "priority": "string?",
  "tags": "string?",
  "startDate": "ISO8601?",
  "dueDate": "ISO8601?",
  "points": "number?",
  "projectId": "number",
  "authorUserId": "number",
  "assignedUserId": "number?"
}
```

**PATCH /tasks/:taskId/status body:**
```json
{ "status": "string" }
```

## 5. Known Bugs in Controllers (Fix These!)

### `getTasks` — wrong query extraction
```ts
// ❌ BUG: returns whole query object, not just projectId
const projectId = req.query;

// ✅ FIX:
const { projectId } = req.query;
```

### `updateTaskStatus` — destructuring params and body
```ts
// ❌ BUG: taskId and status are objects, not primitives
const taskId = req.params;
const status = req.body;

// ✅ FIX:
const { taskId } = req.params;
const { status } = req.body;
```

## 6. Prisma Usage

- **Client instantiation:** `new PrismaClient()` is currently called once per controller file. 
  For production, create a singleton at `src/lib/prisma.ts`:
  ```ts
  import { PrismaClient } from "@prisma/client";
  const prisma = new PrismaClient();
  export default prisma;
  ```
  Then import it: `import prisma from '../lib/prisma';`

- **Useful Prisma commands:**
  ```bash
  pnpm exec prisma migrate dev     # Apply schema changes and create migration
  pnpm exec prisma generate        # Regenerate Prisma client after schema change
  pnpm exec prisma studio          # Open Prisma Studio (DB GUI)
  pnpm seed                        # Run the seed script (prisma/seed.ts)
  ```

- **Binary targets** in `schema.prisma` are set to `["native", "rhel-openssl-3.0.x"]` for Linux deployment compatibility.

## 7. Middleware Stack (in order)

Registered in `src/index.ts`:
1. `bodyParser.json()` — parses JSON request bodies
2. `bodyParser.urlencoded({ extended: false })` — parses URL-encoded bodies
3. `cors()` — allows all origins (⚠️ restrict in production)
4. `helmet()` — sets security headers
5. `helmet.crossOriginResourcePolicy({ policy: "cross-origin" })` — allows cross-origin resource sharing
6. `morgan("common")` — HTTP request logging

## 8. Planned Endpoints (Not Yet Implemented)

| Method | Path | Notes |
|---|---|---|
| PUT | `/tasks/:id` | Full task update |
| DELETE | `/tasks/:id` | Delete task |
| GET | `/users` | List all users (for assignment dropdowns) |
| GET | `/users/:id` | Get user by ID |
| POST | `/users` | Create user (or from Cognito webhook) |
| GET | `/teams` | List all teams |
| POST | `/teams` | Create a team |
| GET | `/tasks/:id/comments` | Get comments for a task |
| POST | `/tasks/:id/comments` | Add a comment |
| POST | `/tasks/:id/attachments` | Upload an attachment |
| GET | `/projects/:id` | Get single project |
| DELETE | `/projects/:id` | Delete project |

## 9. Authentication (Planned)

The `User` model has a `cognitoId` field — AWS Cognito integration is planned.

When implementing:
1. Add a JWT middleware that verifies the Cognito token from the `Authorization: Bearer <token>` header.
2. Attach the decoded user to `req.user`.
3. Apply the middleware globally or per-route.
4. Never trust `authorUserId` from the request body — derive it from `req.user.cognitoId`.

## 10. Environment Variables

Required in `server/.env`:
```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB_NAME
PORT=3000
```

Add validation on startup (e.g., with `zod` or a simple check) to fail fast if these are missing.

## 11. Scripts

```bash
pnpm dev          # Start development server with hot reload
pnpm seed         # Seed the database using prisma/seed.ts
```
