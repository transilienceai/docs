# Apps

## What an app is

An **app** is a reusable security or compliance workflow you can run on demand. Each app does one job — for example, scanning a cloud account for misconfigurations, running a CIS benchmark, generating a tabletop exercise, or analyzing access reviews. The catalog of apps is what you see when you click **Apps** in the sidebar.

You'll see **App** everywhere in the product UI. In the URL bar an app detail page appears as `/apps/detail/{appId}`.

## Where to find them

Click **Apps** in the left sidebar. The [apps page](#apps-page) opens.

## Apps page

The apps page is a grid of cards. Each card shows:

- The app's **name** and short description.
- The status of its most recent run, if any.
- Buttons to **run** the app, **schedule** it (see [scheduling](scheduling.md)), or open its detail page.

A sidebar on the right lists your most recent runs across all apps, with the latest status of each — running, completed, or finished with warnings.

## App detail

Clicking an app card opens its detail page at `/apps/detail/{appId}`. The detail page shows:

- The full description of what the app does.
- A button to launch the app.

When you launch, the app starts a new [session](sessions.md) and you're taken to the [live activity](live-activity.md) view while it runs.

## How the catalog is populated

The apps in the catalog come from a curated library that the platform maintains. Apps are versioned and updated by the Transilience team — you don't author apps from this UI. When new apps are added or existing ones improved, they appear in the catalog automatically.

## What you can do here

- **Browse** the catalog and read each app's description.
- **Run** an app on demand — see [run an app](../workflows/run-an-app.md).
- **Schedule** an app to run recurringly or at a future time — see [schedule an app](../workflows/schedule-an-app.md).
- **Open the app detail** to read a longer description before running.

## Common questions

**"Where do I find the apps?"** — Click **Apps** in the left sidebar.

**"Where do I see results from an app?"** — Once a run finishes, the [outputs](outputs.md) appear in the [run history](run-history.md). While it's still running, you see them stream into the [live activity](live-activity.md) view.

**"Can I create my own app?"** — Not from this UI. Apps are maintained by the platform team. You can [schedule](scheduling.md) and [ask questions about](threads.md) any existing app's runs.

## Related

- [Sessions](sessions.md) — what gets created when you run an app.
- [Run History](run-history.md) — where all your past app runs live.
- [Scheduling](scheduling.md) — running an app on a recurring schedule.
- [Run an app](../workflows/run-an-app.md) — the step-by-step.
