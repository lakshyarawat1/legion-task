"use client";

import React, { useState } from "react";
import { useCreateOrgMutation, useJoinOrgMutation } from "@/state/api";
import { useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

export default function OnboardingPage() {
  const [activeTab, setActiveTab] = useState<"create" | "join">("create");
  const [orgName, setOrgName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  
  const [createOrg, { isLoading: isCreating }] = useCreateOrgMutation();
  const [joinOrg, { isLoading: isJoining }] = useJoinOrgMutation();
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      await createOrg({ name: orgName }).unwrap();
      router.push("/dashboard");
    } catch (err: any) {
      setErrorMsg(err?.data?.error || "Failed to create organization");
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      await joinOrg({ inviteCode }).unwrap();
      router.push("/dashboard");
    } catch (err: any) {
      setErrorMsg(err?.data?.error || "Failed to join organization");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-dark-bg p-4 relative">
      <div className="absolute top-4 right-4">
        <UserButton />
      </div>

      <div className="w-full max-w-md rounded-2xl bg-card border border-border p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-foreground">Welcome to LegionTask</h1>
          <p className="text-muted-foreground mt-2">
            To get started, please create or join an organization.
          </p>
        </div>

        <div className="flex gap-4 mb-6 border-b border-border pb-2">
          <button
            onClick={() => { setActiveTab("create"); setErrorMsg(""); }}
            className={`flex-1 text-center pb-2 font-medium transition-colors ${
              activeTab === "create" ? "text-blue-primary border-b-2 border-blue-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Create Organization
          </button>
          <button
            onClick={() => { setActiveTab("join"); setErrorMsg(""); }}
            className={`flex-1 text-center pb-2 font-medium transition-colors ${
              activeTab === "join" ? "text-blue-primary border-b-2 border-blue-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Join Organization
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-500/10 text-red-500 rounded-lg text-sm text-center">
            {errorMsg}
          </div>
        )}

        {activeTab === "create" ? (
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Organization Name</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="e.g. Acme Corp"
                required
                className="w-full rounded-lg border border-border bg-secondary p-3 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-primary"
              />
            </div>
            <button
              type="submit"
              disabled={isCreating}
              className="w-full rounded-lg bg-blue-primary p-3 font-semibold text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
            >
              {isCreating ? "Creating..." : "Create Organization"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Invite Code</label>
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="e.g. A1B2C3"
                required
                className="w-full uppercase rounded-lg border border-border bg-secondary p-3 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-primary"
              />
            </div>
            <button
              type="submit"
              disabled={isJoining}
              className="w-full rounded-lg bg-blue-primary p-3 font-semibold text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
            >
              {isJoining ? "Joining..." : "Join Organization"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
