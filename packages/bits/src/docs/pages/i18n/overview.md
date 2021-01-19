# Internationalization (i18n)

[Runtime-i18n-Example](../examples/#/runtime-i18n)

Currently, Nova supports static internationalization via the built-in Angular mechanisms, but we need to provide a solution for dynamic localization. We also need to provide Nova translations and find a way to keep them updated while maintaining a fast release cadence. This guide is intended to walk you through the process of configuring i18n in your application and managing dependency translations.

### Translating your app

Nova uses the standard Angular attributes for i18n:

`<nui-message type="info" i18n>Hello!</nui-message>`

[The official docs](https://angular.io/guide/i18n) are thorough, and should be used to learn how the attribute works. 

We recommend using @angular/localize for translating text into different languages.

### Creating translation files 

Template-based strings can be extracted to a `messages.xlf` file with the `ng extract-i18n` command. This command will also output translations for any libraries that have i18n in their templates, like Nova.

The extract-i18n command line tool will pull controller based translations out of you app, and add them to your existing `messages.xlf` file.

At this point, your app should have one file with a bunch of translations, and the Nova library. The Nova package includes .xlf files that it has extracted. This is shown below:

![Initial translation state](../assets/initial-translation-state.svg)