# Contributing to Nova

We are open to, and grateful for, any contributions made by the community. By contributing to Nova, you agree to abide by the [code of conduct](./CODE_OF_CONDUCT.md)

Here's what you need to know to get started:

## Instructions
1. Make sure to create a Issue ticket for the contribution - we need a ticket to properly track your changes in order to announce what's changed between releases.
2. Branch to a feature branch from the appropriate source branch
   a. The prefix for the branch name should be the issuekey and description (i.e. NUI-1111-update-fileUpload-styles, or issue_36-fixing-screen-flickering).
3. Make your changes. Follow the [Style Guide](./README.md/#StyleGuide).
4. Make sure to [test your code](./README.md#Testing)
    a. Any changes/additions to business logic (i.e. code that does not involve DOM manipulations) should be thoroughly unit tested. We require 80% coverage at minimum.
    - components/controllers
    - services
    - filters/pipes

    b. Any changes/additions that involve DOM manipulation should be ui/e2e tested.
    c. Run all automation. Either:
    - Run all unit/e2e tests locally
    - Push changes to origin

5. Once you're done with the implementation, create a PR to merge the changes into main. Link any issues that are being fixed with this PR, then email the Nova Team at <nova-ui@solarwinds.com> with a link to the created PR. A build should automatically be triggered in CircleCI upon creating the PR.
6. Once the review is approved, merge back to the appropriate source branch.
7. For non-hotfixes - we QA from main to ensure we catch integration issues.
    a. Keep an eye on the result of the main build and make sure to fix any failures
    b. Nova teams will QA your work unless you tell us otherwise.

### When Can I Consume My Changes?

At the moment, we release the Nova packages every 2 weeks to Artifactory - and your changes will be available in the very next release.
