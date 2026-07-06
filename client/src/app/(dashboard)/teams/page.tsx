"use client";

import React from "react";
import { useGetTeamsQuery } from "@/state/api";
import { Users as UsersIcon, Briefcase, Crown, Shield } from "lucide-react";
import EmptyState from "@/app/(components)/EmptyState/EmptyState";
import { getAvatarColor } from "../users/page";
import { cn } from "@/lib/utils";

export default function TeamsPage() {
  const { data: teams, isLoading } = useGetTeamsQuery();

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
    <div className="flex h-full w-full flex-col p-8 max-w-7xl mx-auto">
      <div className="mb-8">
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

      {!teams || teams.length === 0 ? (
        <EmptyState
          icon={UsersIcon}
          title="No teams found"
          description="There are currently no teams in the system."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <div
              key={team.id}
              className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md"
            >
              <h2 className="text-xl font-bold text-foreground mb-4">{team.teamName}</h2>
              
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
                  <span className="font-medium text-foreground">{team.productOwnerUserId ? `#${team.productOwnerUserId}` : "None"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-blue-500" />
                  <span className="text-muted-foreground">Project Manager:</span>
                  <span className="font-medium text-foreground">{team.projectManagerUserId ? `#${team.projectManagerUserId}` : "None"}</span>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Team Members</p>
                {team.user && team.user.length > 0 ? (
                  <div className="flex -space-x-3 overflow-hidden p-1">
                    {team.user.slice(0, 5).map((user) => (
                      <div
                        key={user.userId}
                        title={user.username}
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full border-2 border-card text-xs font-bold shadow-sm ring-2 ring-transparent transition-transform hover:z-10 hover:scale-110",
                          getAvatarColor(user.username)
                        )}
                      >
                        {user.username.charAt(0).toUpperCase()}
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
