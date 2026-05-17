# Threads

## What they are

A **thread** is a conversation in which you ask the AI questions and get answers. You can ask anything — about a specific [session](sessions.md), about one or more [output files](outputs.md), about a saved [artifact](artifacts.md), or about your work in general.

Threads are how you do follow-up after a run. "How many criticals did we find?" "Compare this scan to last week's." "Pull the IAM findings out of this report." All of that happens in a thread.

"Thread" and "chat" mean the same conversation, looked at from different angles. **Thread** is the saved record (and the name on the sidebar). **Chat** is the live view where you type messages. Internally, threads are also called **conversations**.

## Where to find them

- **Threads** in the left sidebar — the full list of every thread you've started.
- **New Thread** in the left sidebar — starts a fresh empty thread.
- **Recent Threads** — the 10 most recent threads, shown directly under the main nav when the sidebar is expanded.
- The **Chat** tab inside any [session detail](run-history.md#session-detail) is a thread scoped to that one session.

## What you can reference in a thread

A thread can be grounded in:

- **One session** — start a thread from the Chat tab of a session, and the AI uses that session's outputs as context.
- **Multiple sessions** — pull in another session as a reference and the AI can compare across them ("how does this scan compare to last week's?").
- **Specific output files** — point the AI at a particular file in a session.
- **Saved artifacts** — reference an [artifact](artifacts.md) you've saved.
- **Nothing in particular** — a plain conversation about your work; useful for asking general questions or planning.

You can also upload a file directly into a thread for the AI to look at, even if it didn't come from a session.

## Thread groups

A **thread group** is a named collection of threads — useful for keeping related conversations together (for example, all the threads tied to a quarterly audit). Groups can be **pinned** so they stay visible at the top of the Threads list.

## What you can do here

- **Ask a question** about a session, a file, an artifact, or several of them at once.
- **Continue** an existing thread — threads are saved, so the AI sees the prior conversation.
- **Rename** a thread to something descriptive.
- **Group** related threads under a thread group.
- **Pin** an important group to keep it near the top.
- **Delete** a thread or a group when you no longer need it.

## Common questions

**"How do I ask a question about a session?"** — Open the session from [run history](run-history.md) and use the **Chat** tab — that opens a thread scoped to the session. Full walk-through: [ask about a session](../workflows/ask-about-a-session.md).

**"Can I ask the AI to compare two runs?"** — Yes. Open a thread, reference both sessions, and ask. The AI uses both sessions' outputs as context.

**"What's the difference between a thread and a chat?"** — They name the same conversation. "Thread" is the saved record (and the sidebar label). "Chat" is the live view inside the thread.

**"How do I organize many threads?"** — Use a [thread group](#thread-groups) to bundle related ones, and pin the group if it's important.

**"Where do I find a past thread?"** — Click **Threads** in the sidebar. The 10 most recent are also visible directly in the sidebar under **Recent Threads**.

**"What happens to a thread if I delete its session?"** — The thread remains; it just no longer has the session as context. Save outputs as [artifacts](artifacts.md) first if you want to keep them around for the thread to reference.

## Related

- [Sessions](sessions.md) — common subject of a thread.
- [Outputs](outputs.md) — files you can point a thread at.
- [Artifacts](artifacts.md) — saved files you can reference in a thread.
- [Ask about a session](../workflows/ask-about-a-session.md) — step-by-step.
