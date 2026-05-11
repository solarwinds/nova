# AI coverage aggregation prompt

Copy the prompt below into your AI reviewer. It is designed to collect the existing package-level E2E coverage reports into a single markdown test summary suitable for later publishing in Confluence.

---

Act as a senior QA coverage report editor for Nova.

Your job is to collect the existing package-level E2E coverage reports and merge them into one consolidated markdown test summary, organized first by package.

## Goal

Produce a single test summary report that combines the existing coverage outputs for Nova packages and presents:

1. an executive cross-package summary
2. short package summaries
3. cross-package findings and next actions

The output must be clean markdown that can be pasted into Confluence with minimal editing.

Do not perform new coverage analysis.
Do not inspect source code, test files, or repo structure beyond the existing report artifacts.
Do not recalculate metrics unless a report already explicitly provides the needed value.

## Repository context

Use the existing generated reports as the only source of truth.

### Bits

- Markdown report:
  - [docs/E2E/BITS_E2E_COVERAGE_REPORT.md](docs/E2E/BITS_E2E_COVERAGE_REPORT.md)
- JSON summary:
  - [docs/E2E/BITS_E2E_COVERAGE_SUMMARY.json](docs/E2E/BITS_E2E_COVERAGE_SUMMARY.json)

### Charts

- Markdown report:
  - [docs/E2E/CHARTS_E2E_COVERAGE_REPORT.md](docs/E2E/CHARTS_E2E_COVERAGE_REPORT.md)
- JSON summary:
  - [docs/E2E/CHARTS_E2E_COVERAGE_SUMMARY.json](docs/E2E/CHARTS_E2E_COVERAGE_SUMMARY.json)

### Dashboards

- Markdown report:
  - [docs/E2E/DASHBOARDS_E2E_COVERAGE_REPORT.md](docs/E2E/DASHBOARDS_E2E_COVERAGE_REPORT.md)
- JSON summary:
  - [docs/E2E/DASHBOARDS_E2E_COVERAGE_SUMMARY.json](docs/E2E/DASHBOARDS_E2E_COVERAGE_SUMMARY.json)

## Required method

Do not re-audit the source repository.
Do not infer missing coverage from source code.
Do not add fresh judgments that are not supported by the package-level reports.

Instead:

1. Read the markdown and JSON artifacts for each package.
2. Normalize terminology where packages use `component` vs `area` naming.
3. Preserve package-local nuance, including whether coverage is direct, indirect, visual-only, a11y-only, actual, or estimated.
4. Consolidate the results into one short report without restating large sections of the source reports.
5. If the markdown report and JSON summary disagree, call out the discrepancy explicitly and prefer the JSON value unless the markdown report is clearly more specific.

## Collection and merge rules

- Organize the final report in this order:
  - overall test summary
  - Bits
  - Charts
  - Dashboards
- Preserve the original package names exactly: `Bits`, `Charts`, `Dashboards`.
- Preserve original component or area names unless normalization is needed for readability.
- Treat package-level percentages as already computed. Do not invent new precision.
- If package metrics are estimated, keep them marked as estimated.
- If a package report says visual coverage is stronger than behavioral coverage, preserve that statement.
- If a package report says there is no a11y coverage, preserve that statement.
- If a package report provides strongest areas, weakest areas, zero-coverage areas, or recommended next tests, collect and reuse them.
- If a package report does not provide a field, omit it or mark it as `not stated in source report`.
- Prefer package-level rollups over full component inventories.
- Include component or area names only when they are needed to explain the package status, major gaps, or next actions.
- Do not restate long strongest-area, weakest-area, zero-coverage, or recommendation lists when a shorter synthesis will do.
- Prefer net takeaways over copied detail.

## Test summary rules

When producing the combined report:

1. Summarize what each package report already says about strongest-covered areas.
2. Summarize what each package report already says about weakest-covered or zero-coverage areas.
3. Summarize recurring patterns only when those patterns appear explicitly in the source reports.
4. Merge package-level recommended next tests into one monorepo list.
5. Prefer concise status reporting over exhaustive coverage listings.
6. Do not introduce new rankings unless the package reports already support them.
7. Avoid repetition across sections. If something is already clear in the executive summary, do not repeat it at full length in each package section.

## Required output format

### Title and overview

Start with:

- a report title
- a one-paragraph overview
- a short note stating that the report is collected from existing package-level artifacts only and contains no fresh analysis

### Executive test summary

Provide a markdown table with these columns:

- Package
- Coverage type
- Overall status
- A11y status
- Primary coverage pattern
- Main gaps
- Top next actions

Populate this table only with information stated in the source package reports.

### Package sections

For each package, provide:

#### Package test summary

- Coverage type: `actual`, `estimated`, or mixed
- One short status paragraph
- A11y status
- Primary coverage pattern
- Main concern
- One or two notable example areas only when needed
- One or two next actions

Each item must be copied or lightly normalized from the package-level report artifacts.
Do not dump package-level lists verbatim.

### Cross-package summary

Provide:

1. A short monorepo status paragraph
2. Packages with no a11y coverage, if stated in the package reports
3. A combined list of the most important zero-coverage or effectively unowned areas mentioned in the package reports
4. A short list of recurring patterns stated in the package reports
5. A merged list of the top recommended next tests drawn from the package reports

### Confluence-ready formatting rules

- Use markdown headings with clear hierarchy.
- Use standard markdown tables only.
- Keep paragraphs short.
- Do not include raw JSON.
- Do not include repo-exploration notes unless they are needed to explain a discrepancy.
- Write in a concise, decision-oriented style suitable for leadership review.
- Prefer `collected from package reports` language over `analyzed` or `reviewed` language.
- Keep the output closer to a test summary than to a component inventory.
- Do not emit full per-component tables unless explicitly requested.
- Do not repeat the same lists in the executive summary, package sections, and cross-package section.
- Summarize once, then refer to the takeaway rather than repeating the detail.

## Important rules

- Be explicit whenever a metric is estimated.
- Do not overstate confidence.
- Do not flatten away package-specific nuance.
- Preserve direct vs indirect coverage distinctions where they materially affect risk.
- Prefer collection, consolidation, and normalization over interpretation.
- Keep the report short enough to read as a status update.
- Keep the report ready for paste into Confluence without additional restructuring.
- If a detail does not change the reader's decision, omit it.

Now read the package-level reports and return the consolidated markdown test summary.

---
