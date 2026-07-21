"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Keyboard, Navigation, Zap, Columns3 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ShortcutOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutKey {
  label: string;
  type?: "key" | "then";
}

interface ShortcutEntry {
  description: string;
  keys: ShortcutKey[];
}

interface ShortcutSection {
  title: string;
  icon: LucideIcon;
  shortcuts: ShortcutEntry[];
}

// ---------------------------------------------------------------------------
// Helpers – build key sequences concisely
// ---------------------------------------------------------------------------

/** Single key press */
const k = (label: string): ShortcutKey => ({ label, type: "key" });

/** "then" separator between sequential keys */
const then: ShortcutKey = { label: "then", type: "then" };

// ---------------------------------------------------------------------------
// Shortcut data
// ---------------------------------------------------------------------------

const SHORTCUT_SECTIONS: ShortcutSection[] = [
  {
    title: "Navigation",
    icon: Navigation,
    shortcuts: [
      { description: "Go to Dashboard", keys: [k("G"), then, k("D")] },
      { description: "Go to Projects", keys: [k("G"), then, k("P")] },
      { description: "Go to Timeline", keys: [k("G"), then, k("T")] },
      { description: "Go to Settings", keys: [k("G"), then, k("S")] },
      { description: "Focus Search", keys: [k("/")] },
    ],
  },
  {
    title: "Actions",
    icon: Zap,
    shortcuts: [
      { description: "Create New Task", keys: [k("C")] },
      {
        description: "Toggle Dark / Light Mode",
        keys: [k("Ctrl"), k("Shift"), k("L")],
      },
      { description: "Toggle Sidebar", keys: [k("[")] },
      { description: "Close Modal / Cancel", keys: [k("Esc")] },
      { description: "Show Shortcut Help", keys: [k("?")] },
    ],
  },
  {
    title: "Board View",
    icon: Columns3,
    shortcuts: [
      { description: "Switch to Board View", keys: [k("Alt"), k("1")] },
      { description: "Switch to List View", keys: [k("Alt"), k("2")] },
      { description: "Switch to Table View", keys: [k("Alt"), k("3")] },
      { description: "Switch to Timeline View", keys: [k("Alt"), k("4")] },
    ],
  },
];

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 350, damping: 28 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Renders a single `<kbd>` badge */
const KbdBadge = ({ children }: { children: React.ReactNode }) => (
  <kbd className="inline-flex h-7 min-w-[28px] items-center justify-center rounded-lg border border-border bg-secondary px-2 text-[11px] font-mono font-medium text-muted-foreground shadow-sm">
    {children}
  </kbd>
);

/** Renders a full key sequence (e.g. G → D or Ctrl + Shift + L) */
const KeySequence = ({ keys }: { keys: ShortcutKey[] }) => (
  <span className="inline-flex items-center gap-1.5">
    {keys.map((entry, i) =>
      entry.type === "then" ? (
        <span
          key={i}
          className="text-[11px] text-muted-foreground/60 select-none"
        >
          →
        </span>
      ) : (
        <KbdBadge key={i}>{entry.label}</KbdBadge>
      ),
    )}
  </span>
);

/** Renders a single shortcut row */
const ShortcutRow = ({ shortcut }: { shortcut: ShortcutEntry }) => (
  <div className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-secondary/50">
    <span className="text-sm text-foreground">{shortcut.description}</span>
    <KeySequence keys={shortcut.keys} />
  </div>
);

/** Renders a grouped section (header + rows) */
const SectionBlock = ({ section }: { section: ShortcutSection }) => {
  const Icon = section.icon;

  return (
    <div>
      <div className="mb-3 flex items-center gap-2 border-b border-border pb-2">
        <Icon className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">
          {section.title}
        </h3>
      </div>

      <div className="space-y-0.5">
        {section.shortcuts.map((shortcut) => (
          <ShortcutRow key={shortcut.description} shortcut={shortcut} />
        ))}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const ShortcutOverlay = ({ isOpen, onClose }: ShortcutOverlayProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.2 }}
          onClick={onClose}
          role="dialog"
          aria-label="Keyboard shortcuts"
        >
          {/* Card */}
          <motion.div
            className="mx-4 w-full max-w-[640px] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
            variants={cardVariants as any}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ---- Header ---- */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div className="flex items-center gap-2.5">
                <Keyboard className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                  Keyboard Shortcuts
                </h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="Close shortcut overlay"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* ---- Content ---- */}
            <div className="max-h-[80vh] space-y-6 overflow-y-auto px-6 py-5">
              {SHORTCUT_SECTIONS.map((section) => (
                <SectionBlock key={section.title} section={section} />
              ))}
            </div>

            {/* ---- Footer ---- */}
            <div className="border-t border-border px-6 py-3 text-center">
              <p className="text-xs text-muted-foreground">
                Press <KbdBadge>?</KbdBadge> to close this overlay
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShortcutOverlay;
