import { CommonModule, DatePipe } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule, TRANSLATIONS, TRANSLATIONS_FORMAT } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";

import {
    DEMO_PATH_TOKEN,
    LocalFilteringDataSource,
    NuiDocsModule,
    NuiSwitchModule,
} from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { SourceInspectorModule } from "../../src/source-inspector/source-inspector.module";
import { AppRoutingModule } from "./components/app/app-routing.module";
import { AppComponent } from "./components/app/app.component";
import { AnimationsModule } from "./environments/environment";

@NgModule({
    imports: [
        CommonModule,
        AppRoutingModule,
        NuiSwitchModule,
        BrowserModule,
        HttpClientModule,
        RouterModule,
        AnimationsModule,
        NuiDocsModule,
        NuiChartsModule,
        NuiSwitchModule,
        SourceInspectorModule,
    ],
    declarations: [AppComponent],
    providers: [
        { provide: TRANSLATIONS_FORMAT, useValue: "xlf" },
        { provide: TRANSLATIONS, useValue: "" },
        // use pathToken to configure SourcesService of NuiDocsModule
        // pay attention that 'The arguments passed to require.context must be literals!'
        // https://webpack.js.org/guides/dependency-management/
        {
            provide: DEMO_PATH_TOKEN,
            useFactory: () =>
                (<any>require).context(
                    `!!raw-loader!./components/`,
                    true,
                    /.*\.(ts|html|less)$/
                ),
        },
        DatePipe,
        LocalFilteringDataSource,
    ],
    bootstrap: [AppComponent],
})
export class DashboardsDemoModule {}
