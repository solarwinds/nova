import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NuiButtonModule, NuiDocsModule, NuiMessageModule, NuiSwitchModule } from "@nova-ui/bits";
import { NuiDashboardsModule, TableFormatterRegistryService } from "@nova-ui/dashboards";

import { DEFAULT_TABLE_FORMATTERS } from "../../../../../../src/lib/widget-types/table/table-configurator";

import { TableDocsComponent } from "./table-docs.component";
import { TableWidgetExampleComponent } from "./table-widget-example/table-widget-example.component";
import { TableSearchDocsComponent } from "./table-widget-search-example/docs/table-search-docs.component";
import { TableWidgetSearchExampleComponent } from "./table-widget-search-example/example/table-widget-search.example.component";

const routes: Routes = [
    {
        path: "",
        component: TableDocsComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "example",
        component: TableWidgetExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "table-search",
        component: TableSearchDocsComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
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
        TableWidgetExampleComponent,
        TableWidgetSearchExampleComponent,
    ],
})
export class TableDocsModule {
    constructor(tableFormattersRegistryService: TableFormatterRegistryService) {
        tableFormattersRegistryService.addItems(DEFAULT_TABLE_FORMATTERS);
    }
}
