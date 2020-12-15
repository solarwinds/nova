import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DEMO_PATH_TOKEN, NuiCheckboxModule, NuiDocsModule, NuiMessageModule, SrlcStage } from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { ChartDocsBaseGridComponent } from "./chart-docs-base-grid.component";
import { BaseGridDisablingInteractionExampleComponent } from "./disabling-interaction/base-grid-disabling-interaction.example.component";
import { BaseGridHeightAndWidthExampleComponent } from "./height-and-width/base-grid-height-and-width.example.component";
import { BaseGridAutoMarginsExampleComponent } from "./margins/base-grid-auto-margins.example.component";
import { BaseGridMarginsExampleComponent } from "./margins/base-grid-margins.example.component";
import { BaseGridPaddingExampleComponent } from "./padding/base-grid-padding.example.component";

const exampleRoutes: Routes = [
    {
        path: "",
        component: ChartDocsBaseGridComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.beta,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "disabling-interaction",
        component: BaseGridDisablingInteractionExampleComponent,
    },
    {
        path: "margins",
        component: BaseGridMarginsExampleComponent,
    },
    {
        path: "padding",
        component: BaseGridPaddingExampleComponent,
    },
    {
        path: "height-and-width",
        component: BaseGridHeightAndWidthExampleComponent,
    },
];

@NgModule({
    declarations: [
        BaseGridDisablingInteractionExampleComponent,
        BaseGridAutoMarginsExampleComponent,
        BaseGridMarginsExampleComponent,
        BaseGridPaddingExampleComponent,
        BaseGridHeightAndWidthExampleComponent,
        ChartDocsBaseGridComponent,
    ],
    imports: [
        NuiCheckboxModule,
        NuiChartsModule,
        NuiDocsModule,
        NuiMessageModule,
        RouterModule.forChild(exampleRoutes),
    ],
    providers: [
        { provide: DEMO_PATH_TOKEN, useFactory: () => (<any>require).context(`!!raw-loader!./`, true, /.*\.(ts|html|less)$/) },
    ],
})
export class ChartDocsBaseGridModule {
}
