# Outputs

## What they are

**Outputs** are the files an [app](apps.md) produces during a [session](sessions.md). When the session finishes, every output is available on the **Files** tab of the [session detail](run-history.md#session-detail), organized into folders. You can read, download, save, pin, or ask questions about any of them.

Apps differ in what they produce, but most produce a mix of three things:

- A **[report](#reports)** — human-readable, designed for you to read.
- One or more **[data files](#data-files)** — structured machine-readable results.
- Optional **[dashboards](#dashboards)** — interactive views built from the data.

## Where to find them

Open a finished session from [run history](run-history.md) and click the **Files** tab. Outputs are grouped by folder and you can expand each folder to see its files.

## Reports

A **report** is the human-friendly summary of what the app found. Reports are usually:

- A markdown document you can read in the browser, or
- A PDF you can download and share.

The **Summary** tab on the [session detail](run-history.md#session-detail) page surfaces the key findings from the report — severity counts, top issues, and a short narrative — so you usually don't need to open the report file unless you want the full version.

## Data files

A **data file** is a structured result the app produced — usually JSON or CSV. Examples:

- The full list of resources an app scanned, with their properties.
- The raw findings before they were summarized into the report.
- A configuration snapshot used by the app.

Data files are useful when you want to pull results into a spreadsheet, feed them into another tool, or ask the AI a precise question about them in a [thread](threads.md).

## Dashboards

Some apps produce **dashboards** — interactive views with charts, tables, and filters built from the run's data. These render directly in the browser on the session detail page. They're distinct from the [Dashboards tab](dashboards.md) in the sidebar area, which is a separate feature for pinning outputs across sessions.

## Raw files

Anything else the app drops into its output folder — logs, intermediate files, screenshots, configs — shows up under the **Files** tab too. You can download them individually if you need them.

## What you can do with an output

- **Open** it in the browser (for reports and dashboards) or **download** it (for any file).
- **Save** it to an [artifact folder](artifacts.md) so you can find it again later — see [save an artifact](../workflows/save-an-artifact.md).
- **Pin** it to the [Dashboards tab](dashboards.md) for quick access.
- **Ask questions** about it in a [thread](threads.md) — see [ask about a session](../workflows/ask-about-a-session.md).
- **Delete** it if you don't need it.
- **Download everything as a zip** from the Files tab.

## Common questions

**"Where do my reports go?"** — They live with the session under the **Files** tab of [run history](run-history.md). The most important findings are summarized on the **Summary** tab.

**"Can I keep an output around after the session is old?"** — Yes — save it to an [artifact folder](artifacts.md). Artifacts persist independently and are easy to find.

**"How do I get an output into a spreadsheet?"** — Open the session, find the data file (usually CSV or JSON) on the **Files** tab, and download it.

**"What's the difference between a report and a dashboard?"** — A report is a written summary; a dashboard is an interactive view with charts and tables.

**"Are these the same as artifacts?"** — No. Outputs are produced by a session and live with it. [Artifacts](artifacts.md) are outputs you've explicitly saved into a folder. Every artifact starts as an output; not every output becomes an artifact.

## Related

- [Sessions](sessions.md) — outputs belong to a session.
- [Run History](run-history.md) — where you go to view outputs.
- [Artifacts](artifacts.md) — saving outputs for the long term.
- [Dashboards](dashboards.md) — pinning outputs for quick access.
- [Threads](threads.md) — asking questions about outputs.
