---
name: commit
description: Generate a conventional commit from staged changes
disable-model-invocation: false
allowed-tools: Bash(git diff*), Bash(git status*), Bash(git log*), Bash(git commit*), Bash(git add*), AskUserQuestion
---

## Steps

1. Run `git diff --staged` to review staged changes.
2. If nothing is staged, run `git diff` and summarize the unstaged changes, then ASK the user what to stage. Do NOT auto-stage.
3. Generate a Conventional Commits message (`type(scope): description`).
4. Present the proposed message and wait for user approval.
5. Only run `git commit` after the user explicitly confirms.

## Rules

- NEVER run `git add` without explicit user approval.
- NEVER amend a previous commit unless the user asks.
- Keep the subject line under 72 characters.
- Include `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>` as a trailer.
