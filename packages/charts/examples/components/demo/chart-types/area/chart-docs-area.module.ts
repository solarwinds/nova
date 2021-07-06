/* eslint-disable max-len */
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { DEMO_PATH_TOKEN, NuiDocsModule, NuiIconModule, NuiMessageModule, SrlcStage } from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { DemoCommonModule } from "../../common/demo-common.module";

import { AreaChartBasicExampleComponent } from "./area-chart-basic/area-chart-basic-example.component";
import { AreaChartBiDirectionalStackedInvertedExampleComponent } from "./area-chart-bi-directional-stacked-inverted/area-chart-bi-directional-stacked-inverted-example.component";
import { AreaChartBiDirectionalStackedTestComponent } from "./area-chart-bi-directional-stacked-test/area-chart-bi-directional-stacked-test.component";
import { AreaChartBiDirectionalStackedVisualTestComponent }
    from "./area-chart-bi-directional-stacked-test/area-chart-bi-directional-stacked-visual-test.component";
import { AreaChartBiDirectionalStackedExampleComponent } from "./area-chart-bi-directional-stacked/area-chart-bi-directional-stacked-example.component";
import { AreaChartBiDirectionalExampleComponent } from "./area-chart-bi-directional/area-chart-bi-directional-example.component";
import { AreaChartStackPercentageExampleComponent } from "./area-chart-stack-percentage/area-chart-stack-percentage-example.component";
import { AreaChartStackExampleComponent } from "./area-chart-stack/area-chart-stack-example.component";
import { AreaChartVariableBaselineExampleComponent } from "./area-chart-variable-baseline/area-chart-variable-baseline-example.component";
import { AreaChartVerticalExampleComponent } from "./area-chart-vertical/area-chart-vertical-example.component";
import { ChartDocsAreaComponent } from "./chart-docs-area.component";
import { AreaChartTestComponent } from "./test/area-chart-test.component";
/* eslint-enable max-len */

const exampleRoutes: Routes = [
    {
        path: "",
        component: ChartDocsAreaComponent,
        data: {
            srlc: {
                stage: SrlcStage.beta,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "basic",
        component: AreaChartBasicExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "variable-baseline",
        component: AreaChartVariableBaselineExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "vertical",
        component: AreaChartVerticalExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "test",
        component: AreaChartTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "stacked",
        component: AreaChartStackExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "bi-directional",
        component: AreaChartBiDirectionalExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "bi-directional-stacked",
        component: AreaChartBiDirectionalStackedExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "bi-directional-stacked-inverted",
        component: AreaChartBiDirectionalStackedInvertedExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "bi-directional-stacked-test",
        component: AreaChartBiDirectionalStackedVisualTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    declarations: [
        ChartDocsAreaComponent,
        AreaChartBasicExampleComponent,
        AreaChartBiDirectionalExampleComponent,
        AreaChartBiDirectionalStackedExampleComponent,
        AreaChartBiDirectionalStackedInvertedExampleComponent,
        AreaChartVariableBaselineExampleComponent,
        AreaChartVerticalExampleComponent,
        AreaChartStackExampleComponent,
        AreaChartStackPercentageExampleComponent,
        AreaChartTestComponent,
        AreaChartBiDirectionalStackedTestComponent,
        AreaChartBiDirectionalStackedVisualTestComponent,
    ],
    imports: [
        DemoCommonModule,
        FormsModule,
        NuiChartsModule,
        NuiIconModule,
        NuiDocsModule,
        NuiMessageModule,
        RouterModule.forChild(exampleRoutes),
    ],
    providers: [
        { provide: DEMO_PATH_TOKEN, useFactory: () => (<any>require).context(`!!raw-loader!./`, true, /.*\.(ts|html|less)$/) },
    ],
})
export class ChartDocsAreaModule {
}
