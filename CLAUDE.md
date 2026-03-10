# CLAUDE.md

## Git Commit Convention
- **Never** add `Co-Authored-By` to commits
- Prefixes: `feat`, `fix`, `refactor`, `chore`
- Format: `prefix: Message starting with capital letter.`
- Message must describe the task solved in human-readable language, not technical details
- Technical details are only allowed in `refactor` and `chore` commits
- If a commit cannot be split into multiple, add an additional sentence with change details
- Each commit must contain only logically related changes — config/docs changes (CLAUDE.md, .eslintrc, etc.) are always a separate `chore` commit, never bundled with feature code
- Examples:
  - `feat: Add exercise sharing and duplicate.`
  - `fix: Fix exercise deletion not working.`
  - `refactor: Replace legacy context usage with hook.`
  - `chore: Update dependencies.`
