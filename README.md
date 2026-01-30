# Nova Nui Framework

The Nova Nui Framework provides a set of common UI-based components and services to assist with rapid web application development. Nui is built on the latest Angular and follows modern UX design principles and front-end software development practices.

## Style Guide

The Nova UI coding Style Guide can be found [here](./docs/STYLE_GUIDE.md#style-guide).

## Project Structure

Nova UI consists of three packages within a single monorepo:

-   [Bits](./packages/bits/README.md#bits-overview) - A set of atomic components to be used as building blocks for applications and more complex
    components. Exception - **convenience components** - prototypes of composite components, that are meant to accommodate a wide breadth of use cases.
-   [Charts](./packages/charts/README.md#charts-overview) - A visualization library built on top of [d3](https://d3js.org/).
-   [Dashboards](./packages/dashboards/README.md#dashboards-overview) - A framework designed to provide developers a solution for presenting data coming from various sources within a single view.

## Contributions

We encourage [contributions to Nova](./docs/CONTRIBUTION.md#contributing-to-nova) whenever your team needs a new component, new functionality in an existing component, new icons, bug fixes or atom extensions.

## Need help?

### If You're Just Getting Started...

For package-specific
information about getting started with development, please visit the corresponding README for each of the Nova UI packages:
[Bits](./packages/bits/README.md#bits-overview), [Charts](./packages/charts/README.md#charts-overview), and [Dashboards](./packages/dashboards/README.md#dashboards-overview).

For additional instructions about Nova development in general, take a look at our [How To](./docs/HOW_TO.md#how-to) page.

### If You Have a Question...

Please check out our [FAQ](./docs/FAQ.md#faq). If you don't find the answer to your question there, feel free
to send us an email at <nova-ui@solarwinds.com>. We kindly ask that you try to avoid opening GitHub
issues for general support questions as we'd like to reserve that communications channel for bug reports
and feature requests.

## Found a bug? Have an idea for a feature?

Please let us know! But...before submitting a feature request or issue report, please make sure it hasn't already been reported on our [issues page](https://github.com/solarwinds/nova/issues). If you can't find an existing issue corresponding to your feedback, please create one using the GitHub [issue portal](https://github.com/solarwinds/nova/issues/new/choose).

## Troubleshooting

Find tips for solving some common development environment problems [here](./docs/TROUBLESHOOTING.md#troubleshooting).

## End-to-End (E2E) Testing with Playwright

Nova supports modern E2E testing using [Playwright](https://playwright.dev/). Playwright is recommended for new E2E tests, while Protractor is retained for legacy support.

### 📖 Playwright E2E Documentation
- **Accessibility (a11y) Testing:** See [`docs/E2E/A11Y.md`](./docs/E2E/A11Y.md) for setup, running, and writing accessibility tests with Playwright and axe-core.
- **Project Structure:** See [`docs/E2E/STRUCTURE.md`](./docs/E2E/STRUCTURE.md) for E2E folder and config organization, including Playwright config location.

#### More E2E Docs
- Additional E2E topics: [docs/E2E/](./docs/E2E/)
- Legacy Protractor info: see below and in [HOW_TO.md](./docs/HOW_TO.md#e2e-testing)
