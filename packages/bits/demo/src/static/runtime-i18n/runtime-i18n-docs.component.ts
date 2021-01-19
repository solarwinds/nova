import { Component } from "@angular/core";

@Component({
    selector: "nui-runtime-i18n-docs",
    templateUrl: "runtime-i18n-docs.component.html",
})

export class RuntimeI18NDocsExampleComponent {
    public code: any;
    constructor() {
        this.code = getSnippets();
    }
}

function getSnippets () {
    return {
        polyfillImport1:
`/**
* This method is used to dynamically load translations
*/
import { loadTranslations } from "@angular/localize";`,
        polyfillImport2:
`/**
* $localize angular polyfill
*/
import "@angular/localize/init";`,
        polyfillTranslations:
`const locales: Record<string, Record<string, string>> = {
    "fr": {
        "6542015780053525788": "Salutations!",
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
    "de": {
        // german translations using same IDs
    },
    "es": {
        // spanish translations using same IDs
    },
};
`,
        handleTranslations:
`if (localStorage.length && localStorage.getItem("locale")) {
    loadTranslations(locales[localStorage.getItem("locale")]);
}`,
    };
}

