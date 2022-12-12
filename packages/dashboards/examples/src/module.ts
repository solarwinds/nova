// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import { CommonModule, DatePipe } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule, TRANSLATIONS, TRANSLATIONS_FORMAT } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";

import {
    LocalFilteringDataSource,
    NuiDocsModule,
    NuiSwitchModule,
} from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { SourceInspectorModule } from "../../src/source-inspector/source-inspector.module";
import { AppComponent } from "./components";
import { AppRoutingModule } from "./components/app/app-routing.module";
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
        DatePipe,
        LocalFilteringDataSource,
    ],
    bootstrap: [AppComponent],
})
export class DashboardsDemoModule {}
