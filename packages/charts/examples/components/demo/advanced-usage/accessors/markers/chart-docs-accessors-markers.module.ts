import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import {
    DEMO_PATH_TOKEN,
    NuiDocsModule,
    NuiMessageModule,
    SrlcStage,
} from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { ChartDocsAccessorsMarkersComponent } from "./chart-docs-accessors-markers.component";
import { RendererMarkersCustomAccessorExampleComponent } from "./custom-accessor/markers-custom-accessor.example.component";
import { RendererMarkersCustomProviderExampleComponent } from "./custom-provider/markers-custom-provider.example.component";

const exampleRoutes: Routes = [
    {
        path: "",
        component: ChartDocsAccessorsMarkersComponent,
        data: {
            srlc: {
                stage: SrlcStage.beta,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "custom-provider",
        component: RendererMarkersCustomProviderExampleComponent,
    },
    {
        path: "custom-accessor",
        component: RendererMarkersCustomAccessorExampleComponent,
    },
];

@NgModule({
    declarations: [
        RendererMarkersCustomProviderExampleComponent,
        RendererMarkersCustomAccessorExampleComponent,
        ChartDocsAccessorsMarkersComponent,
    ],
    imports: [
        NuiChartsModule,
        NuiDocsModule,
        NuiMessageModule,
        RouterModule.forChild(exampleRoutes),
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
})
export class ChartDocsAccessorsMarkersModule {}
