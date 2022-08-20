import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import {
    DEMO_PATH_TOKEN,
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
    providers: [
        {
            provide: DEMO_PATH_TOKEN,
            useFactory: () =>
                (<any>require).context(
                    `!!raw-loader!./`,
                    true,
                    /.*\.(ts|html|less)$/
                ),
        },
    ],
    exports: [
        RouterModule,
        DataSourceExampleComponent,
        ClientSideDataSourceDocsComponent,
    ],
})
export class DataSourceModule {}
