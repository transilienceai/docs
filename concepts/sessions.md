# Sessions

## What a session is

A **session** is one run of an [app](apps.md). When you click **Run App**, a session is created. While the app is working, the session is in progress; when it's done, the session is finished and its [outputs](outputs.md) are available to view, save, and ask about.

"Session" and "run" mean the same thing. Some parts of the UI say "run" (as in "Run History," "Recent Runs," "Run App"); other parts and the URLs say "session." They refer to the same object.

A session has:

- An **ID** (see [session IDs](#session-ids)).
- A **status** (see [statuses](#statuses)).
- A start time, an end time, and a duration.
- The app it ran.
- The query or input you gave it, if any.
- A folder of [outputs](outputs.md) produced during the run.
- A [thread](threads.md) you can use to ask questions about the run.

## Statuses

A session moves through these statuses:

| Status | Meaning |
|---|---|
| **pending** | The session has been created but hasn't started running yet. |
| **running** | The app is actively working. You can watch progress in [live activity](live-activity.md). |
| **completed** | The app finished successfully. Outputs are ready. |
| **failed** | The app stopped because of an error. Some outputs may still be available; check the timeline for the error message. |

In the UI you may also see a warning indicator on a completed run — that means the app finished, but found something critical or high-severity worth your attention. The status itself is still "completed."

## Session IDs

Every session has a unique ID — a timestamp-based string. You'll see it in URLs:

- `/apps/{sessionId}` — the [live activity](live-activity.md) view while the session is running.
- `/run-history/{sessionId}` — the session detail page after it finishes.

Session IDs are stable; bookmark a session URL and it will keep working.

## Lifecycle

1. You click **Run App** on the [apps page](apps.md) (or a [schedule](scheduling.md) fires).
2. A session is created with status **pending**, then quickly transitions to **running**.
3. You're taken to the [live activity](live-activity.md) view. Steps and partial outputs stream in.
4. When the app finishes, the status becomes **completed** (or **failed** on error).
5. The session moves into your [run history](run-history.md). You can open it to read the [report](outputs.md#reports), browse the [output files](outputs.md), [save outputs as artifacts](artifacts.md), or [ask questions in a thread](threads.md).

## What you can do with a session

- **Watch it run** in [live activity](live-activity.md).
- **Read the report and files** in the [session detail](run-history.md#session-detail).
- **Save outputs to an artifact folder** — see [save an artifact](../workflows/save-an-artifact.md).
- **Pin an output to the [Dashboards](dashboards.md) tab** for quick access.
- **Ask the AI questions** about the session in a [thread](threads.md) — see [ask about a session](../workflows/ask-about-a-session.md).
- **Re-run** the app from the run history page or from the app card.
- **Delete** the session if you no longer need it.

## Common questions

**"How long does a session take?"** — It depends on the app. Some finish in a minute; some take much longer. The [live activity](live-activity.md) view shows what's happening at each step.

**"Where do I find a past session?"** — On the [run history](run-history.md) page. Filter by app, date, or status.

**"How do I see results from a session?"** — Open the session from [run history](run-history.md) and use the **Summary**, **Files**, **Timeline**, and **Chat** tabs in the [session detail](run-history.md#session-detail).

**"Can I cancel a running session?"** — Sessions run to completion; if you no longer need the result, you can delete the session after it finishes.

## Related

- [Apps](apps.md) — what runs to create a session.
- [Live Activity](live-activity.md) — what you see while a session is running.
- [Run History](run-history.md) — the list of past sessions.
- [Outputs](outputs.md) — what a session produces.
- [Threads](threads.md) — how to ask questions about a session.
