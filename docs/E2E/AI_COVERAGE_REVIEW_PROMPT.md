# AI coverage review prompt

Copy the prompt below into your AI reviewer. It is designed to produce the final coverage report directly.

---

Act as a senior QA coverage analyst for Nova Bits.

Your job is to produce a complete E2E coverage report for the Bits package, using the repository contents directly.

## Goal

Analyze E2E coverage for each public component in Bits and produce:

1. an executive summary table
2. a per-component report
3. final findings and recommendations

Where possible, report real line/branch coverage. If true instrumentation is not available, provide conservative **estimated** line and branch coverage based on source-to-test mapping.

## Repository context

- Public API scope is defined primarily by:
  - [packages/bits/src/public_api.ts](packages/bits/src/public_api.ts)
  - [packages/bits/src/lib/public-api.ts](packages/bits/src/lib/public-api.ts)
- E2E tests live under [packages/bits/e2e](packages/bits/e2e)
- Playwright projects are defined in [playwright.config.base.ts](playwright.config.base.ts):
  - `e2e`
  - `a11y`
  - `visual`
- E2E tests are atom-based. Use:
  - [docs/E2E/STRUCTURE.md](docs/E2E/STRUCTURE.md)
  - [docs/E2E/README.md](docs/E2E/README.md)
- Atoms exported for Playwright live in:
  - [packages/bits/e2e/components/public_api.ts](packages/bits/e2e/components/public_api.ts)
- If available, use the generated inventory as a starting point:
  - [packages/bits/test-results/e2e-coverage-ai/inventory.json](packages/bits/test-results/e2e-coverage-ai/inventory.json)

## Required method

Do not stop at folder matching.

For each public component or public component area:

1. Build the canonical mapping of:
   - public exports
   - source implementation files
   - E2E spec files
   - a11y spec files
   - visual spec files
   - atom files
2. Read the source and identify meaningful behaviors and branches, including where applicable:
   - default state
   - style and size variants
   - disabled/busy/loading/empty/error states
   - keyboard interaction paths
   - mouse interaction paths
   - emitted events
   - conditional rendering
   - content projection
   - accessibility behavior
   - visual-state behavior
3. Read the tests and determine which behaviors are actually covered.
4. Classify coverage as:
   - `no E2E coverage`
   - `partial E2E coverage`
   - `broad E2E coverage`
5. Calculate coverage:
   - If instrumented data exists, report `actual` line and branch coverage.
   - Otherwise report `estimated` line and branch coverage.

## Coverage estimation rules

If estimation is required, use:

- estimated line coverage % = tested meaningful behaviors / total meaningful behaviors × 100
- estimated branch coverage % = tested identified branches / total identified branches × 100

Be conservative.

If confidence is weak, say so.

## Scope rules

- Exclude purely internal helpers, demo-only files, and docs-only components unless they are part of the public Bits API.
- If a public area contains multiple subcomponents, roll up the parent area and call out notable gaps in important subcomponents.
- Call out naming mismatches explicitly, for example:
  - `date-picker` vs `datepicker`
  - `date-time-picker` vs `datetimepicker`
  - `time-picker` vs `timepicker`
  - `radio` vs `radio-group`
  - `tabgroup` vs `tab-heading-group`
  - `dnd` / `dragdrop` vs `drag-and-drop`

## Required output format

### Executive summary

Provide a markdown table with these columns:

- Component
- E2E specs
- A11y specs
- Visual specs
- Line coverage %
- Branch coverage %
- Confidence
- Status
- Main gap

### Per-component reports

For each component, provide:

- Component name
- Source files reviewed
- Tests found
- Covered behaviors
- Uncovered or weakly covered behaviors
- Line coverage: `X%` (`actual` or `estimated`)
- Branch coverage: `Y%` (`actual` or `estimated`)
- Confidence: `high`, `medium`, or `low`
- One-sentence risk summary

### Final findings

Provide:

1. Top 10 weakest-covered components
2. Components with zero E2E coverage
3. Components that have only `a11y` or only `visual` coverage but weak functional coverage
4. Recommended next tests to add, ranked by impact

## Important rules

- Be explicit whenever a percentage is estimated.
- Prefer accuracy over optimism.
- Validate coverage against source logic, not just folder names.
- If visual coverage is strong but behavioral coverage is weak, say so clearly.
- If coverage cannot be quantified precisely, give a bounded conservative estimate and explain why.
- If the public API and E2E inventory disagree, call it out explicitly.

Now analyze the repository and return the report.

---
