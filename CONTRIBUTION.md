# Contributing to Nova

We are open to, and grateful for, any contributions made by the community. By contributing to Nova, you agree to abide by the [code of conduct](./CODE_OF_CONDUCT.md)

Here's what you need to know to get started:

## Instructions

    // 💬 CONTRIBUTION.md: 9# -> Where are we tracking tickets?

1. Make sure to create a NUI JIRA ticket for the contribution - we need a NUI ticket to properly track your changes in order to announce what's changed between releases.
2. Branch to a feature branch from the appropriate source branch
   a. The prefix for the branch name should be the JIRA issuekey (i.e. NUI-1111-update-fileUpload-styles). Note that without this naming convention, fisheye integration (for bitbucket-JIRA) won't work
3. Make your changes
4. Make sure to [test your code](./README.md#StyleGuide)

    a. Any changes/additions to business logic (i.e. code that does not involve DOM manipulations) should be thoroughly unit tested. We require 80% coverage at minimum.

    - components/controllers
    - services
    - filters/pipes

    b. Any changes/additions that involve DOM manipulation should be ui/e2e tested.

    c. Run all automation. Either:

    - Run all unit/e2e tests locally
    - Push changes to origin
      // 💬 CONTRIBUTION.md: 24# -> Where will they reach us??

5. Once you're done with the implementation, create a PR and update any tickets that are related to this change with the PR link. A build should automatically be triggered in CircleCI upon creating the PR.
6. Once the review is approved, merge back to the appropriate source branch.
7. For non-hotfixes - we QA from main to ensure we catch integration issues.

    a. Keep an eye on the result of the main build and make sure to fix any failures

    b. Nova teams will QA your work unless you tell us otherwise.
    // 💬 CONTRIBUTION.md: 32# -> JIRA??

8. Set the JIRA ticket to Ready For Verification

### When Can I Consume My Changes?

At the moment, we release both Nova and NovaJS packages every 2 weeks to Artifactory - and your changes will be available in the very next release.
