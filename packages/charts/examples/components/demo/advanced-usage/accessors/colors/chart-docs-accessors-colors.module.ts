import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import {
    DEMO_PATH_TOKEN,
    NuiDocsModule,
    NuiMessageModule,
    SrlcStage,
} from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { ChartDocsAccessorsColorsComponent } from "./chart-docs-accessors-colors.component";
import { RendererColorsCustomAccessorExampleComponent } from "./custom-accessor/colors-custom-accessor.example.component";
import { RendererColorsCustomProviderExampleComponent } from "./custom-provider/colors-custom-provider.example.component";

const exampleRoutes: Routes = [
    {
        path: "",
        component: ChartDocsAccessorsColorsComponent,
        data: {
            srlc: {
                stage: SrlcStage.beta,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "custom-provider",
        component: RendererColorsCustomProviderExampleComponent,
    },
    {
        path: "custom-accessor",
        component: RendererColorsCustomAccessorExampleComponent,
    },
];

@NgModule({
    declarations: [
        RendererColorsCustomProviderExampleComponent,
        RendererColorsCustomAccessorExampleComponent,
        ChartDocsAccessorsColorsComponent,
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
export class ChartDocsAccessorsColorsModule {}
