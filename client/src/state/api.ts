import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getClerkToken } from "./auth";

export interface User {
  userId: number;
  cognitoId: string;
  username: string;
  profilePictureUrl?: string;
  teamId?: number;
  team?: Team;
  orgId?: number;
  organization?: any;
  authoredTasks?: Task[];
  assignedTasks?: Task[];
}

export interface Team {
  id: number;
  teamName: string;
  productOwnerUserId?: number;
  projectManagerUserId?: number;
  user?: User[];
  projectTeams?: ProjectTeam[];
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  tasks?: Task[];
  projectTeams?: ProjectTeam[];
}

export interface ProjectTeam {
  id: number;
  teamId: number;
  projectId: number;
  team?: Team;
  organization?: any;
  project?: Project;
}

export interface Attachment {
  id: number;
  fileURL: string;
  fileName?: string;
  taskId: number;
  uploadedById: number;
  uploadedBy?: User;
}

export interface Comment {
  id: number;
  text: string;
  taskId: number;
  userId: number;
  user?: User;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  tags?: string;
  startDate?: string;
  dueDate?: string;
  points?: number;
  projectId: number;
  authorUserId: number;
  assignedUserId?: number;

  author?: User;
  assignee?: User;
  comments?: Comment[];
  attachments?: Attachment[];
  project?: Project;
}

export interface SearchResults {
  tasks: Task[];
  projects: Project[];
  users: User[];
}

