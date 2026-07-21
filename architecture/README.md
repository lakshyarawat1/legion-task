# LegionTask — Architectural Blueprints Registry

This directory contains system designs, schema updates, API blueprints, and integration specs designed by the **System Architect Agent**.

Developer agents (or developers) should use the blueprints logged here to implement features. Once a blueprint is implemented, its status should be updated to `Implemented`.

## Process Flow

```
┌─────────────────────────────────┐
│     System Architect Agent      │
│ (Creates specs, logs ARCH-XXX)  │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│     Developer Agent / User      │
│  (Reads blueprint, writes code) │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│    Antagonistic Tester Agent    │
│    (Verifies implementation)    │
└─────────────────────────────────┘
```

## Architectural Blueprint Format

Blueprints should follow the template defined in [.agents/skills/system_architect/SKILL.md](file:///f:/legion-task/.agents/skills/system_architect/SKILL.md).

## Architecture Registry

All design specifications are logged in this directory as individual markdown files:
- `ARCH-XXX.md`
