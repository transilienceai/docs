# transiliencectl (CLI)

## What it is

**transiliencectl** is a command-line tool that talks to the Transilience.ai [API](../workflows/use-the-api.md). It turns the everyday loop — list apps, run one, watch it, pull the outputs — into short commands, so you can drive the platform from a terminal or a script instead of writing `curl` by hand.

It authenticates with an [API key](api-keys.md) you mint in the app. Because the key is bound to one [organization](api-keys.md#org-binding), the CLI always acts in that org — there's nothing extra to pass.

## Install

```bash
pipx install transiliencectl      # recommended (isolated)
# or, for development from a checkout:
pip install -e .
```

## Configure it once

```bash
transiliencectl config set base-url <your-api-host>
transiliencectl auth login --api-key <YOUR_API_KEY>
transiliencectl auth status        # → Authenticated. base_url=...
```

Settings live in `~/.transilience/config.json`. Values can also come from the environment
(`TRANSILIENCE_BASE_URL`, `TRANSILIENCE_API_KEY`) or per-command flags (`--base-url`, `--api-key`);
the order of precedence is **flag → environment → config file**.

## Commands

| Command | What it does |
|---|---|
| `config set <key> <value>` | Store `base-url` or `api-key`. `config get` / `config path` to inspect. |
| `auth login --api-key <key>` | Save your key. `auth status` checks it; `auth logout` clears it. |
| `projects list` / `projects get <id>` | Browse the [apps](apps.md) you can run. |
| `run <project_id> -q "..." [--follow]` | Start a [run](sessions.md); `--follow` waits for it to finish. |
| `sessions list` / `sessions get <id> [--follow]` | List past runs; inspect one. |
| `files list <id>` / `files get <id> <path> -o out` | List a run's [outputs](outputs.md) and download one. |

Add `--json` to any command for machine-readable output (handy for scripts and AI agents).

## Common questions

**"How is this different from the raw API?"** — It's a friendlier front-end to the same [API](../workflows/use-the-api.md): no `curl`, no headers to remember, tables instead of raw JSON (unless you ask for `--json`).

**"Where do I get the key?"** — In the app under **Settings → API Keys**. See [API keys](api-keys.md).

**"Which org does it use?"** — The one your key is bound to. To act in another org, create a key there and `auth login` with it.

## Related

- [Use the CLI](../workflows/use-the-cli.md) — step-by-step walkthrough.
- [API keys](api-keys.md) — minting and managing keys.
- [Use the API](../workflows/use-the-api.md) — the underlying HTTP endpoints.
