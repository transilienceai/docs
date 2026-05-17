# Save an artifact

How to take an [output](../concepts/outputs.md) from a [session](../concepts/sessions.md) and save it into an [artifact folder](../concepts/artifacts.md) for later.

## Steps

1. **Open the session** that has the file you want to save. From [run history](../concepts/run-history.md), click the session's row.

2. **Click the Files tab** on the [session detail](../concepts/run-history.md#session-detail) page. You'll see every output the app produced, organized by folder.

3. **Find the file** you want to keep. Reports are typically markdown or PDF; data files are usually JSON or CSV. See [outputs](../concepts/outputs.md) for what each kind looks like.

4. **Use the save action** on the file. A dialog opens asking which [artifact folder](../concepts/artifacts.md#folders) to save it into.

5. **Pick a folder or create one.** If you have folders already (for example "Security Reports," "Q1 Audit," "Tabletop Exercises"), search the list and pick one. If none of them fits, click **Create folder**, name it, and the file goes into the new folder.

6. **Confirm.** The file is now an artifact. It will appear at **Artifacts** in the sidebar, inside the folder you chose, with a reference back to the session it came from.

## Verify it saved

Click **Artifacts** in the sidebar, open the folder you just used, and confirm the file is there. The card shows the file name, when you saved it, and the [session](../concepts/sessions.md) it came from.

## Variations

- **Upload a file that didn't come from a session.** From the [artifacts page](../concepts/artifacts.md), you can upload a file directly into a folder — useful for keeping a policy document, a vendor PDF, or any reference material alongside your scan results.
- **Save the same file into multiple folders.** Repeat the save action on the same file and pick a different folder each time — the file can live in more than one folder.
- **Save many files at once.** Save each file individually; there's no bulk save.

## Why save outputs as artifacts

- **They're easy to find later.** [Run history](../concepts/run-history.md) gets long. A named folder is faster to scan.
- **You can reference them in threads.** When you start a [thread](../concepts/threads.md), you can point it at an artifact directly, without remembering the session.
- **They survive cleanup.** If you delete an old session, the artifact you saved from it stays in your folder. (Behavior around deleted sessions can vary — see [artifacts](../concepts/artifacts.md#common-questions).)

## Related

- [Artifacts](../concepts/artifacts.md) — the concept.
- [Outputs](../concepts/outputs.md) — what you can save.
- [Run History](../concepts/run-history.md) — where you start.
- [Ask about a session](ask-about-a-session.md) — using saved artifacts in threads.
