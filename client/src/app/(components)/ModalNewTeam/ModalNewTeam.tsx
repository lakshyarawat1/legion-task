"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateTeamMutation, useGetUsersQuery } from "@/state/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatUsername } from "@/lib/utils";

interface ModalNewTeamProps {
  open: boolean;
  onClose: () => void;
}

const ModalNewTeam = ({ open, onClose }: ModalNewTeamProps) => {
  const [createTeam, { isLoading }] = useCreateTeamMutation();
  const { data: users } = useGetUsersQuery();
  const [teamName, setTeamName] = useState("");
  const [productOwnerUserId, setProductOwnerUserId] = useState<string>("");
  const [projectManagerUserId, setProjectManagerUserId] = useState<string>("");

  const resetForm = () => {
    setTeamName("");
    setProductOwnerUserId("");
    setProjectManagerUserId("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return;

    try {
      await createTeam({
        teamName,
        productOwnerUserId: productOwnerUserId && productOwnerUserId !== "none" ? productOwnerUserId : undefined,
        projectManagerUserId: projectManagerUserId && projectManagerUserId !== "none" ? projectManagerUserId : undefined,
      }).unwrap();
      resetForm();
      onClose();
    } catch (err: any) {
      console.error("Failed to create team:", err);
      alert(`Error creating team: ${err?.data?.error || "Unknown error"}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent onClose={onClose}>
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="teamName">Team Name <span className="text-red-500">*</span></Label>
            <Input
              id="teamName"
              placeholder="e.g. Frontend Team"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="productOwner">Product Owner</Label>
            <Select value={productOwnerUserId} onValueChange={setProductOwnerUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Select Product Owner">
                  {productOwnerUserId && productOwnerUserId !== "none" 
                    ? formatUsername(users?.find((u) => u.userId.toString() === productOwnerUserId)?.username || "")
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
            <Label htmlFor="projectManager">Project Manager</Label>
            <Select value={projectManagerUserId} onValueChange={setProjectManagerUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Select Project Manager">
                  {projectManagerUserId && projectManagerUserId !== "none" 
                    ? formatUsername(users?.find((u) => u.userId.toString() === projectManagerUserId)?.username || "")
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

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !teamName.trim()}>
              {isLoading ? "Creating..." : "Create Team"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalNewTeam;
