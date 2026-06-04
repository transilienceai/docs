# Use the CLI

Drive Transilience.ai from your terminal with **[transiliencectl](../concepts/cli.md)** — list apps, run one, follow it to completion, and pull the outputs.

## 1. Install

```bash
pipx install transiliencectl
```

## 2. Configure once

Get an [API key](../concepts/api-keys.md) from the app (**Settings → API Keys**), then:

```bash
transiliencectl config set base-url <your-api-host>
transiliencectl auth login --api-key <YOUR_API_KEY>
transiliencectl auth status        # → Authenticated. base_url=...
```

You don't pass an organization anywhere — the key is bound to one, and the CLI uses it automatically.

## 3. The everyday loop

```bash
# See which apps you can run
transiliencectl projects list

# Start a run and wait for it to finish
transiliencectl run aws_public_resource_analyzer -q "Run a compliance scan" --follow

# Or list past runs and inspect one
transiliencectl sessions list
transiliencectl sessions get <session_id>

# Browse and download the outputs
transiliencectl files list <session_id>
transiliencectl files get <session_id> reports/summary.md -o summary.md
```

- `run --follow` (and `sessions get --follow`) polls until the run reaches a terminal status
  (**completed**, **incomplete**, or **failed**).
- `files get` without `-o` writes the file to stdout; with `-o PATH` it saves to disk.

## 4. Scripting and agents

Add `--json` to any command to get raw JSON instead of a table — easy to pipe into `jq` or hand to an AI agent:

```bash
transiliencectl --json sessions list | jq '.sessions[].session_id'
```

## Configuration reference

Resolution order is **flag → environment → config file**:

| Source | Base URL | API key |
|---|---|---|
| Flag | `--base-url` | `--api-key` |
| Environment | `TRANSILIENCE_BASE_URL` | `TRANSILIENCE_API_KEY` |
| Config file | `base_url` in `~/.transilience/config.json` | `api_key` in the same file |

## If something goes wrong

- **"Invalid or expired API key"** — re-check the key, or set a fresh one: `transiliencectl auth login --api-key <key>`.
- **"Cannot reach <base_url>"** — verify `transiliencectl config get base-url` points at the right host.
- **Empty `sessions list`** — it defaults to recent sessions; widen with `--start 2026-01-01 --end 2026-12-31`.

## Related

- [transiliencectl](../concepts/cli.md) — what the CLI is and its full command list.
- [API keys](../concepts/api-keys.md) — creating and revoking keys.
- [Use the API](use-the-api.md) — the raw HTTP endpoints behind the CLI.
