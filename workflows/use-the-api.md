# Use the API

Drive Transilience.ai from a script or an AI agent (like Claude Code) instead of the browser, using an [API key](../concepts/api-keys.md).

## Before you start

- Create a key in **Settings → API Keys** and copy the secret (it's shown once). See [API keys](../concepts/api-keys.md).
- Know your **base URL** — the address of the API. The exact host is shown in the API Keys panel.

## Authenticate

Send the key as a bearer token on every request. The key is bound to one [organization](../concepts/api-keys.md#org-binding), so you do **not** send any organization header.

```
Authorization: Bearer <YOUR_API_KEY>
```

## The core loop

The everyday path is: list apps → run one → poll until it finishes → read its outputs.

```bash
BASE="https://<your-api-host>"
KEY="<YOUR_API_KEY>"

# 1. See which apps you can run
curl -s "$BASE/projects/" -H "Authorization: Bearer $KEY"

# 2. Start a run — returns a session id
curl -s "$BASE/project/execute" \
  -H "Authorization: Bearer $KEY" \
  -H "Content-Type: application/json" \
  -d '{"project_id":"aws_public_resource_analyzer","query":"Run a compliance scan"}'

# 3. Poll the run until status is COMPLETED (or INCOMPLETE / FAILED)
curl -s "$BASE/project/outputs/<session_id>" -H "Authorization: Bearer $KEY"

# 4. List the output files, then download one
curl -s "$BASE/project/files/<session_id>" -H "Authorization: Bearer $KEY"
curl -s "$BASE/project/files/<session_id>?file_path=reports/summary.md" \
  -H "Authorization: Bearer $KEY" -o summary.md
```

Other useful calls:

```bash
# List your recent runs (defaults to the last 5 days)
curl -s "$BASE/project/sessions" -H "Authorization: Bearer $KEY"

# Widen the date range
curl -s "$BASE/project/sessions?start_date=2026-01-01&end_date=2026-12-31" \
  -H "Authorization: Bearer $KEY"
```

Notes:

- `/project/outputs/{session_id}` is a **polling** endpoint — call it on an interval until the status is terminal (`COMPLETED`, `INCOMPLETE`, or `FAILED`).
- `/project/files/{session_id}` returns a **file list** with no query parameter, or one file's **raw bytes** when you pass `?file_path=...`.

## Point an AI agent at it

Hand the agent two things:

1. Your **API key**.
2. The **documentation URL** shown in the API Keys panel — a machine-readable guide at `/llms.txt` that explains auth and the core endpoints with examples.

The agent reads the guide, then makes the same calls shown above on your behalf — running apps, polling them, and reading the results.

## If something goes wrong

- **`401`** — the key is missing, wrong, or revoked. Check the `Authorization` header and that the key still exists in **Settings → API Keys**.
- **`503` about API keys not being enabled** — the workspace administrator needs to enable the API Keys feature; ask them to turn it on.
- **Empty session list** — `/project/sessions` defaults to the last 5 days; widen it with `start_date` / `end_date`.

## Related

- [API keys](../concepts/api-keys.md) — creating, binding, and revoking keys.
- [Run an app](run-an-app.md) — the same flow from the web UI.
- [Sessions](../concepts/sessions.md) and [Outputs](../concepts/outputs.md) — what the responses contain.
