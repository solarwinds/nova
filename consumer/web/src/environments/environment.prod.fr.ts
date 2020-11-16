import { registerLocaleData } from "@angular/common";
import localeFr from "@angular/common/locales/fr";

import { environment as base_prod } from "./environment.prod";

registerLocaleData(localeFr);

declare const require: any;
export const translationLibrary = require(`raw-loader!../../dist/messages.fr.xlf`);

export const environment = {
    ...base_prod,
    locale: "fr",
};
