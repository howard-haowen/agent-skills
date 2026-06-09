# AGENTS.md

## 1. Repository purpose

This repository is the source of truth for global AI agent skills shared across agents. It is intended to live directly at `~/.agents/skills` and should be treated as the global skills directory, not a project-scoped skills folder.

## 2. Directory conventions

- Each direct child folder is a skill; list folders in this repo to determine which skills are installed.
- Each skill folder should contain a `SKILL.md` file.
- Custom skills must use folder names starting with `haowen-`.
- Public/upstream skills may keep their original names.
- The global lock file is `~/.agents/.skill-lock.json`, outside this repo root.
- Generated files and lock files should not be hand-edited unless necessary; prefer tool-managed updates.

## 3. Skill authoring rules

- Custom skills must start with `haowen-`.
- Each custom skill must have a clear `SKILL.md`.
- `SKILL.md` should include frontmatter with `name` and `description` when appropriate.
- Keep instructions specific, operational, and testable.
- Do not include secrets, private tokens, or machine-specific paths unless absolutely necessary.
- Prefer reusable procedures over one-off notes.

## 4. Public skill rules

- Do not casually edit upstream-installed skills.
- If behavior needs customization, prefer creating a `haowen-*` wrapper or companion skill.
- Review diffs after syncing upstream skills.
- Whenever new skills are installed, update `README.md` to reflect the current installed skills.
- Do not overwrite local custom skills during sync.

## 5. `npx skills` commands

Known global-scope command:

```bash
npx skills update -g
```

This updates all public/upstream global skills, may modify skill folders under `~/.agents/skills`, and updates the global lock file at `~/.agents/.skill-lock.json`.

Other useful commands observed from `npx skills --help` examples; verify behavior before using on important changes:

```bash
npx skills ls -g --json                 # list global skills
npx skills add <package> -g             # add a public skill package globally
npx skills add <package> -g --skill <skill-name>
npx skills init <name>                  # initialize a skill skeleton
cat ~/.agents/.skill-lock.json          # inspect the global lock file
```

Avoid project-scoped assumptions such as `./skills-lock.json` unless such a file actually exists in this repo.

## 6. Git workflow

- Commit changes to custom skills normally.
- After running `npx skills update -g`, review `git diff` inside `~/.agents/skills`.
- Also check whether `~/.agents/.skill-lock.json` changed.
- Because `~/.agents/.skill-lock.json` is outside the repo root, mention it explicitly in commit or sync notes if it is not tracked.
- Do not commit secrets, local caches, `node_modules/`, or large generated artifacts.

## 7. Validation checklist

Before finishing any change:

- Confirm every changed skill has a valid `SKILL.md`.
- Confirm custom skill folders start with `haowen-`.
- If skills were added or removed, list direct child folders and update `README.md` accordingly.
- Run available validation/listing commands if present, such as `npx skills ls -g --json`.
- Show changed files with `git status --short`.
- Mention whether `~/.agents/.skill-lock.json` changed.
- Summarize assumptions and any uncertain commands.
