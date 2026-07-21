"use client";

import React, { useState } from "react";
import { useGetTeamsQuery, useDeleteTeamMutation, useUpdateTeamMutation, useGetUsersQuery, useGetMeQuery, useAddTeamMemberMutation, useRemoveTeamMemberMutation, Team } from "@/state/api";
import { Users as UsersIcon, Briefcase, Crown, Shield, Plus, Trash2, X } from "lucide-react";
import EmptyState from "@/app/(components)/EmptyState/EmptyState";
import { getAvatarColor, formatUsername } from "@/lib/utils";
import { cn } from "@/lib/utils";
import ModalNewTeam from "@/app/(components)/ModalNewTeam/ModalNewTeam";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

export default function TeamsPage() {
  const { data: teams, isLoading } = useGetTeamsQuery();
  const { data: users } = useGetUsersQuery();
  const { data: currentUser } = useGetMeQuery();
  const [deleteTeam] = useDeleteTeamMutation();
  const [updateTeam, { isLoading: isUpdating }] = useUpdateTeamMutation();
  const [addTeamMember] = useAddTeamMemberMutation();
  const [removeTeamMember] = useRemoveTeamMemberMutation();
  const [isNewTeamModalOpen, setIsNewTeamModalOpen] = useState(false);
  
  // Selected team for expanded edit view
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  
  // Edit form state
  const [editTeamName, setEditTeamName] = useState("");
  const [editProductOwner, setEditProductOwner] = useState<string>("none");
  const [editProjectManager, setEditProjectManager] = useState<string>("none");

  const openExpandedView = (team: Team) => {
    setSelectedTeam(team);
    setEditTeamName(team.teamName);
    setEditProductOwner(team.productOwnerUserId?.toString() || "none");
    setEditProjectManager(team.projectManagerUserId?.toString() || "none");
  };

  const closeExpandedView = () => {
    setSelectedTeam(null);
  };

  const handleDeleteTeam = async (e: React.MouseEvent, teamId: string) => {
    e.stopPropagation(); // prevent opening the card
    if (confirm("Are you sure you want to delete this team?")) {
      try {
        await deleteTeam({ teamId }).unwrap();
        if (selectedTeam?.id === teamId) closeExpandedView();
      } catch (err: any) {
        console.error("Failed to delete team:", err);
        alert(`Error deleting team: ${err?.data?.error || "Unknown error"}`);
      }
    }
  };

  const handleUpdateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam || !editTeamName.trim()) return;

    try {
      await updateTeam({
        teamId: selectedTeam.id,
        teamName: editTeamName,
        productOwnerUserId: editProductOwner !== "none" ? editProductOwner : undefined,
        projectManagerUserId: editProjectManager !== "none" ? editProjectManager : undefined,
      }).unwrap();
      closeExpandedView();
    } catch (err: any) {
      console.error("Failed to update team:", err);
      alert(`Error updating team: ${err?.data?.error || "Unknown error"}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-col p-8 max-w-7xl mx-auto gap-6">
        <div className="h-10 w-48 animate-pulse rounded bg-secondary" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 w-full animate-pulse rounded-2xl bg-secondary" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col p-8 max-w-7xl mx-auto relative">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <div className="rounded-xl bg-primary/10 p-2">
              <UsersIcon className="h-6 w-6 text-primary" />
            </div>
            Teams
            {teams && (
              <span className="ml-2 rounded-full bg-secondary px-2.5 py-0.5 text-sm font-semibold text-muted-foreground">
                {teams.length}
              </span>
            )}
          </h1>
          <p className="text-muted-foreground mt-1">View and manage organization teams and their members.</p>
        </div>
        
        <Button onClick={() => setIsNewTeamModalOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Team
        </Button>
      </div>

      {!teams || teams.length === 0 ? (
        <EmptyState
          icon={UsersIcon}
          title="No teams found"
          description="There are currently no teams in the system."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <motion.div
              layoutId={`team-card-${team.id}`}
              key={team.id}
              onClick={() => openExpandedView(team)}
              className="group relative flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md cursor-pointer hover:border-primary/50"
            >
              <button 
                onClick={(e) => handleDeleteTeam(e, team.id)}
                className="absolute right-4 top-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-500 z-10"
                title="Delete Team"
              >
                <Trash2 className="h-5 w-5" />
              </button>

              <h2 className="text-xl font-bold text-foreground mb-4 pr-8">
                {team.teamName}
              </h2>
              
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <UsersIcon className="h-4 w-4" />
                  <span className="text-sm font-medium">{team.user?.length || 0} members</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Briefcase className="h-4 w-4" />
                  <span className="text-sm font-medium">{team.projectTeams?.length || 0} projects</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 mb-6 bg-secondary/30 p-3 rounded-xl border border-border/50">
                <div className="flex items-center gap-2 text-sm">
                  <Crown className="h-4 w-4 text-amber-500" />
                  <span className="text-muted-foreground">Product Owner:</span>
                  <span className="font-medium text-foreground">
                    {team.productOwnerUserId 
                      ? formatUsername(users?.find(u => u.userId === team.productOwnerUserId)?.username) || `#${team.productOwnerUserId}` 
                      : "None"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-blue-500" />
                  <span className="text-muted-foreground">Project Manager:</span>
                  <span className="font-medium text-foreground">
                    {team.projectManagerUserId 
                      ? formatUsername(users?.find(u => u.userId === team.projectManagerUserId)?.username) || `#${team.projectManagerUserId}` 
                      : "None"}
                  </span>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Team Members</p>
                {team.user && team.user.length > 0 ? (
                  <div className="flex -space-x-3 overflow-hidden p-1">
                    {team.user.slice(0, 5).map((user) => (
                      <div
                        key={user.userId}
                        title={formatUsername(user.username)}
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full border-2 border-card text-xs font-bold shadow-sm ring-2 ring-transparent transition-transform hover:z-10 hover:scale-110",
                          getAvatarColor(user.username)
                        )}
                      >
                        {formatUsername(user.username).charAt(0).toUpperCase()}
                      </div>
                    ))}
                    {team.user.length > 5 && (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-card bg-secondary text-xs font-bold text-muted-foreground shadow-sm">
                        +{team.user.length - 5}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No members yet</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* iOS Style Expanded Card Overlay */}
      <AnimatePresence>
        {selectedTeam && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeExpandedView}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4 sm:p-8">
        <AnimatePresence>
          {selectedTeam && (
            <motion.div
              key="modal-content"
              layoutId={`team-card-${selectedTeam.id}`}
              className="w-full max-w-lg rounded-3xl border border-border bg-card shadow-2xl pointer-events-auto relative overflow-hidden flex flex-col max-h-[90vh]"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full p-6 sm:p-8 flex flex-col overflow-y-auto"
              >
                <button
                  onClick={closeExpandedView}
                  className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors z-10"
                >
                  <X className="h-5 w-5" />
                </button>

                <h2 className="text-2xl font-bold text-foreground mb-6 pr-8">
                  Edit {selectedTeam.teamName}
                </h2>

                <div className="overflow-y-auto pr-2 pb-2 -mr-2">
                  {/* Basic Info Form */}
                  <form onSubmit={handleUpdateTeam} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="editTeamName">Team Name</Label>
                      <Input
                        id="editTeamName"
                        value={editTeamName}
                        onChange={(e) => setEditTeamName(e.target.value)}
                        required
                        className="text-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="editProductOwner">Product Owner</Label>
                      <Select value={editProductOwner} onValueChange={(val) => setEditProductOwner(val || "")}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Product Owner">
                            {editProductOwner !== "none"
                              ? formatUsername(users?.find((u) => u.userId.toString() === editProductOwner)?.username || "")
                              : "Select Product Owner"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {users?.map((user) => (
                            <SelectItem key={user.userId} value={user.userId.toString()}>
                              {formatUsername(user.username)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="editProjectManager">Project Manager</Label>
                      <Select value={editProjectManager} onValueChange={(val) => setEditProjectManager(val || "")}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Project Manager">
                            {editProjectManager !== "none"
                              ? formatUsername(users?.find((u) => u.userId.toString() === editProjectManager)?.username || "")
                              : "Select Project Manager"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {users?.map((user) => (
                            <SelectItem key={user.userId} value={user.userId.toString()}>
                              {formatUsername(user.username)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
                      <Button type="button" variant="ghost" onClick={closeExpandedView} disabled={isUpdating}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isUpdating || !editTeamName.trim()} className="rounded-full px-6">
                        {isUpdating ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </form>

                  {/* Manage Members Section */}
                  <div className="mt-8 pt-8 border-t border-border">
                    <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                      <UsersIcon className="h-5 w-5 text-primary" />
                      Team Members
                    </h3>

                    {currentUser &&
                    (currentUser.userId === selectedTeam.productOwnerUserId ||
                      currentUser.userId === selectedTeam.projectManagerUserId) ? (
                      <div className="space-y-4">
                        <div className="flex flex-col gap-3">
                          {selectedTeam.user && selectedTeam.user.length > 0 ? (
                            selectedTeam.user.map((member) => (
                              <div
                                key={member.userId}
                                className="flex items-center justify-between rounded-xl border border-border bg-card p-3 shadow-sm"
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={cn(
                                      "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white",
                                      getAvatarColor(member.username)
                                    )}
                                  >
                                    {formatUsername(member.username).charAt(0).toUpperCase()}
                                  </div>
                                  <span className="text-sm font-medium text-foreground">
                                    {formatUsername(member.username)}
                                  </span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 px-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                                  onClick={async () => {
                                    if (confirm(`Remove ${formatUsername(member.username)} from the team?`)) {
                                      await removeTeamMember({ teamId: selectedTeam.id, userId: member.userId });
                                    }
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground italic mb-2">No members in this team.</p>
                          )}
                        </div>

                        <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                          <Select<string>
                            onValueChange={async (val) => {
                              if (val && val !== "none") {
                                await addTeamMember({ teamId: selectedTeam.id, userId: val });
                              }
                            }}
                          >
                            <SelectTrigger className="w-full sm:flex-1 h-10">
                              <SelectValue placeholder="Add new member..." />
                            </SelectTrigger>
                            <SelectContent>
                              {users
                                ?.filter(
                                  (u) => !selectedTeam.user?.some((existing) => existing.userId === u.userId)
                                )
                                .map((unassignedUser) => (
                                  <SelectItem key={unassignedUser.userId} value={unassignedUser.userId.toString()}>
                                    {formatUsername(unassignedUser.username)}
                                  </SelectItem>
                                ))}
                              {users?.filter((u) => !selectedTeam.user?.some((existing) => existing.userId === u.userId))
                                .length === 0 && (
                                <SelectItem value="none" disabled>
                                  All users are in this team
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-xl border border-border bg-secondary/50 p-4 text-center">
                        <Shield className="mx-auto h-6 w-6 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Only the Product Owner or Project Manager can manage team members.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <ModalNewTeam 
        open={isNewTeamModalOpen} 
        onClose={() => setIsNewTeamModalOpen(false)} 
      />
    </div>
  );
}
