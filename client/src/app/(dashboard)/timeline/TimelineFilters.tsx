"use client";

import React from "react";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimelineFiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  priorityFilter: string;
  setPriorityFilter: (val: string) => void;
}

export default function TimelineFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
}: TimelineFiltersProps) {
  return (
    <div className="flex w-full flex-col md:flex-row items-center gap-4 p-4 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-md shadow-sm transition-all">
      {/* Search Input */}
      <div className="relative flex-1 w-full max-w-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full rounded-xl border border-border/80 bg-card/40 backdrop-blur-sm py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/80 focus:bg-card/70 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all shadow-inner"
        />
      </div>

      {/* Selects */}
      <div className="flex w-full md:w-auto items-center gap-3">
        {/* Status Dropdown */}
        <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "")}>
          <SelectTrigger className="w-full md:w-48 h-10 rounded-xl border border-border/80 bg-card/45 backdrop-blur-sm text-sm text-foreground transition-all hover:bg-card/60 focus:border-primary/80">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-card/90 backdrop-blur-xl border border-border/50 shadow-xl rounded-xl">
            <SelectItem value="All">Status: All</SelectItem>
            <SelectItem value="To Do">To Do</SelectItem>
            <SelectItem value="Work In Progress">Work In Progress</SelectItem>
            <SelectItem value="Under Review">Under Review</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        {/* Priority Dropdown */}
        <Select value={priorityFilter} onValueChange={(val) => setPriorityFilter(val || "")}>
          <SelectTrigger className="w-full md:w-48 h-10 rounded-xl border border-border/80 bg-card/45 backdrop-blur-sm text-sm text-foreground transition-all hover:bg-card/60 focus:border-primary/80">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent className="bg-card/90 backdrop-blur-xl border border-border/50 shadow-xl rounded-xl">
            <SelectItem value="All">Priority: All</SelectItem>
            <SelectItem value="Urgent">Urgent</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Backlog">Backlog</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
