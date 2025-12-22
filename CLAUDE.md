# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a proof-of-concept project for HTML review functionality. The project is in early development.

## Environment

Uses direnv for environment management (`.envrc` with `source_up` to inherit from parent directory).

## Task Workflow

All work is tracked through numbered task folders tied to GitHub issues:

```
tasks/
├── 00001-first-task/        # GitHub Issue #1
├── 00002-another-task/      # GitHub Issue #2
└── XXXXX-task-name/         # Future tasks
```

### Creating a New Task

1. **Create GitHub Issue:**
   ```bash
   gh issue create --title "Task title" --body "Description"
   ```

2. **Create Task Folder:**
   ```bash
   mkdir tasks/XXXXX-task-name/
   ```
   - Use 5-digit numbering (00001, 00002, etc.)
   - Match the GitHub issue number when possible

3. **Add README.md** to document the task (see `tasks/TEMPLATE.md`)

4. **Do the work**

5. **Commit with Issue Reference:**
   ```
   Closes #X
   ```

### Task Folder Contents

Each task folder may contain:
- `README.md` - Task description, decisions, outcomes
- `output/` - Generated artifacts (code, data, docs)
- Subtask directories (see below)
- Any other relevant files

### Subtasks

Subtasks are smaller units of work within a task. They live inside the task folder with their own directory and README:

```
tasks/00001-first-task/
├── README.md
├── 01-subtask-name/
│   └── README.md
├── 02-another-subtask/
│   └── README.md
└── output/
```

- Use 2-digit numbering (01, 02, etc.)
- Format: `##-subtask-name-here`
- Each subtask has its own `README.md`
- Subtasks are ordered/stacked numerically
