# Run an app

The end-to-end path from clicking an [app](../concepts/apps.md) to reading its results.

## Steps

1. **Open the apps page.** Click **Apps** in the left sidebar.

2. **Pick the app you want to run.** Each card shows the app's name, a short description, and its most recent status. If you want a longer description first, click the card to open the [app detail](../concepts/apps.md#app-detail).

3. **Click Run App.** A [session](../concepts/sessions.md) is created and you're taken to the [live activity](../concepts/live-activity.md) view at `/apps/{sessionId}`.

4. **Watch it run.** The timeline streams in as the app works. You can switch away — the session keeps running on the platform. The **Notifications** tab in the chat area shows you what's still running if you want to check on it later.

5. **When the session finishes**, the live activity view redirects you to the [session detail](../concepts/run-history.md#session-detail) page in [run history](../concepts/run-history.md), at `/run-history/{sessionId}`.

6. **Read the Summary tab.** This is the human-readable findings overview — severity counts, top issues, narrative.

7. **Browse the Files tab** for the full set of [outputs](../concepts/outputs.md) — reports, data files, dashboards, raw files. Download anything you want.

8. **Ask follow-up questions on the Chat tab.** This is a [thread](../concepts/threads.md) scoped to the session — see [ask about a session](ask-about-a-session.md).

## Optional next steps

- **Save** key outputs to an [artifact folder](../concepts/artifacts.md) so you can find them again later — see [save an artifact](save-an-artifact.md).
- **Pin** an output to the [Dashboards tab](../concepts/dashboards.md) for quick access from the main view.
- **Schedule** the app to run again automatically — see [schedule an app](schedule-an-app.md).
- **Re-run** the app any time, from its card on the [apps page](../concepts/apps.md) or from the row in [run history](../concepts/run-history.md).

## If something goes wrong

- If the session ends in **failed** status, open the session and check the **Timeline** tab — the error and the last step reached will be there.
- If the app finishes but you don't see the outputs you expected, check the **Files** tab folder by folder — some apps put data files in subfolders.
- For a quick targeted question ("did this app even look at IAM?"), ask on the **Chat** tab of the session.
