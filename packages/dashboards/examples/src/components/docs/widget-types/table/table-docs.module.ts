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
import { RouterModule, Routes } from "@angular/router";

import { DEMO_PATH_TOKEN } from "@nova-ui/bits";
import {
    NuiButtonModule,
    NuiDocsModule,
    NuiMessageModule,
    NuiSwitchModule,
} from "@nova-ui/bits";
import {
    NuiDashboardsModule,
    TableFormatterRegistryService,
} from "@nova-ui/dashboards";

import { DEFAULT_TABLE_FORMATTERS } from "../../../../../../src/lib/widget-types/table/default-table-formatters";
import { getDemoFiles } from "../../../../demo-files-factory";
import { TableDocsComponent } from "./table-docs.component";
import { TableWidgetInteractiveExampleComponent } from "./table-widget-interactive/table-widget-interactive-example.component";
import { TableSearchDocsComponent } from "./table-widget-search-docs.component";
import { TableWidgetSearchExampleComponent } from "./table-widget-search/table-widget-search-example.component";
import { TableWidgetExampleComponent } from "./table-widget/table-widget-example.component";
import {
    TableSelectableDocsComponent,
} from "./table-selectable-docs.component";
import {
    TableWidgetSelectableExampleComponent,
} from "./table-widget-selectable/table-widget-selectable.example.component";
import { TablePaginatorDocsComponent } from "./table-paginator-docs.component";
import {
    TableWidgetPaginatorExampleComponent,
} from "./table-widget-paginator/table-widget-paginator-example.component";

const routes: Routes = [
    {
        path: "",
        component: TableDocsComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "example",
        component: TableWidgetExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "table-search",
        component: TableSearchDocsComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "table-paginator",
        component: TablePaginatorDocsComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "table-select",
        component: TableSelectableDocsComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
            showThemeSwitcher: true,
        },
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        NuiButtonModule,
        NuiDocsModule,
        NuiMessageModule,
        NuiSwitchModule,
        NuiDashboardsModule,
    ],
    declarations: [
        TableDocsComponent,
        TableSearchDocsComponent,
        TablePaginatorDocsComponent,
        TableWidgetPaginatorExampleComponent,
        TableSelectableDocsComponent,
        TableWidgetInteractiveExampleComponent,
        TableWidgetExampleComponent,
        TableWidgetSearchExampleComponent,
        TableWidgetSelectableExampleComponent,
    ],
    providers: [
        {
            provide: DEMO_PATH_TOKEN,
            useValue: getDemoFiles("table"),
        },
    ],
})
export default class TableDocsModule {
    constructor(tableFormattersRegistryService: TableFormatterRegistryService) {
        tableFormattersRegistryService.addItems(DEFAULT_TABLE_FORMATTERS);
    }
}
