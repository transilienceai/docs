# Run History

## What it is

**Run History** is the page that lists every [session](sessions.md) you have run, newest first. Each row is one session: which [app](apps.md) ran, when it started, how long it took, what its status is, and a link into the [session detail](#session-detail).

## Where to find it

Click **Run History** in the left sidebar. The URL is `/run-history`.

## The list

Each row in the run history table shows:

- **Status** — one of [pending, running, completed, failed](sessions.md#statuses), plus an indicator if the run finished with warnings (critical or high findings).
- **App name** — which [app](apps.md) was run.
- **Started** — when the session began.
- **Duration** — how long it ran.
- **Items processed** — a count of records, resources, or steps the app handled (varies by app).
- **Actions** — open the session, re-run the app, or delete the session.

The list scrolls; older sessions load as you scroll down. You can filter by date range, by app, and by status to narrow it down.

## Session detail

Clicking a row opens that session's detail page at `/run-history/{sessionId}`. The detail page has four tabs:

### Summary

A human-readable summary of what the app found. For security apps this is often a list of findings grouped by severity (critical, high, medium, low) with counts and short descriptions.

### Files

A file explorer showing every [output](outputs.md) the app produced — organized by folder. From here you can:

- **Download** an individual file.
- **Download all** as a zip.
- **Save** an output to an [artifact folder](artifacts.md) — see [save an artifact](../workflows/save-an-artifact.md).
- **Pin** an output to the [Dashboards](dashboards.md) tab.
- **Delete** a file you don't need.

### Timeline

The step-by-step log of what the app did during the run. Useful when something went wrong, or when you want to understand how a particular finding was discovered. If the session **failed**, the error appears here.

### Chat

A [thread](threads.md) scoped to this session. Ask questions like "how many criticals were there" or "show me the IAM findings" and the AI answers using the session's outputs as context. See [ask about a session](../workflows/ask-about-a-session.md) for how this works across multiple sessions.

## What you can do here

- **Find a past run** by app, date, or status.
- **Open a session** to read its [outputs](outputs.md).
- **Re-run** an app from a previous session's row.
- **Delete** sessions you no longer need.
- **Save** an output to an [artifact folder](artifacts.md) directly from the Files tab.
- **Ask questions** about a session in the Chat tab.

## Common questions

**"Where are my past runs?"** — Click **Run History** in the sidebar.

**"How do I find a specific session?"** — Use the filters at the top of the run history list (date, app, status), or open the session URL directly if you have it.

**"What if a session failed?"** — Open the session and check the **Timeline** tab — the error message and the last step the app reached will be there.

**"How do I download all the files from a run?"** — Open the session, go to the **Files** tab, and use the download-all (zip) action.

**"Can I see runs from other people in my org?"** — Run history is scoped to your organization, so yes — anyone in your org can see runs done by anyone else in the org.

## Related

- [Sessions](sessions.md) — what each row in the list represents.
- [Live Activity](live-activity.md) — where you watch a session that's still running.
- [Outputs](outputs.md) — the files inside the **Files** tab.
- [Artifacts](artifacts.md) — saving outputs from the Files tab.
- [Threads](threads.md) — what the **Chat** tab is.
