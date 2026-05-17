# Scheduling

## What it is

A **schedule** is a rule that runs an [app](apps.md) automatically. There are two kinds:

- **Recurring schedule** — the app runs over and over at a chosen interval (daily, weekly, monthly, or a custom hour interval).
- **One-off run** — the app runs once at a specific future date and time.

Scheduled runs create [sessions](sessions.md) just like manual runs do. They show up in [run history](run-history.md), produce [outputs](outputs.md), and can be opened and discussed in [threads](threads.md) — the only difference is who pressed the button (you, or the schedule).

## Where to find it

On any card on the [apps page](apps.md) you'll find a schedule action. That opens the schedule dialog for that app, where you choose between a recurring schedule and a one-off run.

## Recurring schedules

A recurring schedule runs the same app on a fixed interval. The presets are:

- **Daily** — every 24 hours.
- **Weekly** — every 7 days.
- **Monthly** — about every 30 days (a fixed-interval approximation, not "same day of the month").
- **Custom** — pick your own hour interval.

You can also set:

- **Start date** — when the schedule becomes active.
- **End date** — when it stops automatically.
- **Max runs** — cap the total number of runs.
- **Timezone** — interpret times in your local timezone.
- **Enabled/disabled** — pause the schedule without deleting it.

You can edit a recurring schedule any time, change its interval, or turn it off.

## One-off runs

A one-off run is a single scheduled execution at a future date and time. Useful when you want to time a run for a specific moment (for example, a Monday morning audit kickoff) without setting up a recurring rule.

Once the one-off run fires, it produces a [session](sessions.md) just like any other run.

## What you can do here

- **Schedule** any app from its card on the [apps page](apps.md).
- **Edit** an existing schedule — change the interval, dates, or max runs.
- **Pause** (disable) a recurring schedule without losing its configuration.
- **Delete** a schedule when you no longer need it.

## Common questions

**"Can I run this every day?"** — Yes. Open the app's schedule dialog and pick **Daily**. See [schedule an app](../workflows/schedule-an-app.md).

**"Can I schedule a one-time future run?"** — Yes. Choose the one-off option and pick the date and time.

**"Where do I see the runs a schedule has produced?"** — On the [run history](run-history.md) page, just like manual runs. Filter by the app to find them.

**"Can I pause a schedule without deleting it?"** — Yes. Disable it from the schedule dialog; re-enable it whenever you're ready.

**"What if I want a different interval than the presets?"** — Use the custom option and set the hour interval yourself.

**"Does scheduling work in my timezone?"** — Yes — set the timezone when you create or edit the schedule.

## Related

- [Apps](apps.md) — what you schedule.
- [Sessions](sessions.md) — what each scheduled run creates.
- [Run History](run-history.md) — where scheduled-run sessions appear.
- [Schedule an app](../workflows/schedule-an-app.md) — step-by-step.
