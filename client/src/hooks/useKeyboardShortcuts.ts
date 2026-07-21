"use client";

import { useEffect, useCallback, useRef } from "react";

export interface ShortcutCallbacks {
  onNavigateDashboard?: () => void; // G -> D
  onNavigateProjects?: () => void; // G -> P
  onNavigateTimeline?: () => void; // G -> T
  onNavigateSettings?: () => void; // G -> S
  onFocusSearch?: () => void; // /
  onCreateTask?: () => void; // C
  onToggleTheme?: () => void; // Ctrl+Shift+L
  onToggleSidebar?: () => void; // [
  onEscape?: () => void; // Esc
  onToggleShortcutHelp?: () => void; // ?
  onSwitchView?: (view: string) => void; // Alt+1..4 -> 'board','list','table','timeline'
}

const SEQUENCE_TIMEOUT_MS = 800;

const VIEW_MAP: Record<string, string> = {
  "1": "board",
  "2": "list",
  "3": "table",
  "4": "timeline",
};

/**
 * Returns true when the active element is a form control or contenteditable,
 * meaning most shortcuts should be suppressed (except Esc).
 */
function isInputFocused(): boolean {
  const el = document.activeElement;
  if (!el) return false;

  const tag = el.tagName.toLowerCase();
  if (tag === "input" || tag === "textarea" || tag === "select") return true;
  if (el.getAttribute("contenteditable") === "true") return true;

  return false;
}

function useKeyboardShortcuts(callbacks: ShortcutCallbacks): void {
  // Keep a mutable ref to the latest callbacks so the keydown handler
  // never captures a stale closure.
  const callbacksRef = useRef<ShortcutCallbacks>(callbacks);
  callbacksRef.current = callbacks;

  // Sequence state — tracks the first key of a two-key combo.
  const pendingKeyRef = useRef<string | null>(null);
  const sequenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetSequence = useCallback(() => {
    pendingKeyRef.current = null;
    if (sequenceTimerRef.current !== null) {
      clearTimeout(sequenceTimerRef.current);
      sequenceTimerRef.current = null;
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const cb = callbacksRef.current;
      const key = e.key;

      // ── Escape always fires, even inside inputs ──────────────────
      if (key === "Escape") {
        cb.onEscape?.();
        resetSequence();
        return;
      }

      // ── Modifier combos (checked before the input guard) ─────────
      // Ctrl+Shift+L — toggle theme
      if (e.ctrlKey && e.shiftKey && key.toUpperCase() === "L") {
        e.preventDefault();
        cb.onToggleTheme?.();
        resetSequence();
        return;
      }

      // Ctrl+Enter — currently unused, reserved for future submit
      if (e.ctrlKey && key === "Enter") {
        e.preventDefault();
        resetSequence();
        return;
      }

      // Alt+1 … Alt+4 — switch view
      if (e.altKey && key in VIEW_MAP) {
        e.preventDefault();
        cb.onSwitchView?.(VIEW_MAP[key]);
        resetSequence();
        return;
      }

      // ── Input guard: skip plain keystrokes in form elements ──────
      if (isInputFocused()) return;

      // ── Two-key sequences starting with G ────────────────────────
      if (pendingKeyRef.current === "g") {
        resetSequence();

        const second = key.toLowerCase();
        switch (second) {
          case "d":
            cb.onNavigateDashboard?.();
            return;
          case "p":
            cb.onNavigateProjects?.();
            return;
          case "t":
            cb.onNavigateTimeline?.();
            return;
          case "s":
            cb.onNavigateSettings?.();
            return;
          default:
            // Unknown second key — silently reset (already done above).
            return;
        }
      }

      // Start a new G-sequence
      if (key.toLowerCase() === "g" && !e.ctrlKey && !e.altKey && !e.metaKey) {
        pendingKeyRef.current = "g";
        sequenceTimerRef.current = setTimeout(resetSequence, SEQUENCE_TIMEOUT_MS);
        return;
      }

      // ── Single-key shortcuts ─────────────────────────────────────
      switch (key) {
        case "/":
          e.preventDefault();
          cb.onFocusSearch?.();
          break;
        case "c":
        case "C":
          if (!e.ctrlKey && !e.metaKey) {
            cb.onCreateTask?.();
          }
          break;
        case "[":
          cb.onToggleSidebar?.();
          break;
        case "?":
          cb.onToggleShortcutHelp?.();
          break;
      }

      resetSequence();
    },
    [resetSequence],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      // Clean up any pending sequence timer.
      if (sequenceTimerRef.current !== null) {
        clearTimeout(sequenceTimerRef.current);
      }
    };
  }, [handleKeyDown]);
}

export default useKeyboardShortcuts;
