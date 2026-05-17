# Artifacts

## What they are

An **artifact** is a saved [output](outputs.md) — a file from a [session](sessions.md) that you've decided to keep and organize. Artifacts live in user-named **folders** so you can group related outputs together (for example, "Security Reports," "Q1 Audit Evidence," "Tabletop Exercises").

Artifacts let you keep important outputs close at hand without going back through [run history](run-history.md) every time.

## Where to find them

Click **Artifacts** in the left sidebar. The URL is `/artifacts`.

The page shows a grid of your folders. Click a folder to see the artifacts inside it. Each artifact card shows its file name, when it was saved, and which session it came from.

## Folders

A **folder** is just a named bin — you make as many as you want and pick whichever ones make sense. Folder names are free text; you choose them when you save an artifact or by creating a folder from the Artifacts page.

(Internally, a folder is called an "artifact type." You'll see "folder" in the UI and "artifact type" in some URLs and labels — they're the same thing.)

## What an artifact is, exactly

Each artifact is a reference to one specific output file from one specific session. The artifact remembers:

- The folder it lives in.
- Which session it came from.
- The original path of the file inside that session's outputs.
- When you saved it.

Because an artifact carries the link back to its session, you can always jump from an artifact to the full run it came from.

## What you can do here

- **Create a folder** — name it whatever helps you find it later.
- **Save an output as an artifact** — done from the **Files** tab of a [session detail](run-history.md#session-detail). See [save an artifact](../workflows/save-an-artifact.md).
- **Upload a file directly** as an artifact (not from a session) — for example, a policy document you want to keep alongside your scan results.
- **Open or download** any artifact.
- **Delete** an artifact you no longer need, or delete a whole folder.
- **Reference an artifact** in a [thread](threads.md) when asking the AI a question — see [ask about a session](../workflows/ask-about-a-session.md).

## Common questions

**"How do I save a report so I don't lose it?"** — Open the session, go to the **Files** tab, and save the report to an artifact folder. Full walk-through: [save an artifact](../workflows/save-an-artifact.md).

**"Where do I find my saved files?"** — Click **Artifacts** in the sidebar. Pick the folder you saved into.

**"What's the difference between artifacts and dashboards?"** — Artifacts are user-named folders for organized storage. [Dashboards](dashboards.md) is a flat per-app quick-access list. Use artifacts when you want named collections; use dashboards when you want a single output one click away.

**"Can I upload a file that didn't come from a session?"** — Yes. From the Artifacts page or the save dialog, you can upload any file directly into a folder.

**"If I delete the original session, does the artifact go with it?"** — The artifact records the session ID and the original file path; check the in-app behavior for your situation. To be safe, keep the original session around while you still need the artifact.

**"Can I move an artifact between folders?"** — There's no move action; save the file again into the new folder if needed.

## Related

- [Outputs](outputs.md) — what becomes an artifact.
- [Sessions](sessions.md) — where the original file lives.
- [Run History](run-history.md) — the path you take to save an artifact.
- [Threads](threads.md) — referencing artifacts when asking questions.
- [Save an artifact](../workflows/save-an-artifact.md) — the step-by-step.
