import {
    ApplicationConfig,
    TRANSLATIONS,
    TRANSLATIONS_FORMAT
} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimations} from "@angular/platform-browser/animations";

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideAnimations(),
        {provide: TRANSLATIONS_FORMAT, useValue: "xlf"},
        {provide: TRANSLATIONS, useValue: ""},],
};
