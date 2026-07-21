import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getClerkToken } from "./auth";

export interface User {
  userId: string;
  cognitoId: string;
  username: string;
  profilePictureUrl?: string;
  teamId?: string;
  team?: Team;
  orgId?: string;
  role?: string;
  organization?: any;
  authoredTasks?: Task[];
  assignedTasks?: Task[];
}

export interface Team {
  id: string;
  teamName: string;
  productOwnerUserId?: string;
  projectManagerUserId?: string;
  user?: User[];
  projectTeams?: ProjectTeam[];
}

export interface Project {
  id: string;
  name: string;
  prefix?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  tasks?: Task[];
  projectTeams?: ProjectTeam[];
}

export interface ProjectTeam {
  id: string;
  teamId: string;
  projectId: string;
  team?: Team;
  organization?: any;
  project?: Project;
}

export interface Attachment {
  id: string;
  fileURL: string;
  fileName?: string;
  taskId: string;
  uploadedById: string;
  uploadedBy?: User;
}

export interface Comment {
  id: string;
  text: string;
  taskId: string;
  userId: string;
  createdAt?: string;
  user?: User;
}

export interface Task {
  id: string;
  taskNumber?: number;
  displayId?: string;
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  tags?: string;
  startDate?: string;
  dueDate?: string;
  points?: number;
  projectId: string;
  authorUserId: string;
  assignedUserId?: string;
  createdAt?: string;
  updatedAt?: string;

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

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
  actor?: {
    userId: string;
    username: string;
    profilePictureUrl?: string;
  };
  resourceType?: string;
  resourceId?: string;
}

export interface NotificationResponse {
  notifications: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  unreadCount: number;
}

