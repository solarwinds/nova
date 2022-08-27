import { HttpClientModule } from "@angular/common/http";
import { NgModule, TRANSLATIONS, TRANSLATIONS_FORMAT } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";

import { NuiDocsModule, NuiExpanderModule } from "@nova-ui/bits";

import { ChartExampleIndexComponent } from "./chart-example-index.component";
import { AppRoutingModule } from "./components/app/app-routing.module";
import { AppComponent } from "./components/app/app.component";
import { AnimationsModule } from "./environments/environment";

@NgModule({
    imports: [
        AppRoutingModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        AnimationsModule,
        NuiDocsModule,
        NuiExpanderModule,
    ],
    declarations: [AppComponent, ChartExampleIndexComponent],
    providers: [
        { provide: TRANSLATIONS_FORMAT, useValue: "xlf" },
        { provide: TRANSLATIONS, useValue: "" },
    ],
    bootstrap: [AppComponent],
})
export class ChartsDemoModule {}
