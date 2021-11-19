/**
 * This file includes polyfills needed by Angular and is loaded before the app.
 * You can add your own extra polyfills to this file.
 *
 * This file is divided into 2 sections:
 *   1. Browser polyfills. These are applied before loading ZoneJS and are sorted by browsers.
 *   2. Application imports. Files imported after ZoneJS that should be loaded before your main
 *      file.
 *
 * The current setup is for so-called "evergreen" browsers; the last versions of browsers that
 * automatically update themselves. This includes Safari >= 10, Chrome >= 55 (including Opera),
 * Edge >= 13 on the desktop, and iOS 10 and Chrome on mobile.
 *
 * Learn more in https://angular.io/docs/ts/latest/guide/browser-support.html
 */

/***************************************************************************************************
 * BROWSER POLYFILLS
 */
/**
 * $localize angular polyfill
 */
import "@angular/localize/init";
/** Evergreen browsers require these. **/
// Used for reflect-metadata in JIT. If you use AOT (and only Angular decorators), you can remove.
// eslint-disable-next-line
import "core-js/es7/reflect";


/**
 * Required to support Web Animations `@angular/platform-browser/animations`.
 * Needed for: All but Chrome, Firefox and Opera. http://caniuse.com/#feat=web-animation
 **/
// import 'web-animations-js';  // Run `npm install --save web-animations-js`.

/**
 * By default, zone.js will patch all possible macroTask and DomEvents
 * user can disable parts of macroTask/DomEvents patch by setting following flags
 */

// (window as any).__Zone_disable_requestAnimationFrame = true; // disable patch requestAnimationFrame
// (window as any).__Zone_disable_on_property = true; // disable patch onProperty such as onclick
// (window as any).__zone_symbol__BLACK_LISTED_EVENTS = ['scroll', 'mousemove']; // disable patch specified eventNames


/***************************************************************************************************
 * Zone JS is required by default for Angular itself.
 */
// tslint:disable-next-line:ordered-imports
import "zone.js";  // Included with Angular CLI.



/***************************************************************************************************
 * APPLICATION IMPORTS
 */

import { loadTranslations } from "@angular/localize";

const locales: Record<string, Record<string, string>> = {
    "fr": {
        "8885234477142162752": "Salutations!",
        "5181440621801685681": "Il s'agit d'un texte aléatoire écrit pour montrer que les traductions d'exécution fonctionnent réellement. Chaque ligne de cet exemple sera traduite à l'aide de Google Translator.",
        "6028371114637047813": "Prénom",
        "3967269098753656610": "Adresse électronique",
        "935187492052582731": "Soumettre",
        "665199437400610045": "Entrez votre prénom s'il vous plait",
        "7484692620446298558": "Nom de famille",
        "1733240001129506538": "Veuillez entrer votre deuxième nom",
        "8114342674308277164": "S'il vous plaît, mettez une adresse email valide",
        "5878305334612867800": "(optionnel)",
    },
    "es": {
        "8885234477142162752": "Saludos!",
        "5181440621801685681": "Es un texto aleatorio escrito para mostrar que las traducciones en tiempo de ejecución realmente funcionan. Cada línea en este ejemplo será traducida usando Google Translator.",
        "6028371114637047813": "Primer nombre",
        "3967269098753656610": "Dirección de correo electrónico",
        "935187492052582731": "Enviar",
        "665199437400610045": "Ingrese su nombre por favor",
        "7484692620446298558": "Apellido",
        "1733240001129506538": "Por favor ingrese su segundo nombre",
        "8114342674308277164": "Por favor ponga una dirección de correo electrónico válida",
        "5878305334612867800": "(opcional)",
    },
    "de": {
        "8885234477142162752": "Schöne Grüße!",
        "5181440621801685681": "Dies ist ein zufälliger Text, der zeigt, dass Laufzeitübersetzungen tatsächlich funktionieren. In diesem Beispiel wird jede einzelne Zeile mit Google Translator übersetzt.",
        "6028371114637047813": "Vorname",
        "3967269098753656610": "E-Mail-Addresse",
        "935187492052582731": "Einreichen",
        "665199437400610045": "Bitte geben Sie Ihren Vornamen ein",
        "7484692620446298558": "Zweitname",
        "1733240001129506538": "Bitte geben Sie Ihren zweiten Namen ein",
        "8114342674308277164": "Bitte geben Sie eine gültige E-Mail-Adresse ein",
        "5878305334612867800": "(freiwillig)",
    },
};

const locale: string | null = localStorage.getItem("locale");
if (localStorage.length && locale) {
    loadTranslations(locales[locale]);
}
