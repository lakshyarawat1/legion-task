# LegionTask — Bugs and Vulnerabilities Registry

This directory contains reports of bugs, crashes, input validation gaps, and security vulnerabilities identified by the **Antagonistic Tester Agent**.

Developer agents (or developers) should use the reports logged here to implement fixes. Once a bug is resolved, its report should be updated or marked as resolved/archived.

## Process Flow

```
┌─────────────────────────────────┐
│    Antagonistic Tester Agent    │
│  (Finds bugs, logs BUG-XXX.md)  │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│     Developer Agent / User      │
│ (Reads bug, fixes code, tests)  │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│    Antagonistic Tester Agent    │
│  (Re-tests and confirms fix)    │
└─────────────────────────────────┘
```

## Bug Report Format

Reports should follow the template defined in [.agents/skills/antagonistic_tester/SKILL.md](file:///f:/legion-task/.agents/skills/antagonistic_tester/SKILL.md).

## Bug Log Directory

All active bugs are logged in this directory as individual markdown files:
- `BUG-XXX.md`
