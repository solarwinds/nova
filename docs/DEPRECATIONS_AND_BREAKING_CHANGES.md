# Deprecations and Breaking Changes

Nova strives to be up-to-date with evolving technologies and implementation practices. Some concepts and implementations become outdated as time progresses, and better solutions arise.
This means some components, their methods, and sometimes entire modules get deprecated in favor of better solutions. Eventually, deprecated items get removed
in conjunction with Nova's major version increases, which typically correspond to major releases of Angular. We in Nova understand
how frustrating breaking changes can be for our consumers, so we've developed a strategy to introduce deprecations and breaking changes gradually
to ensure the smoothest possible transition between major Nova versions.

## Our Deprecation Procedure

1. API breaking changes can be expected in conjunction with a Nova major version increase. Read the release notes carefully to look for the deprecated items that are set for removal. See the [CHANGELOG.md](./CHANGELOG.md) for details;
2. Everything that has had a `@deprecated` decorator for a full major version will likely to be removed with the next major version increase. This will be also reflected in a migration guide.
3. If a deprecated entity has been in this status for less than a full major version, it will be carried over into the next major version, and it will be removed in the one after it.

## Steps for Introducing a Deprecation

1. Create a new [breaking change](https://github.com/solarwinds/nova/issues/new?assignees=&labels=&template=breaking_change_task.md&title=) ticket in github and fill in all the required information.
2. Inside a jsdoc style comment above the deprecated item

   - Use the `@deprecated` tag
   - State the major version in which the deprecation occurred
   - Include the recommended non-deprecated replacement that consumers can use instead
   - Include the github id for the ticket you just created
   - If the entity being deprecated is a component or directive, add a console log warning about the deprecation in the entity's constructor along with the recommended alternative

   Example of jsdoc comment:

   ```typescript
   /* @deprecated As of Nova v11, use 'toggle' method instead. Removal: GH-1 */
   ```
