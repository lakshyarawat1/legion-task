# LegionTask — AI Agent Context (Root)

> This file provides complete project context for AI models working on this codebase.
> Sub-workspace context lives in `client/AGENTS.md` and `server/AGENTS.md`.

---

## 1. Project Overview

**LegionTask** is a full-stack project management platform inspired by tools like Jira/Asana.
It is designed for teams to manage projects, tasks, priorities, timelines, and collaboration.

**Monorepo structure** — two separate Node workspaces inside one Git repo:
```
legion-task/          ← Git root
├── client/           ← Next.js frontend (port 3001 recommended)
├── server/           ← Express backend API (port 3000)
├── AGENTS.md         ← This file (root context)
└── README.md
```

**Package manager:** `pnpm` (use `pnpm` for all install/run commands — never `npm` or `yarn`).

---

## 2. Tech Stack

### Frontend (`client/`)
| Layer | Technology |
|---|---|
| Framework | Next.js 15.2.1 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 + custom design tokens |
| Dark Mode | `next-themes` (class-based, `darkMode: "class"`) |
| State Management | Redux Toolkit + React-Redux + redux-persist |
| HTTP Client | Axios |
| UI Components | MUI (Material UI) v6, `@mui/x-data-grid` |
| Icons | Lucide React |
| Charts | Recharts |
| Drag & Drop | `react-dnd` + `react-dnd-html5-backend` |
| Gantt Charts | `gantt-task-react` |
| Date Utilities | `date-fns` |
| Formatting | `numeral` |

### Backend (`server/`)
| Layer | Technology |
|---|---|
| Runtime | Node.js (CommonJS) |
| Framework | Express 4 |
| Language | TypeScript 5 |
| ORM | Prisma 6 |
| Database | PostgreSQL |
| Auth | AWS Cognito (planned — `cognitoId` field exists on User model) |
| Security | Helmet, CORS |
| Logging | Morgan |
| Dev Runner | Nodemon + ts-node |

---

## 3. Architecture

```
Browser (Next.js App Router)
       │
       │  HTTP (Axios)
       ▼
Express REST API (port 3000)
       │
       │  Prisma ORM
       ▼
PostgreSQL Database
```

- **No shared types package yet** — client and server define types independently.
- **No authentication middleware yet** — all endpoints are unprotected. AWS Cognito integration is planned.
- **No message queue / real-time** — no WebSockets yet.

---

## 4. Database Schema (Prisma)

Located at `server/prisma/schema.prisma`. Key models:

### User
```
userId (PK), cognitoId (unique), username (unique), profilePictureUrl?, teamId?
→ authoredTasks (Task[]), assignedTasks (Task[]), taskAssignments (TaskAssignment[]),
  attachments (Attachment[]), comments (Comment[]), team (Team?)
```

### Team
```
id (PK), teamName, productOwnerUserId?, projectManagerUserId?
→ projectTeams (ProjectTeam[]), user (User[])
```

### Project
```
id (PK), name, description?, startDate?, endDate?
→ tasks (Task[]), projectTeams (ProjectTeam[])
```

### ProjectTeam (junction)
```
id (PK), teamId, projectId → Team, Project
```

### Task
```
id (PK), title, description?, status?, priority?, tags?, startDate?, dueDate?, points?,
projectId, authorUserId, assignedUserId?
→ project, author (User), assignee (User?), taskAssignments, attachments, comments
```
- `status` values (string, not enum): `"To Do"`, `"Work In Progress"`, `"Under Review"`, `"Completed"`
- `priority` values (string, not enum): `"Urgent"`, `"High"`, `"Medium"`, `"Low"`, `"Backlog"`

### TaskAssignment (junction)
```
id, userId, taskId → User, Task
```

### Attachment
```
id, fileURL, fileName?, taskId, uploadedById → Task, User
```

### Comment
```
id, text, taskId, userId → Task, User
```

---

## 5. API Reference (Current)

Base URL: `http://localhost:3000`

### Projects
| Method | Path | Description |
|---|---|---|
| GET | `/projects` | Get all projects |
| POST | `/projects` | Create a project |

### Tasks
| Method | Path | Description |
|---|---|---|
| GET | `/tasks?projectId=<id>` | Get all tasks for a project (includes author, assignee, comments, attachments) |
| POST | `/tasks` | Create a task |
| PATCH | `/tasks/:taskId/status` | Update task status only |

**Missing endpoints (not yet implemented):**
- `PUT /tasks/:id` — full task update
- `DELETE /tasks/:id`
- `/users` — user listing (needed for assignment dropdowns)
- `/teams` — team management
- `/tasks/:id/comments` — comment CRUD
- `/tasks/:id/attachments` — file upload

---

## 6. Frontend Structure

```
client/src/
├── app/
│   ├── layout.tsx              ← Root layout; wraps everything in DashboardWrapper
│   ├── page.tsx                ← Home page (placeholder "Hi")
│   ├── globals.css             ← Global CSS (Tailwind imports + base resets)
│   ├── dashboardWrapper.tsx    ← Shell layout: Sidebar + Navbar + {children}
│   └── (components)/
│       ├── Navbar/page.tsx     ← Top navbar (search input, ModeToggle, settings link)
│       ├── Sidebar/page.tsx    ← Left sidebar (nav links, projects section, priority section)
│       └── ModeToggle/
│           └── ModeToggle.tsx  ← Dark/light mode toggle (uses next-themes)
└── providers/
    └── ThemeProvider.tsx       ← Thin wrapper around next-themes ThemeProvider
```

**Planned but not yet created pages** (based on Sidebar links):
- `/timeline` — Gantt chart view
- `/search` — Global search
- `/settings` — Settings page
- `/users` — User management
- `/teams` — Team management
- `/priority/urgent`, `/priority/high`, `/priority/medium`, `/priority/low`, `/priority/backlog` — Task priority filtered views

