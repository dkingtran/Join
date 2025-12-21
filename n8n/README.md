Join workflow (public)

This folder contains a sanitized copy of the n8n workflow for review by mentors:

- `Join-workflow-public.json` — Workflow JSON with all `credentials` blocks and sensitive `meta` removed. Safe to share for code/process review.

Important notes:
- The original `Join-workflow.json` contains credential references and should NOT be published. Keep it private.
- If you want mentors to run or test the workflow, create a staging n8n instance and import the original workflow there (ensure `N8N_ENCRYPTION_KEY` matches if credentials are encrypted).
- Do not commit any `.env` or files containing secrets; `.env` is already listed in the repo `.gitignore`.

How to import for testing:
1. In n8n UI: Workflows → Import → upload the original JSON (not the sanitized one).  
2. Recreate credentials in the UI (or import credentials separately) before enabling the workflow.

If you want, I can also:
- Remove node IDs from `Join-workflow-public.json` for additional anonymization, or
- Prepare a small ZIP containing only the public files for easy sharing.
