# Deprecations and Breaking Changes

Nova strives to be up-to-date with evolving technologies and implementation practices. Some concepts and implementations become outdated as time progresses, and better solutions arise. 
This means some components, their methods, and sometimes entire modules get deprecated in favor of better solutions. Eventually, deprecated items get removed 
during Nova's major version bumps, which usually happen in sync with the major releases of Angular. We in Nova understand 
how frustrating breaking changes can be for our consumers, so we've developed a strategy to introduce deprecations and breaking changes gradually
to ensure the smoothest possible transition between major Nova versions.
## Our Deprecation Procedure
1. Breaking changes are usually expected during the Nova major version bump. Read the release notes carefully to look for the deprecated items, which are set for removal. See the [CHANGELOG.md](./CHANGELOG.md) for details;
2. Breaking changes are typically committed into a separate branch named 'next', which then gets merged into the main one during the major version upgrade procedure.
3. Everything that has had a deprecated decorator for longer than 12 months will likely to be removed with the next major version bump. This will be also reflected in a migration guide
4. If the deprecated entity has been in this status for less than 12 months it can slip into the next major update, and will be removed in the one after it
