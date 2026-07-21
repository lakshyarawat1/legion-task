"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useTheme } from "next-themes";
import {
  Sun,
  Moon,
  Monitor,
  User as UserIcon,
  Code2,
  Pencil,
  Check,
  X,
  Bell,
  BellOff,
  Palette,
  Shield,
  Keyboard,
  Info,
  ExternalLink,
  Copy,
  CheckCircle2,
  Settings2,
  Globe,
  Clock,
  LayoutDashboard,
  Columns3,
  Table2,
  CalendarDays,
  ListTodo,
  LogOut,
  Terminal,
  ShieldAlert,
  Users,
} from "lucide-react";
import { cn, formatUsername, getAvatarColor } from "@/lib/utils";
import { 
  useGetMeQuery, 
  useUpdateUserMutation,
  useGetDevUsersQuery,
  useCreateDevUserMutation,
  useUpdateDevUserRoleMutation
} from "@/state/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useClerk } from "@clerk/nextjs";

// ── Toggle Switch ────────────────────────────────────────
function ToggleSwitch({ checked, onChange, disabled = false }: { checked: boolean; onChange: (val: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        checked ? "bg-primary" : "bg-secondary",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

// ── Settings Row ─────────────────────────────────────────
function SettingsRow({
  icon: Icon,
  title,
  description,
  children,
  className,
}: {
  icon?: React.ElementType;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between py-4 gap-4", className)}>
      <div className="flex items-start gap-3 min-w-0">
        {Icon && (
          <div className="mt-0.5 rounded-lg bg-secondary p-2 shrink-0">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">{title}</p>
          {description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{description}</p>}
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

// ── Keyboard Shortcut Badge ──────────────────────────────
function KbdBadge({ keys }: { keys: string[] }) {
  return (
    <div className="flex items-center gap-1">
      {keys.map((key, i) => (
        <React.Fragment key={key}>
          {i > 0 && <span className="text-muted-foreground text-xs">+</span>}
          <kbd className="inline-flex h-6 items-center justify-center rounded-md border border-border bg-secondary px-2 text-[11px] font-mono font-medium text-muted-foreground shadow-sm">
            {key}
          </kbd>
        </React.Fragment>
      ))}
    </div>
  );
}

// ── Section Wrapper ──────────────────────────────────────
function SettingsSection({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-2 border-b border-border pb-4">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
      </div>
      <div className="divide-y divide-border/50">{children}</div>
    </section>
  );
}

// ════════════════════════════════════════════════════════
//  MAIN SETTINGS PAGE
// ════════════════════════════════════════════════════════
export default function SettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { data: currentUser } = useGetMeQuery();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const { signOut } = useClerk();
  
  const isDev = process.env.NODE_ENV !== "production";
  const { data: devUsers, refetch: refetchDevUsers } = useGetDevUsersQuery(
    { orgId: currentUser?.orgId },
    { skip: !isDev || !currentUser?.orgId }
  );
  const [createDevUser, { isLoading: isCreatingDev }] = useCreateDevUserMutation();
  const [updateDevRole] = useUpdateDevUserRoleMutation();
  const [newDevUsername, setNewDevUsername] = useState("");
  const [newDevRole, setNewDevRole] = useState("MEMBER");
  
  const handleCreateDevUser = async () => {
    if (!newDevUsername.trim()) return;
    try {
      await createDevUser({
        username: newDevUsername,
        role: newDevRole,
        orgId: currentUser?.orgId,
        teamId: currentUser?.teamId
      }).unwrap();
      setNewDevUsername("");
      refetchDevUsers();
    } catch (err: any) {
      alert(`Error creating user: ${err?.data?.error || "Unknown"}`);
    }
  };

  const handleSwitchSession = (clerkUserId: string) => {
    // In our mock auth system, this cookie determines the session
    document.cookie = `mock_user_id=${clerkUserId}; path=/; max-age=31536000`;
    window.location.href = "/dashboard";
  };
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  // Profile editing
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState("");

  // Notification preferences (client-local for now)
  const [notifTaskAssigned, setNotifTaskAssigned] = useState(true);
  const [notifCommentAdded, setNotifCommentAdded] = useState(true);
  const [notifStatusChange, setNotifStatusChange] = useState(false);
  const [notifDueDateReminder, setNotifDueDateReminder] = useState(true);
  const [notifSoundEnabled, setNotifSoundEnabled] = useState(false);

  // Display preferences
  const [defaultView, setDefaultView] = useState("board");
  const [compactMode, setCompactMode] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [dateFormat, setDateFormat] = useState("relative");
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);

  // Copy-to-clipboard
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = useCallback((value: string, field: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  }, []);

  useEffect(() => {
    if (currentUser && !isEditing) {
      setEditUsername(currentUser.username);
    }
  }, [currentUser, isEditing]);

  const handleSaveUsername = async () => {
    if (!currentUser || !editUsername.trim() || editUsername === currentUser.username) {
      setIsEditing(false);
      return;
    }
    try {
      await updateUser({ userId: currentUser.userId, username: editUsername }).unwrap();
      setIsEditing(false);
    } catch (err: any) {
      alert(`Error updating username: ${err?.data?.error || "Unknown error"}`);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const viewIcons: Record<string, React.ElementType> = {
    board: Columns3,
    list: ListTodo,
    table: Table2,
    timeline: CalendarDays,
  };

  return (
    <div className="flex h-full w-full flex-col p-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-2.5">
              <Settings2 className="h-7 w-7 text-primary" />
            </div>
            Settings
          </h1>
          <p className="text-muted-foreground mt-1 ml-14">Manage your account, preferences, and application settings.</p>
        </div>
      </div>

      {/* Tabbed Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 flex-wrap">
          <TabsTrigger value="general" className="gap-1.5">
            <Palette className="h-4 w-4" /> General
          </TabsTrigger>
          <TabsTrigger value="profile" className="gap-1.5">
            <UserIcon className="h-4 w-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5">
            <Bell className="h-4 w-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="shortcuts" className="gap-1.5">
            <Keyboard className="h-4 w-4" /> Shortcuts
          </TabsTrigger>
          <TabsTrigger value="about" className="gap-1.5">
            <Info className="h-4 w-4" /> About
          </TabsTrigger>
          {isDev && (
            <TabsTrigger value="dev" className="gap-1.5 text-orange-500 data-[state=active]:text-orange-500 data-[state=active]:bg-orange-500/10">
              <Terminal className="h-4 w-4" /> Dev Console
            </TabsTrigger>
          )}
        </TabsList>

        {/* ─── General Tab ─────────────────────────────────────── */}
        <TabsContent value="general">
          <div className="flex flex-col gap-6">
            {/* Theme */}
            <SettingsSection title="Appearance" description="Choose the visual theme for your workspace.">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
                {([
                  { key: "light", label: "Light", icon: Sun, desc: "Clean and bright" },
                  { key: "dark", label: "Dark", icon: Moon, desc: "Easy on the eyes" },
                  { key: "system", label: "System", icon: Monitor, desc: `Currently: ${resolvedTheme}` },
                ] as const).map(({ key, label, icon: Icon, desc }) => (
                  <button
                    key={key}
                    onClick={() => setTheme(key)}
                    className={cn(
                      "group relative flex flex-col items-center gap-3 rounded-xl border p-6 transition-all duration-200",
                      theme === key
                        ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                        : "border-border bg-card hover:bg-secondary/50 hover:border-border/80"
                    )}
                  >
                    {theme === key && (
                      <div className="absolute top-3 right-3">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div className={cn("rounded-full p-3 transition-colors", theme === key ? "bg-primary/20" : "bg-secondary group-hover:bg-secondary/80")}>
                      <Icon className={cn("h-6 w-6", theme === key ? "text-primary" : "text-muted-foreground")} />
                    </div>
                    <div className="text-center">
                      <span className={cn("font-medium text-sm", theme === key ? "text-primary" : "text-foreground")}>{label}</span>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </SettingsSection>

            {/* Display Preferences */}
            <SettingsSection title="Display" description="Customize how content is presented across the application.">
              <SettingsRow icon={LayoutDashboard} title="Default Project View" description="Choose which view loads first when you open a project.">
                <Select value={defaultView} onValueChange={(v) => setDefaultView(v || "board")}>
                  <SelectTrigger className="w-40 h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["board", "list", "table", "timeline"].map((v) => {
                      const VIcon = viewIcons[v];
                      return (
                        <SelectItem key={v} value={v}>
                          <span className="flex items-center gap-2">
                            <VIcon className="h-3.5 w-3.5" />
                            {v.charAt(0).toUpperCase() + v.slice(1)}
                          </span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </SettingsRow>

              <SettingsRow icon={Clock} title="Date Format" description="How dates are displayed throughout the app.">
                <Select value={dateFormat} onValueChange={(v) => setDateFormat(v || "relative")}>
                  <SelectTrigger className="w-40 h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relative">Relative (2d ago)</SelectItem>
                    <SelectItem value="absolute">Absolute (Jul 16)</SelectItem>
                    <SelectItem value="iso">ISO (2026-07-16)</SelectItem>
                  </SelectContent>
                </Select>
              </SettingsRow>

              <SettingsRow icon={Globe} title="Timezone" description={`Currently: ${timezone}`}>
                <Select value={timezone} onValueChange={(v) => setTimezone(v || timezone)}>
                  <SelectTrigger className="w-52 h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "Asia/Kolkata",
                      "America/New_York",
                      "America/Chicago",
                      "America/Denver",
                      "America/Los_Angeles",
                      "Europe/London",
                      "Europe/Berlin",
                      "Asia/Tokyo",
                      "Australia/Sydney",
                      "Pacific/Auckland",
                    ].map((tz) => (
                      <SelectItem key={tz} value={tz}>{tz.replace("_", " ")}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SettingsRow>

              <SettingsRow title="Compact Mode" description="Reduce spacing and padding for denser information display.">
                <ToggleSwitch checked={compactMode} onChange={setCompactMode} />
              </SettingsRow>

              <SettingsRow title="Animations" description="Enable smooth transitions and micro-animations.">
                <ToggleSwitch checked={animationsEnabled} onChange={setAnimationsEnabled} />
              </SettingsRow>
            </SettingsSection>
          </div>
        </TabsContent>

        {/* ─── Profile Tab ─────────────────────────────────────── */}
        <TabsContent value="profile">
          <div className="flex flex-col gap-6">
            <SettingsSection title="Account" description="Your personal information and identity.">
              <div className="py-6">
                <div className="flex items-start gap-6">
                  {currentUser ? (
                    <>
                      {/* Avatar */}
                      <div className="relative group">
                        <div
                          className={cn(
                            "flex h-24 w-24 items-center justify-center rounded-2xl text-4xl font-bold border-4 border-card shadow-lg text-white transition-transform group-hover:scale-105",
                            getAvatarColor(currentUser.username)
                          )}
                        >
                          {formatUsername(currentUser.username).charAt(0).toUpperCase()}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          {isEditing ? (
                            <div className="flex items-center gap-2">
                              <Input
                                value={editUsername}
                                onChange={(e) => setEditUsername(e.target.value)}
                                className="h-9 text-lg font-bold w-56"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleSaveUsername();
                                  if (e.key === "Escape") {
                                    setIsEditing(false);
                                    setEditUsername(currentUser.username);
                                  }
                                }}
                              />
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-500/10"
                                onClick={handleSaveUsername}
                                disabled={isUpdating}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                onClick={() => {
                                  setIsEditing(false);
                                  setEditUsername(currentUser.username);
                                }}
                                disabled={isUpdating}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <h3 className="text-2xl font-bold text-foreground">
                                {formatUsername(currentUser.username)}
                              </h3>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                onClick={() => setIsEditing(true)}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                            </>
                          )}
                        </div>

                        <p className="text-muted-foreground text-sm flex items-center gap-2">
                          <UserIcon className="h-4 w-4" />
                          {currentUser.team?.productOwnerUserId === currentUser.userId
                            ? "Product Owner"
                            : currentUser.team?.projectManagerUserId === currentUser.userId
                              ? "Project Manager"
                              : "Team Member"}
                          <span>•</span>
                          <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">
                            {currentUser.team?.teamName || "No Team"}
                          </span>
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-4 animate-pulse">
                      <div className="h-24 w-24 rounded-2xl bg-secondary" />
                      <div className="space-y-3">
                        <div className="h-7 w-40 bg-secondary rounded" />
                        <div className="h-4 w-28 bg-secondary rounded" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </SettingsSection>

            {/* Account Details */}
            {currentUser && (
              <SettingsSection title="Account Details" description="Technical details about your account.">
                <SettingsRow title="User ID" description="Your unique system identifier.">
                  <button
                    onClick={() => copyToClipboard(currentUser.userId, "userId")}
                    className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-1.5 text-xs font-mono text-muted-foreground hover:bg-secondary/80 transition-colors"
                  >
                    {currentUser.userId.substring(0, 12)}…
                    {copiedField === "userId" ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </SettingsRow>

                {currentUser.orgId && (
                  <SettingsRow title="Organization ID" description="Your current organization's identifier.">
                    <button
                      onClick={() => copyToClipboard(currentUser.orgId!, "orgId")}
                      className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-1.5 text-xs font-mono text-muted-foreground hover:bg-secondary/80 transition-colors"
                    >
                      {currentUser.orgId.substring(0, 12)}…
                      {copiedField === "orgId" ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </SettingsRow>
                )}

                {currentUser.teamId && (
                  <SettingsRow title="Team ID" description="Your current team assignment.">
                    <button
                      onClick={() => copyToClipboard(currentUser.teamId!, "teamId")}
                      className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-1.5 text-xs font-mono text-muted-foreground hover:bg-secondary/80 transition-colors"
                    >
                      {currentUser.teamId.substring(0, 12)}…
                      {copiedField === "teamId" ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </SettingsRow>
                )}
              </SettingsSection>
            )}

            {/* Danger Zone */}
            <SettingsSection title="Session" description="Manage your authentication session.">
              <SettingsRow icon={LogOut} title="Sign Out" description="Sign out of your account on this device.">
                <Button
                  variant="destructive"
                  size="sm"
                  className="rounded-lg"
                  onClick={() => signOut({ redirectUrl: "/" })}
                >
                  <LogOut className="h-4 w-4 mr-2" /> Sign Out
                </Button>
              </SettingsRow>
            </SettingsSection>
          </div>
        </TabsContent>

        {/* ─── Notifications Tab ───────────────────────────────── */}
        <TabsContent value="notifications">
          <div className="flex flex-col gap-6">
            <SettingsSection title="Task Notifications" description="Choose which task events trigger notifications.">
              <SettingsRow icon={Bell} title="Task Assigned to Me" description="Get notified when a task is assigned to you.">
                <ToggleSwitch checked={notifTaskAssigned} onChange={setNotifTaskAssigned} />
              </SettingsRow>
              <SettingsRow icon={Bell} title="Comments on My Tasks" description="Get notified when someone comments on a task you're involved in.">
                <ToggleSwitch checked={notifCommentAdded} onChange={setNotifCommentAdded} />
              </SettingsRow>
              <SettingsRow icon={Bell} title="Status Changes" description="Get notified when a task status is updated.">
                <ToggleSwitch checked={notifStatusChange} onChange={setNotifStatusChange} />
              </SettingsRow>
              <SettingsRow icon={Clock} title="Due Date Reminders" description="Receive reminders before task deadlines.">
                <ToggleSwitch checked={notifDueDateReminder} onChange={setNotifDueDateReminder} />
              </SettingsRow>
            </SettingsSection>

            <SettingsSection title="Sound & Alerts" description="Configure how notifications are delivered.">
              <SettingsRow icon={notifSoundEnabled ? Bell : BellOff} title="Notification Sound" description="Play a sound when you receive a notification.">
                <ToggleSwitch checked={notifSoundEnabled} onChange={setNotifSoundEnabled} />
              </SettingsRow>
            </SettingsSection>
          </div>
        </TabsContent>

        {/* ─── Keyboard Shortcuts Tab ──────────────────────────── */}
        <TabsContent value="shortcuts">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
              <Keyboard className="h-5 w-5 text-primary shrink-0" />
              <p className="text-sm text-muted-foreground">
                All shortcuts below are active globally. Press{" "}
                <kbd className="inline-flex h-5 items-center rounded border border-border bg-secondary px-1.5 text-[10px] font-mono font-medium text-muted-foreground shadow-sm">?</kbd>
                {" "}anywhere to see this reference.
              </p>
            </div>

            <SettingsSection title="Navigation" description="Quickly jump between views.">
              <SettingsRow title="Go to Dashboard"><KbdBadge keys={["G", "D"]} /></SettingsRow>
              <SettingsRow title="Go to Projects"><KbdBadge keys={["G", "P"]} /></SettingsRow>
              <SettingsRow title="Go to Timeline"><KbdBadge keys={["G", "T"]} /></SettingsRow>
              <SettingsRow title="Go to Search"><KbdBadge keys={["/"]} /></SettingsRow>
              <SettingsRow title="Go to Settings"><KbdBadge keys={["G", "S"]} /></SettingsRow>
            </SettingsSection>

            <SettingsSection title="Actions" description="Perform common actions quickly.">
              <SettingsRow title="Create New Task"><KbdBadge keys={["C"]} /></SettingsRow>
              <SettingsRow title="Toggle Dark/Light Mode"><KbdBadge keys={["Ctrl", "Shift", "L"]} /></SettingsRow>
              <SettingsRow title="Toggle Sidebar"><KbdBadge keys={["["]} /></SettingsRow>
              <SettingsRow title="Show Shortcut Help"><KbdBadge keys={["?"]} /></SettingsRow>
              <SettingsRow title="Close Modal / Cancel"><KbdBadge keys={["Esc"]} /></SettingsRow>
              <SettingsRow title="Save / Submit"><KbdBadge keys={["Ctrl", "Enter"]} /></SettingsRow>
            </SettingsSection>

            <SettingsSection title="Board View" description="Keyboard shortcuts specific to the Kanban board.">
              <SettingsRow title="Switch to Board View"><KbdBadge keys={["Alt", "1"]} /></SettingsRow>
              <SettingsRow title="Switch to List View"><KbdBadge keys={["Alt", "2"]} /></SettingsRow>
              <SettingsRow title="Switch to Table View"><KbdBadge keys={["Alt", "3"]} /></SettingsRow>
              <SettingsRow title="Switch to Timeline View"><KbdBadge keys={["Alt", "4"]} /></SettingsRow>
            </SettingsSection>
          </div>
        </TabsContent>

        {/* ─── About Tab ───────────────────────────────────────── */}
        <TabsContent value="about">
          <div className="flex flex-col gap-6">
            <SettingsSection title="About LegionTask" description="Application details, version, and technology.">
              <div className="py-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="rounded-2xl bg-primary/10 p-4">
                    <Code2 className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">LegionTask</h3>
                    <p className="text-sm text-muted-foreground">Full-stack project management platform</p>
                  </div>
                  <div className="ml-auto">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      v1.0.0 Beta
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "Frontend", value: "Next.js 15 · React 19 · Tailwind v4", icon: "🎨" },
                    { label: "Backend", value: "Express · Node.js · REST API", icon: "⚡" },
                    { label: "Database", value: "PostgreSQL · Prisma ORM · Supabase", icon: "🗃️" },
                    { label: "Authentication", value: "Clerk · Multi-tenant", icon: "🔐" },
                    { label: "State Management", value: "Redux Toolkit · RTK Query", icon: "📦" },
                    { label: "UI Components", value: "Shadcn · Lucide · Framer Motion", icon: "✨" },
                  ].map(({ label, value, icon }) => (
                    <div key={label} className="flex items-start gap-3 rounded-xl border border-border/50 bg-secondary/30 p-4">
                      <span className="text-lg">{icon}</span>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
                        <p className="text-sm font-medium text-foreground mt-0.5">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SettingsSection>

            <SettingsSection title="Links" description="Helpful resources and documentation.">
              <SettingsRow title="Source Code" description="View the project on GitHub.">
                <a
                  href="https://github.com/lakshyarawat1/legion-task"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary/80 transition-colors"
                >
                  GitHub <ExternalLink className="h-3 w-3" />
                </a>
              </SettingsRow>
              <SettingsRow title="Report a Bug" description="Found an issue? Let us know.">
                <a
                  href="https://github.com/lakshyarawat1/legion-task/issues/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary/80 transition-colors"
                >
                  Open Issue <ExternalLink className="h-3 w-3" />
                </a>
              </SettingsRow>
            </SettingsSection>
          </div>
        </TabsContent>

        {/* ─── Dev Console Tab ───────────────────────────────────── */}
        {isDev && (
          <TabsContent value="dev">
            <div className="flex flex-col gap-6">
              <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-4 flex items-start gap-3">
                <ShieldAlert className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-orange-600 dark:text-orange-500">Developer Testing Area</h3>
                  <p className="text-xs text-orange-600/80 dark:text-orange-500/80 mt-1">
                    This section is only visible in development environments. You can create mock users to test RBAC and switch your active session dynamically.
                  </p>
                </div>
              </div>

              <SettingsSection title="Create Test User" description="Generate a new user in the current organization.">
                <div className="flex items-end gap-4 py-4">
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label className="text-xs font-medium text-muted-foreground">Username</label>
                    <Input 
                      value={newDevUsername} 
                      onChange={(e) => setNewDevUsername(e.target.value)} 
                      placeholder="e.g. test_admin"
                      className="h-9"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 w-48">
                    <label className="text-xs font-medium text-muted-foreground">Role</label>
                    <Select value={newDevRole} onValueChange={(val) => setNewDevRole(val || "MEMBER")}>
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="PROJECT_MANAGER">Project Manager</SelectItem>
                        <SelectItem value="PRODUCT_OWNER">Product Owner</SelectItem>
                        <SelectItem value="MEMBER">Member</SelectItem>
                        <SelectItem value="GUEST">Guest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    onClick={handleCreateDevUser} 
                    disabled={!newDevUsername.trim() || isCreatingDev}
                    className="h-9"
                  >
                    Create User
                  </Button>
                </div>
              </SettingsSection>

              <SettingsSection title="Organization Users" description="Manage roles and switch sessions.">
                <div className="py-2">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-muted-foreground bg-secondary/50 uppercase">
                        <tr>
                          <th className="px-4 py-3 rounded-tl-lg">User</th>
                          <th className="px-4 py-3">Role</th>
                          <th className="px-4 py-3">ID</th>
                          <th className="px-4 py-3 rounded-tr-lg text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {devUsers?.map((u: any) => (
                          <tr key={u.userId} className="hover:bg-secondary/30 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className={cn("h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm", getAvatarColor(u.username))}>
                                  {formatUsername(u.username).charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-medium text-foreground flex items-center gap-2">
                                    {formatUsername(u.username)}
                                    {u.userId === currentUser?.userId && (
                                      <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-semibold">YOU</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <Select 
                                value={u.role || "MEMBER"} 
                                onValueChange={async (val) => {
                                  try {
                                    await updateDevRole({ userId: u.userId, role: val }).unwrap();
                                    refetchDevUsers();
                                  } catch (e) {
                                    console.error(e);
                                  }
                                }}
                              >
                                <SelectTrigger className="h-8 w-36 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="ADMIN">Admin</SelectItem>
                                  <SelectItem value="PROJECT_MANAGER">Project Manager</SelectItem>
                                  <SelectItem value="PRODUCT_OWNER">Product Owner</SelectItem>
                                  <SelectItem value="MEMBER">Member</SelectItem>
                                  <SelectItem value="GUEST">Guest</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="px-4 py-3">
                              <span className="font-mono text-xs text-muted-foreground">{u.userId.substring(0, 8)}...</span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 text-xs gap-1.5 hover:border-orange-500 hover:text-orange-500 transition-colors"
                                onClick={() => handleSwitchSession(u.clerkUserId)}
                                disabled={u.userId === currentUser?.userId}
                              >
                                <Users className="h-3 w-3" />
                                {u.userId === currentUser?.userId ? "Active" : "Switch Session"}
                              </Button>
                            </td>
                          </tr>
                        ))}
                        {(!devUsers || devUsers.length === 0) && (
                          <tr>
                            <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                              No users found in this organization.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </SettingsSection>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
