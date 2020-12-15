///<reference path="ref.d.ts"/>

import { HttpClientModule } from "@angular/common/http";
import {
    NgModule,
    TRANSLATIONS,
    TRANSLATIONS_FORMAT
} from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { NuiDocsModule } from "@nova-ui/bits";

import { AppRoutingModule } from "./components/app/app-routing.module";
import { AppComponent } from "./components/app/app.component";
import { AnimationsModule, translationLibrary } from "./environments/environment";

@NgModule({
    imports: [
        AppRoutingModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        AnimationsModule,
        NuiDocsModule,
    ],
    declarations: [
        AppComponent,
    ],
    providers: [
        { provide: TRANSLATIONS_FORMAT, useValue: "xlf" },
        { provide: TRANSLATIONS, useValue: translationLibrary },
    ],
    bootstrap: [AppComponent],
})
export class NuiDemoModule {
}
