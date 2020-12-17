# Internationalization (i18n)

[Runtime i18n Example](./internationalization-(i18n)/runtime-i18n-example.html)

Currently, Nova supports static internationalization via the built-in Angular mechanisms, but we need to provide a solution for dynamic localization. We also need to provide Nova translations and find a way to keep them updated while maintaining a fast release cadence. We’ll be focusing on this in Q4 2019 and Q1 2020. This guide is intended to walk you through the process of configuring i18n in your application and managing dependency translations.

### Translating your app

Nova uses the standard Angular attributes for i18n:

`<nui-message type="info" i18n>Hello!</nui-message>`

[The official docs](https://angular.io/guide/i18n) are thorough, and should be used to learn how the attribute works. 

As of Angular 8, code translations are not possible with google-only tools. The solution recommended by the community is [ngx-translate/i18n-polyfill](https://github.com/ngx-translate/i18n-polyfill), written by a former Google contractor on the Angular team. This polyfill is used inside Nova for controller-based translation.

### Creating translation files 

Template-based strings can be extracted to a `messages.xlf` file with the `ng xi18n` command. This command will also output translations for any libraries that have i18n in their templates, like Nova.

The ngx-extractor command line tool will pull controller based translations out of you app, and add them to your existing `messages.xlf` file. The [official instructions](https://github.com/ngx-translate/i18n-polyfill#extraction) show you how to do this. Note that this tool will NOT pick up items in libraries, unlike the template based tool. 

At this point, your app should have one file with a bunch of translations, and the Nova library. The Nova package includes .xlf files that it has extracted. This is shown below:

![Initial translation state](../assets/initial-translation-state.svg)

### Filtering out Nova translations

> This step is optional. You don't have to screen out Nova translations. However, you will have to re-translate Nova strings with your product.
 
Since you have one `messages.xlf` that contains most of your strings AND Nova template strings, you need to screen them out. There is a great in-house tool for this, [xliff-filter](https://bitbucket.solarwinds.com/projects/MSP-PE/repos/xliff-tools/browse). Running this tool will pull out all the Nova strings, leaving just your app's strings. Be aware that xliff-filter has to be run before ngx-extractor.
You may want to add a similar script to your `package.json`:
```
"generate-local-xliff": "ng xi18n && xliff-filter --config xliff-tools-filter.json && ngx-extractor -i src/**/*.ts -f xlf -o .tmp/messages.xlf",
```

### Creating copies of different languages

At this point, you have a single `messages.xlf` file that ONLY contains your app's strings. You could probably just take this file, translate it, and then pull it into your app. However, when you have to release version 2 of your app, it will get confusing what new things need to be translated, and what doesn't.

To prevent losing these already-translated strings, there are tools to alleviate this. [Xliff-tools](https://bitbucket.solarwinds.com/projects/MSP-PE/repos/xliff-tools/browse) has one called xliff-update. However, this tool has difficulties parsing some xml files. There is also a 3rd party tool, [xliff-merge](https://github.com/martinroob/ngx-i18nsupport) that does the same thing, which may be able to parse more files.
Both these tools function like this:
- Parse original `messages.xlf`
- Open language specific xlf files (like `messages.fr.xlf`)
- Determine (based on ID) which strings are in in the original file, but NOT in the language specific file
- Copy entry to language specific file

![Modified translation state](../assets/modified-translation-state.svg)

### Okay, so I have all these translation files, now what?

You'll first need to combine Nova translation files and your app translation files into one big file. There is another tool in xliff-tools for this, called xliff-concat. It will combine 2 xliff files into one. You also need to get those files into your app. [Angular has a guide how to do this](https://angular.io/guide/i18n#merge-the-completed-translation-file-into-the-app). You'll notice the first thing that Angular mentions is AoT vs JIT.  AoT is a much faster technology, but it does have a big drawback - all the templates that it uses are precompiled. This means that you have to recompile your app once for EACH language you support. You will also have to deploy the same number of apps.

Once you have decided on JIT vs, AoT, you'll need to load the translations into the app.  A convienient way to do this is via angular CLI and it's "environment" pattern.

In your `angular.json`:
```
"fileReplacements": [
  {
    "replace": "src/environments/environment.ts",
    "with": "src/environments/environment.prod.ts"
  }
```

`environment.prod.fr.ts`:

```
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
 
registerLocaleData(localeFr);
 
declare const require: any;
export const translationLibrary = require(`raw-loader!../../dist/messages.fr.xlf`);
```

`app.module.ts`:
```
providers: [
    ...
    {provide: TRANSLATIONS_FORMAT, useValue: "xlf"},
    {provide: MISSING_TRANSLATION_STRATEGY, useValue: MissingTranslationStrategy.Warning},
    // {provide: LOCALE_ID, useValue: "fr" }, // needed if using JIT compiler
    {provide: TRANSLATIONS, useValue: translationLibrary}
    ...
],
```
Note that TRANSLATIONS_FORMAT and TRANSLATIONS providers must be declared. However, if you are not interested in i18n, you can set TRANSLATIONS to an empty string.  Example

## FAQ

__Why don't you just use [gettext](https://bitbucket.solarwinds.com/projects/APOLLO/repos/i18n-gettext/browse)?__

Gettext is a custom solution written for NovaJS. It has similar features to the built in Angular i18n. However, it has drawbacks - it breaks standard $translate interpolation, it is a custom solution, etc. However, the biggest factor is that Angular i18n hooks easily into Angular CLI, which allows easy, seamless testing with AoT.

__With AoT, do I really have to recompile once for each language? Seriously?__

Yes. This may change with the adoption of Angular's new renderer, Ivy. 

__If I don't do controller translation, do I need the polyfill library?__

Yes, Nova uses this library for some of its logic.

__Why is this so complicated?__

At google, all translation is done in templates, and the most important thing is speed. So, they do not need controller-based translation, and the overhead of deploying one application per language is a good trade off.
