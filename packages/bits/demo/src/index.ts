import { TRANSLATIONS, TRANSLATIONS_FORMAT } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { translationLibrary } from "./environments/environment";
import { NuiDemoModule } from "./module";

void platformBrowserDynamic().bootstrapModule(NuiDemoModule, {
    providers: [
        // needed for JIT compiler
        { provide: TRANSLATIONS, useValue: translationLibrary },
        { provide: TRANSLATIONS_FORMAT, useValue: "xlf" },
    ],
});
