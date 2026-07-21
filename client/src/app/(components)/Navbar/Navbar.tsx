"use client";

import React, { useState } from "react";
import { Search, Settings, Menu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ModeToggle } from "../ModeToggle/ModeToggle";
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
import { toggleSidebar } from "@/state/globalSlice";
import { AppDispatch } from "@/state/store";
import { UserButton } from "@clerk/nextjs";
import { useGetMeQuery } from "@/state/api";
import { NotificationBell } from "../Notifications/NotificationBell";

const Navbar = () => {
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { data: localUser } = useGetMeQuery();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  return (
    <div className="sticky top-0 z-30 flex items-center justify-between bg-white/70 backdrop-blur-md border-b border-border px-4 py-3 dark:bg-black/70">
      <div className="flex items-center gap-4 md:gap-8">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="rounded-full p-2 hover:bg-secondary transition-colors"
        >
          <Menu className="h-5 w-5 text-muted-foreground" />
        </button>

        <form onSubmit={handleSearch} className="relative flex min-w-[200px] md:min-w-[300px] items-center">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="global-search-input"
            className="w-full rounded-full border-none bg-secondary pl-10 pr-10 focus-visible:ring-0 focus-visible:ring-offset-0 dark:text-foreground h-9"
            type="search"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <kbd className="pointer-events-none absolute right-3 hidden h-5 items-center rounded border border-border bg-secondary/80 px-1.5 text-[10px] font-mono text-muted-foreground sm:inline-flex">
            /
          </kbd>
        </form>
      </div>
      <div className="flex items-center gap-1 md:gap-4">
        {localUser?.organization && (
          <div className="hidden md:flex flex-col items-end mr-2">
            <span className="text-sm font-semibold text-foreground">
              {localUser.organization.name}
            </span>
            <span className="text-xs text-muted-foreground">
              Invite Code: <span className="font-mono text-blue-primary">{localUser.organization.inviteCode}</span>
            </span>
          </div>
        )}
        <NotificationBell />
        <ModeToggle />
        <Link
          href="/settings"
          className="h-min w-min rounded-full p-2 hover:bg-secondary transition-colors"
        >
          <Settings className="h-5 w-5 cursor-pointer text-foreground" />
        </Link>
        <div className="mr-3 ml-1 hidden min-h-[2rem] w-[1px] bg-border md:inline-block"></div>
        <UserButton />
      </div>
    </div>
  );
};

export default Navbar;
