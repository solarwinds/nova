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

import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import {
    NuiCheckboxModule,
    NuiDocsModule,
    NuiExpanderModule,
    NuiIconModule,
    NuiImageModule,
    NuiMessageModule,
    NuiPaginatorModule,
    NuiPanelModule,
    NuiRepeatModule,
    NuiSearchModule,
    NuiSelectorModule,
    NuiSorterModule,
    SrlcStage,
} from "@nova-ui/bits";

import { DataSourceClientSideBasicExampleComponent } from "./client-side/client-side-basic/client-side-basic.example.component";
import { DataSourceClientSideCustomSearchExampleComponent } from "./client-side/client-side-custom-search/client-side-custom-search.example.component";
import { DataSourceClientSideDelayedExampleComponent } from "./client-side/client-side-delayed/client-side-delayed.example.component";
import { DataSourceClientSideFilteringExampleComponent } from "./client-side/client-side-filtering/client-side-filtering.example.component";
import { DataSourceWithSelectionExampleComponent } from "./client-side/client-side-with-selection/client-side-with-selection.example.component";
import { ClientSideDataSourceDocsComponent } from "./client-side/docs/client-side-data-source-docs.example.component";
import { DepreacatedDataSourceClientSideBasicExampleComponent } from "./deprecated-client-side/client-side-basic/client-side-basic.example.component";
import { DepreacatedDataSourceClientSideCustomSearchExampleComponent } from "./deprecated-client-side/client-side-custom-search/client-side-custom-search.example.component";
import { DepreacatedDataSourceClientSideDelayedExampleComponent } from "./deprecated-client-side/client-side-delayed/client-side-delayed.example.component";
import { DepreacatedDataSourceClientSideFilteringExampleComponent } from "./deprecated-client-side/client-side-filtering/client-side-filtering.example.component";
import { DepreacatedDataSourceWithSelectionExampleComponent } from "./deprecated-client-side/client-side-with-selection/client-side-with-selection.example.component";
import { DataSourceExampleComponent } from "./deprecated-client-side/docs/data-source-docs.example.component";

const routes = [
    {
        path: "deprecated-client-side",
        component: DataSourceExampleComponent,
        data: {
            srlc: {
                stage: SrlcStage.support,
                eolDate: new Date("2021-12-31"),
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "client-side",
        component: ClientSideDataSourceDocsComponent,
    },
];

@NgModule({
    declarations: [
        ClientSideDataSourceDocsComponent,
        DataSourceExampleComponent,
        DepreacatedDataSourceClientSideBasicExampleComponent,
        DepreacatedDataSourceClientSideFilteringExampleComponent,
        DepreacatedDataSourceClientSideDelayedExampleComponent,
        DepreacatedDataSourceClientSideCustomSearchExampleComponent,
        DepreacatedDataSourceWithSelectionExampleComponent,
        DataSourceClientSideBasicExampleComponent,
        DataSourceClientSideFilteringExampleComponent,
        DataSourceClientSideDelayedExampleComponent,
        DataSourceClientSideCustomSearchExampleComponent,
        DataSourceWithSelectionExampleComponent,
    ],
    imports: [
        NuiDocsModule,
        NuiPaginatorModule,
        NuiImageModule,
        NuiIconModule,
        NuiExpanderModule,
        NuiSearchModule,
        NuiRepeatModule,
        NuiSelectorModule,
        NuiSorterModule,
        NuiCheckboxModule,
        NuiPanelModule,
        NuiMessageModule,
        RouterModule.forChild(routes),
    ],
    exports: [
        RouterModule,
        DataSourceExampleComponent,
        ClientSideDataSourceDocsComponent,
    ],
})
export class DataSourceModule {}
