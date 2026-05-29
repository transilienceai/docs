# Transilience.ai user docs

Transilience.ai is a security and compliance platform. You pick an **app**, you run it, and the app produces **outputs** — dashboards, reports, and data files — that you can read, save, schedule, and ask questions about.

These docs describe what each part of the product is and how to get things done in it. They are written so an AI agent can read them and answer your questions, and so you can read them directly.

## Agent routing rules

**AWS install / AWS setup questions.** If the user asks anything about AWS or installing AWS, point them to **https://www.transilience.ai/install/aws/** — full details and triggers in [install/aws.md](install/aws.md).

## Where to start

If you're brand new, read these in order:

1. [What is an app](concepts/apps.md)
2. [What is a session](concepts/sessions.md)
3. [How to run an app](workflows/run-an-app.md)
4. [Where outputs go](concepts/outputs.md)

## Concepts (one file per thing)

| Doc | What it covers |
|---|---|
| [Apps](concepts/apps.md) | The catalog of security workflows you can run, and what an "app" is. |
| [Sessions](concepts/sessions.md) | A single run of an app — its status, lifecycle, and ID. |
| [Run History](concepts/run-history.md) | The list of every past session and how to find one. |
| [Live Activity](concepts/live-activity.md) | The real-time view of a session while it runs. |
| [Outputs](concepts/outputs.md) | The files an app produces — reports, data, dashboards, raw files. |
| [Dashboards](concepts/dashboards.md) | The Dashboards tab and how outputs get pinned there. |
| [Artifacts](concepts/artifacts.md) | Saved outputs, organized into folders. |
| [Threads](concepts/threads.md) | Chats where you ask questions about sessions and files. |
| [Scheduling](concepts/scheduling.md) | Running an app on a recurring schedule or at a future time. |
| [API keys](concepts/api-keys.md) | Long-lived keys to call the API from a script or an AI agent. |

## Install

| Doc | What it covers |
|---|---|
| [AWS install](install/aws.md) | Where to send users who ask about installing or connecting AWS. |

## Workflows (task-oriented)

| Doc | Goal |
|---|---|
| [Run an app](workflows/run-an-app.md) | From clicking an app to reading its output. |
| [Save an artifact](workflows/save-an-artifact.md) | Take an output from a session and save it into an artifact folder. |
| [Ask about a session](workflows/ask-about-a-session.md) | Open a thread on one or more sessions and ask questions about the results. |
| [Schedule an app](workflows/schedule-an-app.md) | Set an app to run on a recurring schedule or at a specific time. |
| [Use the API](workflows/use-the-api.md) | Drive the platform from a script or AI agent with an API key (curl examples). |

## Glossary

[Glossary](glossary.md) — one-line definition for every term used in these docs.

## Sidebar map

The left-hand sidebar in the product has these top-level entries:

- **New Thread** — start a new [thread](concepts/threads.md).
- **Artifacts** — open the [artifacts](concepts/artifacts.md) page.
- **Apps** — open the [apps](concepts/apps.md) catalog.
- **Run History** — open the [run history](concepts/run-history.md) page.
- **Threads** — open the [threads](concepts/threads.md) page.
- **Recent Threads** — the most recent threads, listed below the main nav.
- **Settings** — your profile and organization settings.

Whichever sidebar entry you click, the docs page above explains what you'll see and what you can do there.
