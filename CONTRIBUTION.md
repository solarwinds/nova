# Contributing to Nova
We encourage developers to contribute to Nova. Here's what you need to know to get started:

  ## Instructions
  1. Make sure to create a NUI JIRA ticket for the contribution - we need a NUI ticket to properly track your changes in order to announce what's changed between releases.
  2. Branch to a feature branch from the appropriate source branch

      a. The prefix for the branch name should be the JIRA issuekey (i.e. NUI-1111-update-fileUpload-styles). Note that without this naming convention, fisheye integration (for bitbucket-JIRA) won't work
  3. Make your changes
  4. Make sure to test your

      a. Any changes/additions to business logic (i.e. code that does not involve DOM manipulations) should be thoroughly unit tested. We require 80% coverage at minimum.
        * components/controllers
        * services
        * filters/pipes
        
      b. Any changes/additions that involve DOM manipulation should be ui/e2e tested.
      
      c. Run all automation. Either:
        * Run all unit/e2e tests locally
        * Push changes to origin and make sure your Team City feature branch build is green
  5. Once you're done with the implementation, create a PR and provide a link to it in the SWI - Nova channel in Teams.
  6. Once the review is approved, merge back to the  appropriate source branch.
  7. For non-hotfixes - we QA from develop to ensure we catch integration issues.

      a. Keep an eye on the result of the develop build and make sure to fix any failures

      b. Nova teams will QA your work unless you tell us otherwise.
  8. Set the JIRA ticket to Ready For Verification

  ### When Can I Consume My Changes?
  At the moment, we release both Nova and NovaJS packages every 2 weeks to Artifactory - and your changes will be available in the very next release. Note that we're working toward more frequent releases. The first step is to get to once a week. The second step is to provide an automated mechanism for on-demand releases. Once we have that (we hope by the end of Q1 2019), you'll be able to consume your changes immediately.

  Hotfixes are an exception to our normal release cadence. If you need to apply a hotfix quickly, contact Tillery, Shannon or one of the Nova team leads and we'll work with you to make it available as soon as possible.
  