export interface PaginatedComments {
  comments: Comment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const api = createApi({
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers) => {
      // Direct mock bypass check for automated E2E tests
      if (typeof window !== "undefined") {
        const getCookie = (name: string) => {
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) return parts.pop()?.split(';').shift();
          return null;
        };
        const mockUser = localStorage.getItem("mock_user_id") || getCookie("mock_user_id");
        if (mockUser) {
          headers.set("Authorization", `Bearer mock_${mockUser}`);
          return headers;
        }
      }

      if (getClerkToken) {
        const token = await getClerkToken();
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        } else {
          console.warn("DEBUG api.ts: getClerkToken returned null (expired?)");
        }
      } else {
        console.warn("DEBUG api.ts: getClerkToken is undefined!");
      }
      return headers;
    },
  }),
  reducerPath: "api",
  tagTypes: ["Tasks", "Projects", "Users", "Teams", "Comments", "Attachments", "Organizations", "Notifications"],
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

    getProjectById: build.query<Project, { id: string }>({
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
      { id: string; name?: string; description?: string; startDate?: string; endDate?: string }
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

    deleteProject: build.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `projects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Projects", id: "LIST" }],
    }),

    // ── Tasks ─────────────────────────────────────────────────
    getTasks: build.query<Task[], { projectId?: string; priority?: string }>({
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

    getTaskById: build.query<Task, { taskId: string }>({
      query: ({ taskId }) => `tasks/${taskId}`,
      providesTags: (result, error, { taskId }) => [{ type: "Tasks", id: taskId }],
    }),

    getTasksByUser: build.query<Task[], { userId: string }>({
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

    updateTask: build.mutation<Task, { taskId: string } & Partial<Task>>({
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

    updateTaskStatus: build.mutation<Task, { taskId: string; status: string }>({
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

    deleteTask: build.mutation<void, { taskId: string }>({
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

    getUserById: build.query<User, { userId: string }>({
      query: ({ userId }) => `users/${userId}`,
      providesTags: (result, error, { userId }) => [{ type: "Users", id: userId }],
    }),

    updateUser: build.mutation<User, { userId: string; username: string }>({
      query: ({ userId, ...body }) => ({
        url: `users/${userId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { userId }) => [{ type: "Users", id: userId }, { type: "Users", id: "LIST" }, "Organizations"],
    }),

    // Dev Endpoints
    getDevUsers: build.query<User[], { orgId?: string }>({
      query: ({ orgId }) => `dev/users${orgId ? `?orgId=${orgId}` : ''}`,
      providesTags: ["Users"],
    }),
    createDevUser: build.mutation<User, { username: string; role: string; orgId?: string; teamId?: string }>({
      query: (body) => ({
        url: `dev/users`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),
    updateDevUserRole: build.mutation<User, { userId: string; role: string }>({
      query: ({ userId, role }) => ({
        url: `dev/users/${userId}/role`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: ["Users"],
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

    getTeamById: build.query<Team, { teamId: string }>({
      query: ({ teamId }) => `teams/${teamId}`,
      providesTags: (result, error, { teamId }) => [{ type: "Teams", id: teamId }],
    }),

    createTeam: build.mutation<Team, { teamName: string; productOwnerUserId?: string; projectManagerUserId?: string }>({
      query: (body) => ({
        url: "teams",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Teams", id: "LIST" }],
    }),

    deleteTeam: build.mutation<{ message: string }, { teamId: string }>({
      query: ({ teamId }) => ({
        url: `teams/${teamId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { teamId }) => [{ type: "Teams", id: teamId }, { type: "Teams", id: "LIST" }],
    }),

    updateTeam: build.mutation<Team, { teamId: string; teamName: string; productOwnerUserId?: string; projectManagerUserId?: string }>({
      query: ({ teamId, ...body }) => ({
        url: `teams/${teamId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { teamId }) => [{ type: "Teams", id: teamId }, { type: "Teams", id: "LIST" }],
    }),

    addTeamMember: build.mutation<User, { teamId: string; userId: string }>({
      query: ({ teamId, userId }) => ({
        url: `teams/${teamId}/members`,
        method: "POST",
        body: { userId },
      }),
      invalidatesTags: (result, error, { teamId }) => [{ type: "Teams", id: teamId }, { type: "Teams", id: "LIST" }],
    }),

    removeTeamMember: build.mutation<User, { teamId: string; userId: string }>({
      query: ({ teamId, userId }) => ({
        url: `teams/${teamId}/members/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { teamId }) => [{ type: "Teams", id: teamId }, { type: "Teams", id: "LIST" }],
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
    getComments: build.query<Comment[], { taskId: string }>({
      query: ({ taskId }) => `comments?taskId=${taskId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Comments" as const, id })),
              { type: "Comments", id: "LIST" },
            ]
          : [{ type: "Comments", id: "LIST" }],
    }),
    getPaginatedComments: build.query<PaginatedComments, { taskId: string; page?: number; limit?: number; order?: string }>({
      query: ({ taskId, page = 1, limit = 20, order = "asc" }) =>
        `comments?taskId=${taskId}&page=${page}&limit=${limit}&order=${order}`,
      providesTags: (result, error, { taskId }) => [
        { type: "Comments", id: taskId },
      ],
    }),
    createComment: build.mutation<Comment, Partial<Comment>>({
      query: (comment) => ({
        url: "comments",
        method: "POST",
        body: comment,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Comments", id: "LIST" },
        { type: "Tasks", id: arg.taskId || "LIST" }
      ],
    }),
    getAttachments: build.query<Attachment[], { taskId: string }>({
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

    // ── Notifications ──────────────────────────────────────────
    getNotifications: build.query<NotificationResponse, { page?: number; limit?: number; unreadOnly?: boolean }>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.set("page", String(params.page));
        if (params.limit) searchParams.set("limit", String(params.limit));
        if (params.unreadOnly) searchParams.set("unreadOnly", "true");
        return `notifications?${searchParams.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.notifications.map(({ id }) => ({ type: "Notifications" as const, id })),
              { type: "Notifications", id: "LIST" },
            ]
          : [{ type: "Notifications", id: "LIST" }],
    }),
    getUnreadCount: build.query<{ unreadCount: number }, void>({
      query: () => `notifications/unread-count`,
      providesTags: [{ type: "Notifications", id: "UNREAD_COUNT" }],
    }),
    markAsRead: build.mutation<{ notification: Notification }, string>({
      query: (notificationId) => ({
        url: `notifications/${notificationId}/read`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Notifications", id },
        { type: "Notifications", id: "UNREAD_COUNT" },
      ],
    }),
    markAllAsRead: build.mutation<{ updatedCount: number }, void>({
      query: () => ({
        url: `notifications/read-all`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),
    deleteNotification: build.mutation<{ message: string }, string>({
      query: (notificationId) => ({
        url: `notifications/${notificationId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Notifications", id },
        { type: "Notifications", id: "LIST" },
        { type: "Notifications", id: "UNREAD_COUNT" },
      ],
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
  useUpdateUserMutation,
  useGetDevUsersQuery,
  useCreateDevUserMutation,
  useUpdateDevUserRoleMutation,
  useGetTeamsQuery,
  useGetTeamByIdQuery,
  useCreateTeamMutation,
  useDeleteTeamMutation,
  useUpdateTeamMutation,
  useAddTeamMemberMutation,
  useRemoveTeamMemberMutation,
  useSearchQuery,
  useGetCommentsQuery,
  useCreateCommentMutation,
  useGetAttachmentsQuery,
  useCreateAttachmentMutation,
  useGetMeQuery,
  useCreateOrgMutation,
  useJoinOrgMutation,
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useGetPaginatedCommentsQuery,
} = api;
