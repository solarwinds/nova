# Protractor to Playwright Migration Strategy

## Overview

This document outlines the strategy to migrate UI tests from **Protractor** to **Playwright** for the [SolarWinds NOVA](https://github.com/solarwinds/nova) Angular UI component library.

The main goals of the migration are:
- Minimize the time and effort involved.
- Preserve existing test coverage and reliability.
- Enable modern E2E testing capabilities.
- Integrate seamlessly with **CircleCI** for CI/CD workflows.

---

## 💡 Tip: use Copilot prompts to speed up migration

Copilot can help you convert repetitive Protractor patterns to Playwright and keep the team consistent.

A couple prompt ideas that work well:

- “Migrate this Protractor spec to Playwright. Keep the same assertions, but replace selectors with Nova **Atoms** where possible. Prefer `Atom.find` / `Atom.findIn` and Atom assertion helpers (e.g., `toBeVisible`, `toContainClass`). Don’t use fixed timeouts.”
- “Refactor this Playwright test to avoid raw `page.locator(...)` usage. Create or reuse an Atom so the test is framework-agnostic.”

If you’re migrating a file, it also helps to ask Copilot to do it in small steps:

1) rewrite navigation + setup
2) replace selectors
3) replace assertions
4) remove manual waits

---
## Why Playwright?

Below is a comparison of the leading modern E2E frameworks, evaluated against the criteria most relevant to migrating from Protractor in an Angular-based, component-driven library like NOVA.

| Feature / Tool                         | **Playwright**                                | **Cypress**                                    | **WebdriverIO (WDIO)**                        | **Nightwatch**                              |
| ------------------------------------- | --------------------------------------------- | ---------------------------------------------- | --------------------------------------------- | ------------------------------------------- |
| **Angular Compatibility**             | ✅ Excellent (async-friendly, stable selectors)| ⚠️ Good, but manual waits needed for stability | ⚠️ Needs plugins or manual waits              | ⚠️ Angular support improving, not native     |
| **Cross-Browser Support**             | ✅ Chromium, Firefox, WebKit                   | ⚠️ Chrome + limited Firefox, no WebKit         | ✅ Chromium, Firefox, Safari, IE via Selenium | ✅ Similar to WDIO (uses Selenium or DevTools)|
| **Parallel Test Execution**           | ✅ Native via workers                          | ✅ Built-in with Dashboard/paid CI              | ✅ Native support via CLI                      | ✅ Via Test Runner                           |
| **Test Stability & Auto-waiting**     | ✅ Excellent built-in waiting                  | ⚠️ Good, but flakiness with dynamic content     | ⚠️ Manual waits often required                 | ⚠️ Basic auto-wait; prone to flakiness       |
| **Headless Mode & CI Readiness**      | ✅ First-class support                         | ✅ Well supported                               | ✅ Strong via Selenium or native               | ✅ Basic CI support                          |
| **API Design & Developer Experience** | ✅ Modern, async/await, fast                   | ✅ Very developer-friendly                      | ⚠️ Verbose, but flexible                       | ⚠️ Older syntax, improving slowly            |
| **Migration Effort from Protractor**  | ✅ Easier (modern syntax, async, no Selenium) | ⚠️ Medium (some Protractor patterns break)     | ❌ Harder (Selenium-based, different mindset)  | ❌ Legacy-like; high boilerplate             |
| **Test Debugging Tools**              | ✅ Codegen, Trace Viewer, Inspector            | ✅ Excellent UI with time-travel debugging      | ⚠️ Limited tooling                            | ⚠️ Basic CLI logs                            |
| **Community & Maintenance**          | ✅ Backed by Microsoft, fast-growing           | ✅ Strong community, open-source                | ✅ Active, mature, slower-moving               | ⚠️ Smaller, older community                  |


---

## Migration Plan

### Phase 1: Preparation (DONE)

- ✅ Audit existing Protractor test cases and group by priority.
- ✅ Set up Playwright in the monorepo.
- ✅ Configure initial Playwright test suite for a single package (e.g. `common`).
- ✅ Add Playwright to **CircleCI** configuration for basic E2E validation.

### Phase 2: Pilot (DOING)

- 🔄 Rewrite a small set of core Protractor tests using Playwright:
    - Buttons
    - Links
    - Modals/Wizards
    - Table (Angular CDK integration)
- ✅ Validate that feature parity exists.
- ✅ Use Playwright Codegen (`npx playwright codegen`) to speed up test creation.
- ✅ Confirm test behavior across Chromium, Firefox, WebKit.

### Phase 3: Dual Operation

- ⚙️ Continue running Protractor alongside Playwright.
- 🔁 Gradually migrate all Protractor suites by priority.
- ✅ Ensure test stability before deprecating corresponding Protractor tests.
- 🔐 Migrate test utilities/helpers to Playwright-friendly utilities.

### Phase 5: Cleanup
- 🚫 Remove Protractor dependencies from package.json.
- 🧹 Clean up tsconfig and helper utilities no longer needed.
- 📘 Update documentation and developer onboarding guides.
