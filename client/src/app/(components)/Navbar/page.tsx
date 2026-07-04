import React from "react";
import { Search, Settings } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "../ModeToggle/ModeToggle";
import { Input } from "@/components/ui/input";

const Navbar = () => {
  return (
    <div className="sticky top-0 z-30 flex items-center justify-between bg-white/70 backdrop-blur-md border-b border-border px-4 py-3 dark:bg-black/70">
      <div className="flex items-center gap-8">
        <div className="relative flex min-w-[200px] items-center">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <Input
            className="w-full rounded-full border-none bg-secondary pl-10 focus-visible:ring-0 focus-visible:ring-offset-0 dark:text-foreground h-9"
            type="search"
            placeholder="Search..."
          />
        </div>
      </div>
      <div className="flex items-center">
        <ModeToggle />
        <Link
          href="/settings"
          className="h-min w-min rounded-full p-2 hover:bg-secondary transition-colors"
        >
          <Settings className="h-6 w-6 cursor-pointer text-foreground" />
        </Link>
        <div className="mr-5 ml-2 hidden min-h-[2rem] w-[1px] bg-border md:inline-block"></div>
      </div>
    </div>
  );
};

export default Navbar;
