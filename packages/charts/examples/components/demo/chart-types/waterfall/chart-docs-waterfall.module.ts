import { DragDropModule } from "@angular/cdk/drag-drop";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import {
    DEMO_PATH_TOKEN,
    NuiDocsModule,
    NuiIconModule,
    NuiMessageModule,
    SrlcStage,
} from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { DemoCommonModule } from "../../common/demo-common.module";
import { ChartDocsWaterfallComponent } from "./chart-docs-waterfall.component";
import { WaterfallChartAdvancedComponent } from "./waterfall-advanced-charts/waterfall-chart-advanced.example.component";
import { WaterfallChartSimpleComponent } from "./waterfall-chart-simple/waterfall-chart-simple.example.component";
import { WaterfallChartTestComponent } from "./waterfall-test/waterfall-chart-test.component";

const collectionRoutes: Routes = [
    {
        path: "",
        component: ChartDocsWaterfallComponent,
        data: {
            srlc: {
                stage: SrlcStage.beta,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "simple",
        component: WaterfallChartSimpleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "advanced",
        component: WaterfallChartAdvancedComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "test",
        component: WaterfallChartTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    declarations: [
        ChartDocsWaterfallComponent,
        WaterfallChartSimpleComponent,
        WaterfallChartAdvancedComponent,
        WaterfallChartTestComponent,
    ],
    imports: [
        DragDropModule,
        NuiIconModule,
        NuiDocsModule,
        DemoCommonModule,
        NuiChartsModule,
        NuiMessageModule,
        RouterModule.forChild(collectionRoutes),
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
export class ChartDocsWaterfallModule {}