---

## 7. Custom Tailwind Design Tokens

Defined in `client/tailwind.config.ts`:

```
white:              #ffffff
gray-100:           #f3f4f6
gray-200:           #e5e7eb
gray-300:           #d1d5db
gray-500:           #6b7280
gray-700:           #374151
gray-800:           #1f2937
blue-200:           #93c5fd
blue-400:           #60a5fa
blue-500:           #3b82f6
dark-bg:            #101214     ← Primary dark background
dark-secondary:     #1d1f21
dark-tertiary:      #3b3d40
blue-primary:       #0275ff     ← Brand accent
stroke-dark:        #2d3135
```

Dark mode is **class-based** (`darkMode: "class"` in Tailwind). Use `dark:` prefix for dark variants.

---

## 8. Known Bugs & Issues

1. **`getTasks` query bug** — `req.query` returns the whole query object, not just `projectId`.
   Should be: `const { projectId } = req.query;`

2. **`updateTaskStatus` params bug** — `req.params` and `req.body` return objects, not primitives.
   Should be: `const { taskId } = req.params;` and `const { status } = req.body;`

3. **`ThemeProvider` is commented out** — `layout.tsx` has the ThemeProvider import commented out and wraps directly with `DashboardWrapper`. This means `useTheme()` in `ModeToggle` will not work correctly. Fix: wrap with `ThemeProvider` in `layout.tsx`.

4. **`/priority/medium` typo in Sidebar** — the href is `/prioritiy/medium` (extra 'i'). Should be `/priority/medium`.

5. **No environment variable validation** — server will crash silently if `DATABASE_URL` is not set.

6. **`logo.png` is referenced in Sidebar** but may not exist in `client/public/`. Verify this asset exists.

---

## 9. Development Conventions

- **Language:** TypeScript everywhere (strict mode enabled on client).
- **Formatting:** Prettier with `prettier-plugin-tailwindcss` on client (see `client/.prettierrc`).
- **Linting:** ESLint with Next.js config on client.
- **File naming:** PascalCase for React components; camelCase for utilities. Component files use `page.tsx` (Next.js App Router convention).
- **"use client"** directive: Must be at the top of any file using React hooks or browser APIs.
- **Tailwind:** Use the custom design tokens (above) rather than arbitrary values wherever possible.
- **No hardcoded API URLs:** Use environment variables (`NEXT_PUBLIC_API_BASE_URL` on client, `DATABASE_URL` on server).

---

## 10. Environment Variables

### Server (`server/.env`)
```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB_NAME
PORT=3000
```

### Client (`client/.env.local`)
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

---

## 11. Roadmap (Planned Features)

- [ ] Redux Toolkit store setup and API slice (RTK Query or Axios interceptors)
- [ ] Kanban board UI (drag-and-drop using react-dnd)
- [ ] Task list/table view (using @mui/x-data-grid)
- [ ] Task detail modal (edit, comment, attach files)
- [ ] Gantt/Timeline view (gantt-task-react)
- [ ] Priority filter pages
- [ ] Global search page
- [ ] User and Team management pages
- [ ] Complete backend CRUD (tasks, users, teams, comments, attachments)
- [ ] AWS Cognito authentication (server middleware + client Amplify)
- [ ] Settings page
- [ ] Dashboard analytics (Recharts)

---

## 12. Running the Project

```bash
# Start the backend server (from repo root)
cd server && pnpm dev
# Runs on http://localhost:3000

# Start the frontend (from repo root)  
cd client && pnpm dev
# Runs on http://localhost:3001 (or 3000 if server is not running)

# Run Prisma migrations
cd server && pnpm exec prisma migrate dev

# Seed the database
cd server && pnpm seed

# Generate Prisma client after schema changes
cd server && pnpm exec prisma generate
```

---

## 13. Antagonistic Tester Agent & Bug Registry

- **Testing Agent Location**: [.agents/skills/antagonistic_tester/SKILL.md](file:///f:/legion-task/.agents/skills/antagonistic_tester/SKILL.md)
  - This agent is configured to aggressively test for bugs, crashes, input validation weaknesses, and security vulnerabilities.
- **Bugs Registry**: [bugs/](file:///f:/legion-task/bugs/)
  - All identified bugs are logged in the `bugs/` directory as markdown files (`BUG-XXX.md`).
  - Developer agents should check this directory for unresolved issues, fix them, and update the report once fixed.

---

## 14. System Architect Agent & Architectural Blueprints Registry

- **Architect Agent Location**: [.agents/skills/system_architect/SKILL.md](file:///f:/legion-task/.agents/skills/system_architect/SKILL.md)
  - This agent is configured to design optimized, secure, scalable, and production-ready architectures.
- **Architecture Registry**: [architecture/](file:///f:/legion-task/architecture/)
  - All proposed architectural blueprints are logged in the `architecture/` directory as markdown files (`ARCH-XXX.md`).
  - Developer agents should implement designs from this folder.

---

## 15. Developer Agent

- **Developer Agent Location**: [.agents/skills/developer/SKILL.md](file:///f:/legion-task/.agents/skills/developer/SKILL.md)
  - This agent is configured to read proposed blueprints from the `architecture/` directory and implement them with maximum accuracy across the monorepo, updating the blueprint's status once completed.

---

## 16. Bug Fixer Agent

- **Bug Fixer Agent Location**: [.agents/skills/bug_fixer/SKILL.md](file:///f:/legion-task/.agents/skills/bug_fixer/SKILL.md)
  - This agent is configured to look for active bug reports in the `bugs/` directory, write fixes, and perform regression and unit/integration testing to ensure everything is resolved and functional.




