# Live Activity

## What it is

**Live Activity** is the real-time view of a [session](sessions.md) while it's running. As the [app](apps.md) works, you see steps stream in, partial outputs appear, and the session's [status](sessions.md#statuses) update without you needing to refresh.

## Where to find it

Two ways:

- Right after you click **Run App** on the [apps page](apps.md), you're taken to live activity automatically.
- The URL is `/apps/{sessionId}` — bookmarkable and shareable.

## What you see

- A breadcrumb showing **Apps > Live Activity** so you know where you are.
- A streaming **timeline** of what the app is doing — each step appears as the app completes it.
- The session's **status** updating from running to completed (or failed) when it finishes.
- A small set of partial outputs as they're produced (the full file list is available in [session detail](run-history.md#session-detail) once the run finishes).

When the session finishes, the page automatically redirects you to that session's detail page in [run history](run-history.md) after a short delay.

## Notifications

Inside the main chat area there's a **Notifications** tab that lists your currently running and recently finished sessions. Use it to keep an eye on multiple runs at once without leaving your current page. Click any item in the list to jump to its live activity (if still running) or session detail (if finished).

## What you can do here

- **Watch** the session in real time.
- **Open the session detail** as soon as outputs start appearing.
- **Switch away** — the session keeps running on the platform; come back any time via [run history](run-history.md) or the URL.

## Common questions

**"How do I check on a session that's still running?"** — Open the **Notifications** tab in the chat area, or go directly to `/apps/{sessionId}` if you have the ID. You can also see running sessions on the [run history](run-history.md) page with status "running."

**"Do I need to keep the page open for the app to finish?"** — No. Once you click Run, the session runs on the platform until it finishes. You can close the browser and come back later.

**"Can I cancel a session from here?"** — No. Sessions run to completion; if you no longer want the result, delete the session afterward from [run history](run-history.md).

**"Why did the page redirect me?"** — When a session completes, the live activity view automatically forwards you to the [session detail](run-history.md#session-detail) page so you can read the results.

## Related

- [Sessions](sessions.md) — the underlying concept.
- [Run History](run-history.md) — where the session lands after it finishes.
- [Outputs](outputs.md) — what the session produces, ready for you on the Files tab once it's done.