export const api = createApi({
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers) => {
      if (getClerkToken) {
        const token = await getClerkToken();
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        } else {
          alert("DEBUG: Clerk token is missing! Please wait a second and try again.");
          console.warn("DEBUG api.ts: getClerkToken returned null (expired?)");
        }
      } else {
        alert("DEBUG: Auth system not initialized!");
        console.warn("DEBUG api.ts: getClerkToken is undefined!");
      }
      return headers;
    },
  }),
  reducerPath: "api",
  tagTypes: ["Tasks", "Projects", "Users", "Teams", "Comments", "Attachments", "Organizations"],
  endpoints: (build) => ({
    // ── Projects ──────────────────────────────────────────────
    getProjects: build.query<Project[], void>({
      query: () => "projects",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Projects" as const, id })),
              { type: "Projects", id: "LIST" },
            ]
          : [{ type: "Projects", id: "LIST" }],
    }),

    getProjectById: build.query<Project, { id: number }>({
      query: ({ id }) => `projects/${id}`,
      providesTags: (result, error, { id }) => [{ type: "Projects", id }],
    }),

    createProject: build.mutation<
      Project,
      { name: string; description?: string; startDate?: string; endDate?: string }
    >({
      query: (body) => ({
        url: "projects",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Projects", id: "LIST" }],
    }),

    updateProject: build.mutation<
      Project,
      { id: number; name?: string; description?: string; startDate?: string; endDate?: string }
    >({
      query: ({ id, ...body }) => ({
        url: `projects/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Projects", id },
        { type: "Projects", id: "LIST" },
      ],
    }),

    deleteProject: build.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `projects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Projects", id: "LIST" }],
    }),

    // ── Tasks ─────────────────────────────────────────────────
    getTasks: build.query<Task[], { projectId?: number; priority?: string }>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.projectId) searchParams.set("projectId", String(params.projectId));
        if (params.priority) searchParams.set("priority", params.priority);
        return `tasks?${searchParams.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Tasks" as const, id })),
              { type: "Tasks", id: "LIST" },
            ]
          : [{ type: "Tasks", id: "LIST" }],
    }),

    getTaskById: build.query<Task, { taskId: number }>({
      query: ({ taskId }) => `tasks/${taskId}`,
      providesTags: (result, error, { taskId }) => [{ type: "Tasks", id: taskId }],
    }),

    getTasksByUser: build.query<Task[], { userId: number }>({
      query: ({ userId }) => `tasks/user/${userId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Tasks" as const, id })),
              { type: "Tasks", id: "LIST" },
            ]
          : [{ type: "Tasks", id: "LIST" }],
    }),

    createTask: build.mutation<Task, Partial<Task>>({
      query: (body) => ({
        url: "tasks",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Tasks", id: "LIST" }],
    }),

    updateTask: build.mutation<Task, { taskId: number } & Partial<Task>>({
      query: ({ taskId, ...body }) => ({
        url: `tasks/${taskId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Tasks", id: taskId },
        { type: "Tasks", id: "LIST" },
      ],
    }),

    updateTaskStatus: build.mutation<Task, { taskId: number; status: string }>({
      query: ({ taskId, status }) => ({
        url: `tasks/${taskId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Tasks", id: taskId },
        { type: "Tasks", id: "LIST" },
      ],
    }),

    deleteTask: build.mutation<void, { taskId: number }>({
      query: ({ taskId }) => ({
        url: `tasks/${taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Tasks", id: "LIST" }],
    }),

    // ── Users ─────────────────────────────────────────────────
    getUsers: build.query<User[], void>({
      query: () => "users",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ userId }) => ({ type: "Users" as const, id: userId })),
              { type: "Users", id: "LIST" },
            ]
          : [{ type: "Users", id: "LIST" }],
    }),

    getUserById: build.query<User, { userId: number }>({
      query: ({ userId }) => `users/${userId}`,
      providesTags: (result, error, { userId }) => [{ type: "Users", id: userId }],
    }),

    // ── Teams ─────────────────────────────────────────────────
    getTeams: build.query<Team[], void>({
      query: () => "teams",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Teams" as const, id })),
              { type: "Teams", id: "LIST" },
            ]
          : [{ type: "Teams", id: "LIST" }],
    }),

    getTeamById: build.query<Team, { teamId: number }>({
      query: ({ teamId }) => `teams/${teamId}`,
      providesTags: (result, error, { teamId }) => [{ type: "Teams", id: teamId }],
    }),

    // ── Organizations ─────────────────────────────────────────
    getMe: build.query<User, void>({
      query: () => "orgs/me",
      providesTags: ["Organizations"],
    }),
    createOrg: build.mutation<{ user: User; organization: any }, { name: string }>({
      query: (body) => ({
        url: "orgs/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Organizations", "Projects", "Teams", "Tasks"],
    }),
    joinOrg: build.mutation<{ user: User; organization: any }, { inviteCode: string }>({
      query: (body) => ({
        url: "orgs/join",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Organizations", "Projects", "Teams", "Tasks"],
    }),

    // ── Search ────────────────────────────────────────────────
    search: build.query<SearchResults, { query: string }>({
      query: ({ query }) => `search?query=${query}`,
    }),
    getComments: build.query<Comment[], { taskId: number }>({
      query: ({ taskId }) => `comments?taskId=${taskId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Comments" as const, id })),
              { type: "Comments", id: "LIST" },
            ]
          : [{ type: "Comments", id: "LIST" }],
    }),
    createComment: build.mutation<Comment, Partial<Comment>>({
      query: (comment) => ({
        url: "comments",
        method: "POST",
        body: comment,
      }),
      invalidatesTags: [{ type: "Comments", id: "LIST" }],
    }),
    getAttachments: build.query<Attachment[], { taskId: number }>({
      query: ({ taskId }) => `attachments?taskId=${taskId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Attachments" as const, id })),
              { type: "Attachments", id: "LIST" },
            ]
          : [{ type: "Attachments", id: "LIST" }],
    }),
    createAttachment: build.mutation<Attachment, Partial<Attachment>>({
      query: (attachment) => ({
        url: "attachments",
        method: "POST",
        body: attachment,
      }),
      invalidatesTags: [{ type: "Attachments", id: "LIST" }],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useGetTasksQuery,
  useGetTaskByIdQuery,
  useGetTasksByUserQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,
  useDeleteTaskMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useGetTeamsQuery,
  useGetTeamByIdQuery,
  useSearchQuery,
  useGetCommentsQuery,
  useCreateCommentMutation,
  useGetAttachmentsQuery,
  useCreateAttachmentMutation,
  useGetMeQuery,
  useCreateOrgMutation,
  useJoinOrgMutation,
} = api;
