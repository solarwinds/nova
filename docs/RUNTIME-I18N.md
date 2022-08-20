# Internationalization (i18n)

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

![Initial translation state](https://github.com/solarwinds/nova/blob/main/packages/bits/src/docs/assets/initial-translation-state.svg)

### Runtime i18n example

The example can be found [here](https://nova-ui.solarwinds.io/bits/release_v12.x/examples/#/runtime-i18n)

This example shows how to achieve the runtime localization in Angular 9 using **$localize** and **localStorage**.

Angular 9 comes with the new **@angular/localize** package which delivers a number of i18n features. The **$localize** global variable is one of them, and comes as a subsitution for the widely used [ngx-translate/i18n-polyfill](https://github.com/ngx-translate/i18n-polyfill). It's main purpose is to be used for the runtime translations. According to the [article](https://blog.ninja-squad.com/2019/12/10/angular-localize/), the $localize feature is still undocumented officially, but already does a great job.

The example below was achieved by following the next steps:

Run the **ng add @angular/localize** schematic. Verify that the polyfill.ts file was properly updated

```js
/**
 * $localize angular polyfill
 */
import "@angular/localize/init";
```

Modify your **polyfills.ts** file with necessary imports

```js
/**
 * $localize angular polyfill
 */
import "@angular/localize/init";
```

Prepare your translations. If you have .xlf files, you may want to convert them to .json format, which would consist of the translation IDs as keys and the corresponding translations as values. This is exactly what the **localTranslations** method accepts as a parameter. Load the converted .json files into appropriate variables in the same place - **polyfills.ts** file.

For now you can use [**@locl/cli**](https://www.npmjs.com/package/@locl/cli) for converting .xlf files to .json. The .json format is the most optimized in term of size and supported by existing loaders for lazy loading translations.

**_NOTE: for the sake of example we have the translations already set to variables explicitly_**

```js
const locales: Record<string, Record<string, string>> = {
    fr: {
        "8885234477142162752": "Salutations!",
        "5181440621801685681":
            "Il s'agit d'un texte aléatoire écrit pour montrer que les traductions d'exécution fonctionnent réellement. Chaque ligne de cet exemple sera traduite à l'aide de Google Translator.",
        "6028371114637047813": "Prénom",
        "3967269098753656610": "Adresse électronique",
        "935187492052582731": "Soumettre",
        "665199437400610045": "Entrez votre prénom s'il vous plait",
        "7484692620446298558": "Nom de famille",
        "1733240001129506538": "Veuillez entrer votre deuxième nom",
        "8114342674308277164":
            "S'il vous plaît, mettez une adresse email valide",
        "5878305334612867800": "(optionnel)",
    },
    de: {
        // german translations using same IDs
    },
    es: {
        // spanish translations using same IDs
    },
};
```

In the same file add logic to handle runtime translations load. There is no official way how to do it, so feel free to implement it your way. In current example the **localStorage** was used. The algorithm is following:

1. On the view let user select the desired language
2. On selection, save the chosen locale to local storage
3. Reload the page programmatically. This will restart the application and load polyfills.ts once again
4. In polyfills.ts add logic that handles the data stored in local storage and loads the correct translations depending on that data

```js
if (localStorage.length && localStorage.getItem("locale")) {
    loadTranslations(locales[localStorage.getItem("locale")]);
}
```
