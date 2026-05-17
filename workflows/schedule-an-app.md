# Schedule an app

How to set an [app](../concepts/apps.md) to run automatically — either on a [recurring schedule](../concepts/scheduling.md#recurring-schedules) or as a [one-off run](../concepts/scheduling.md#one-off-runs) at a future time.

## Schedule a recurring run

1. **Open the apps page.** Click **Apps** in the left sidebar.

2. **Find the app's card.** Use the schedule action on the card to open the schedule dialog.

3. **Choose the recurring option.**

4. **Pick a cadence.** The presets are:
   - **Daily** — every 24 hours.
   - **Weekly** — every 7 days.
   - **Monthly** — about every 30 days (a fixed-interval approximation, not "same day of the month").
   - **Custom** — type your own hour interval.

5. **Set the window** (optional):
   - **Start date** — when the schedule becomes active.
   - **End date** — when it stops automatically.
   - **Max runs** — total cap on how many times it can run.
   - **Timezone** — pick your local timezone so times read correctly.

6. **Confirm.** The schedule is active. Every run it produces appears in [run history](../concepts/run-history.md) like any other [session](../concepts/sessions.md).

## Schedule a one-off run

1. **Open the schedule dialog** as above.

2. **Choose the one-off option.**

3. **Pick a date and time.** Set the timezone if you need it interpreted in your local zone.

4. **Confirm.** When the time arrives, the app runs and produces a [session](../concepts/sessions.md) you'll find in [run history](../concepts/run-history.md).

## Edit, pause, or delete a schedule

Open the schedule dialog for the same app again. From there you can:

- **Change the interval** or window of a recurring schedule.
- **Disable** a recurring schedule to pause it without losing the configuration; re-enable later.
- **Delete** the schedule entirely.

## Where scheduled runs show up

Scheduled runs are sessions like any other — they appear in [run history](../concepts/run-history.md) and produce [outputs](../concepts/outputs.md) you can read, save, and ask about. Filter the run history by app to find the runs a specific schedule has produced.

## Tips

- **Use the timezone.** If you want a 9 AM Monday scan, set your timezone — otherwise times are interpreted in UTC and you'll get the wrong hour.
- **Cap with max runs or an end date** when you want a time-bounded series (for example, "every Monday for six weeks").
- **Pair scheduling with a [thread](../concepts/threads.md).** When a recurring run finishes, open a thread on it and on the previous run to compare — see [ask about a session](ask-about-a-session.md).

## Related

- [Scheduling](../concepts/scheduling.md) — the concept.
- [Apps](../concepts/apps.md) — what you schedule.
- [Sessions](../concepts/sessions.md) — what scheduled runs create.
- [Run History](../concepts/run-history.md) — where the runs appear.
