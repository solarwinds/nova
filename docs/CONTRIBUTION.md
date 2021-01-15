# Contributing to Nova

We are open to, and grateful for, any contributions made by the community. By contributing to Nova, you agree to abide by the [code of conduct](./CODE_OF_CONDUCT.md#contributor-covenant-code-of-conduct)

Here's what you need to know to get started:

## Instructions
1. Make sure to [create an Issue](https://github.com/solarwinds/nova/issues/new) for the contribution - we need a ticket to properly track your changes in order to announce what's changed between releases.
2. [Fork the repository](https://docs.github.com/en/free-pro-team@latest/github/getting-started-with-github/fork-a-repo)
3. Following the [Style Guide](./STYLE_GUIDE.md#style-guide), make the desired changes in the fork.
4. Make sure to test your code.
    a. Any changes/additions to business logic (i.e. code that does not involve DOM manipulations) should be thoroughly unit tested. We require 80% coverage at minimum.
    - components
    - services
    - filters/pipes

    b. Any changes/additions that involve DOM manipulation should be tested with e2e tests.

    c. Run all unit/e2e tests locally. For unit tests, use the command `npm run test`. And, for e2e tests, [here](./HOW_TO.md#e2e-testing) are some instructions for getting them up and running.

5. Once you're done with the implementation, create a PR to merge the changes back to the main branch of the base repository. Link any issues that are being fixed with this PR, then email the Nova Team at <nova-ui@solarwinds.com> with a link to the created PR. A build should automatically be triggered in CircleCI upon creating the PR.
6. Once the review is approved and all build checks have passed, we'll merge it back to the base repository.

### When Can I Consume My Changes?

At the moment, we release the Nova packages every 2 weeks to [NPM](https://www.npmjs.com/settings/nova-ui/packages), and your changes will be available in the very next release.
