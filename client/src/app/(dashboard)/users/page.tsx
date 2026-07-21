"use client";

import React, { useState } from "react";
import { useGetUsersQuery, useGetTeamsQuery } from "@/state/api";
import { Users as UsersIcon, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import EmptyState from "@/app/(components)/EmptyState/EmptyState";
import { cn, formatUsername, getAvatarColor } from "@/lib/utils";

export default function UsersPage() {
  const { data: users, isLoading: usersLoading } = useGetUsersQuery();
  const { data: teams, isLoading: teamsLoading } = useGetTeamsQuery();
  const [searchTerm, setSearchTerm] = useState("");

  const isLoading = usersLoading || teamsLoading;

  const getUserTeams = (userId: string) => {
    if (!teams) return [];
    return teams.filter(team => 
      team.productOwnerUserId === userId || 
      team.projectManagerUserId === userId || 
      team.user?.some(u => u.userId === userId)
    );
  };

  const filteredUsers = users?.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-full w-full flex-col p-8 max-w-7xl mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <div className="rounded-xl bg-primary/10 p-2">
              <UsersIcon className="h-6 w-6 text-primary" />
            </div>
            Users
            {users && (
              <span className="ml-2 rounded-full bg-secondary px-2.5 py-0.5 text-sm font-semibold text-muted-foreground">
                {users.length}
              </span>
            )}
          </h1>
          <p className="text-muted-foreground mt-1">Manage team members and their assignments.</p>
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-10 w-full rounded-xl bg-card border-border"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="w-full">
            <div className="h-10 bg-secondary/50 border-b border-border" />
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-16 border-b border-border bg-card animate-pulse" />
            ))}
          </div>
        ) : filteredUsers?.length === 0 ? (
          <EmptyState
            icon={UsersIcon}
            title={searchTerm ? `No users found matching "${searchTerm}"` : "No users found"}
            description={searchTerm ? "Try a different search term." : "There are currently no users in the system."}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="bg-secondary/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 border-b border-border w-16"></th>
                  <th className="px-6 py-3 border-b border-border">Username</th>
                  <th className="px-6 py-3 border-b border-border">Team</th>
                  <th className="px-6 py-3 border-b border-border">User ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers?.map((user) => (
                  <tr key={user.userId} className="transition-colors hover:bg-secondary/50">
                    <td className="px-6 py-4 w-16">
                      <div
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold shadow-sm",
                          getAvatarColor(user.username)
                        )}
                      >
                        {formatUsername(user.username).charAt(0).toUpperCase()}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground whitespace-nowrap">
                      {formatUsername(user.username)}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-muted-foreground">
                      {getUserTeams(user.userId).length > 0 ? (
                        <div className="flex gap-2 flex-wrap">
                          {getUserTeams(user.userId).map(team => (
                            <span key={team.id} className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">
                              {team.teamName}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground/60 italic">No Team</span>
                      )}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-muted-foreground font-mono text-xs">
                      #{user.userId}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
