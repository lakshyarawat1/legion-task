# LegionTask — Client AI Context

> Frontend-specific context. Read `../../AGENTS.md` first for the full project overview.

---

## 1. Framework & Entry Points

- **Framework:** Next.js 15.2.1, **App Router** (the `src/app/` directory convention).
- **Root Layout:** `src/app/layout.tsx` — wraps all pages with `DashboardWrapper`.
- **DashboardWrapper:** `src/app/dashboardWrapper.tsx` — renders `<Sidebar>` + `<Navbar>` + `{children}`.
- **Home Page:** `src/app/page.tsx` — currently just a placeholder (`"Hi"`).

## 2. Folder Structure

```
client/src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── dashboardWrapper.tsx
│   └── (components)/                ← Shared layout components (Next.js route group)
│       ├── Navbar/page.tsx
│       ├── Sidebar/page.tsx
│       └── ModeToggle/ModeToggle.tsx
└── providers/
    └── ThemeProvider.tsx
```

**Route groups** (`(components)`) do NOT create URL segments — they are just for code organisation.

**New pages** should be created as `src/app/<route>/page.tsx`.
**New shared components** can go in `src/app/(components)/<ComponentName>/` or a new `src/components/` directory.

## 3. Styling Rules

- Use **Tailwind CSS v4** with the custom design tokens from `tailwind.config.ts`.
- Dark mode: **class-based** (`dark:` prefix). Apply both light and dark variants on every element.
- Common pattern: `bg-white dark:bg-black`, `text-gray-800 dark:text-gray-100`, `border-gray-200 dark:border-gray-700`.
- Custom tokens to prefer over arbitrary values:
  - Dark backgrounds: `dark-bg`, `dark-secondary`, `dark-tertiary`
  - Brand blue: `blue-primary` (`#0275ff`)
  - Active sidebar indicator: `blue-200`

## 4. Component Conventions

- **Client components** (using hooks/browser APIs) must have `"use client"` as the very first line.
- **Server components** (default in App Router) should NOT have `"use client"`.
- Icons: use `lucide-react`. Prefer `h-5 w-5` or `h-6 w-6` sizing.
- Component file for pages uses the Next.js `page.tsx` filename convention.
- Use `next/image` for images, `next/link` for internal navigation.

## 5. Sidebar Navigation (Planned Routes)

The sidebar already links to these routes — pages need to be created:

| Label | Route | Notes |
|---|---|---|
| Home | `/` | ✅ Exists (placeholder) |
| Timeline | `/timeline` | Gantt chart — use `gantt-task-react` |
| Search | `/search` | Global search |
| Settings | `/settings` | Settings form |
| Users | `/users` | User list — needs `/users` API |
| Teams | `/teams` | Team management |
| Urgent | `/priority/urgent` | Filtered task list |
| High | `/priority/high` | Filtered task list |
| Medium | `/priority/medium` | ⚠️ Sidebar has a typo (`/prioritiy/medium`) — fix it |
| Low | `/priority/low` | Filtered task list |
| Backlog | `/priority/backlog` | Filtered task list |

## 6. State Management

- **Redux Toolkit** + **react-redux** + **redux-persist** are installed but **not yet configured**.
- No store, no slices, no Provider wrapping exists yet.
- When setting up: create `src/store/` for the Redux store and `src/features/` for slices.
- Wrap the app in a Redux `<Provider>` in `src/app/layout.tsx`.

## 7. API Communication

- **Axios** is installed but no Axios instance is configured yet.
- Create a shared `src/lib/api.ts` with a configured Axios instance:
  ```ts
  import axios from 'axios';
  export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  });
  ```
- API base URL comes from `NEXT_PUBLIC_API_BASE_URL` in `.env.local`.

## 8. Dark Mode Setup (Fix Required)

`ThemeProvider` is **commented out** in `layout.tsx`. To make `useTheme()` work in `ModeToggle`:

```tsx
// layout.tsx — add ThemeProvider wrapping DashboardWrapper
import { ThemeProvider } from "@/providers/ThemeProvider";
// ...
<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  <DashboardWrapper>{children}</DashboardWrapper>
</ThemeProvider>
```

## 9. Key Installed Libraries (Use These!)

| Library | Use Case |
|---|---|
| `react-dnd` + `react-dnd-html5-backend` | Drag-and-drop for Kanban board |
| `@mui/x-data-grid` | Task list/table view |
| `recharts` | Dashboard analytics charts |
| `gantt-task-react` | Timeline/Gantt view |
| `date-fns` | Date formatting and manipulation |
| `numeral` | Number formatting |
| `next-themes` | Dark/light mode |

## 10. TypeScript Path Alias

`@/*` maps to `src/*`. Use it for all imports:
```ts
import { api } from '@/lib/api';
import Sidebar from '@/app/(components)/Sidebar/page';
```

## 11. Scripts

```bash
pnpm dev          # Start dev server with Turbopack (fast)
pnpm build        # Production build
pnpm lint         # ESLint check
```
