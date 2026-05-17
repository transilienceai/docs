# Ask about a session

How to open a [thread](../concepts/threads.md) and ask the AI questions about one or more [sessions](../concepts/sessions.md), [outputs](../concepts/outputs.md), or [artifacts](../concepts/artifacts.md).

## Ask about one session

1. **Open the session.** From [run history](../concepts/run-history.md), click into the [session detail](../concepts/run-history.md#session-detail).

2. **Click the Chat tab.** That tab is a [thread](../concepts/threads.md) already scoped to this session — the AI uses the session's outputs as context.

3. **Type your question.** For example:
   - "How many criticals are in this run?"
   - "Show me just the IAM findings."
   - "Summarize the top three risks."
   - "Was there anything missed compared to a normal CIS check?"

4. **Read the answer** and follow up. The thread is saved, so you can come back to it later from **Threads** in the sidebar.

## Ask across multiple sessions

To compare or combine results across runs (for example, this week's scan vs. last week's):

1. **Start a new thread.** Click **New Thread** in the sidebar.

2. **Reference each session** you want included. You can point the thread at a [session](../concepts/sessions.md) by ID, at a specific [output file](../concepts/outputs.md) from a session, or at a saved [artifact](../concepts/artifacts.md).

3. **Ask your question.** For example:
   - "Compare this week's scan to last week's — what's new?"
   - "Across these three runs, which findings appear every time?"
   - "Pull the resource counts from each session into a single table."

The AI uses every referenced session and file as context for the answer.

## Reference a file or artifact directly

You can scope a thread to a specific file rather than a whole session:

- **From the Files tab** of a session, point a thread at one file.
- **From the artifacts page**, point a thread at a saved [artifact](../concepts/artifacts.md).
- **Upload a file** into the thread directly, even if it didn't come from a session — useful for asking about a policy doc, a vendor report, or anything else.

## Save what you learn

When the thread produces a useful summary, you can:

- **Save** the answer or any referenced file to an [artifact folder](../concepts/artifacts.md) — see [save an artifact](save-an-artifact.md).
- **Rename** the thread to something descriptive so you can find it.
- **Group** it under a [thread group](../concepts/threads.md#thread-groups) with related threads.

## Tips

- **Be specific in your first question.** "How many criticals" is better than "tell me about this." The AI uses the session's outputs to answer; concrete questions return concrete answers.
- **Reference, don't paste.** If you want the AI to look at a file, point the thread at the file instead of pasting its contents — the AI sees the whole file that way.
- **Combine context.** A thread can hold multiple sessions and multiple files at once. Use that to ask cross-cutting questions.

## Related

- [Threads](../concepts/threads.md) — the concept.
- [Sessions](../concepts/sessions.md) — the usual subject of a thread.
- [Outputs](../concepts/outputs.md) — files you can point a thread at.
- [Artifacts](../concepts/artifacts.md) — saved files for easy reference.
- [Save an artifact](save-an-artifact.md) — keeping a referenced file around.
