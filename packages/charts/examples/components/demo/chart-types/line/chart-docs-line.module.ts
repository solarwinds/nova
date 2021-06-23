import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { DEMO_PATH_TOKEN, NuiDocsModule, NuiIconModule, NuiMessageModule, SrlcStage } from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { DemoCommonModule } from "../../common/demo-common.module";

import { ChartDocsLineComponent } from "./chart-docs-line.component";
import { LineChartBasicExampleComponent } from "./line-chart-basic/line-chart-basic.example.component";
import { LineChartInterruptedBasicExampleComponent } from "./line-chart-interrupted-basic/line-chart-interrupted-basic-example.component";
import { LineChartInterruptedCalculatedExampleComponent } from "./line-chart-interrupted-calculated/line-chart-interrupted-calculated-example.component";
// eslint-disable-next-line max-len
import { LineChartInterruptedPathTerminusExampleComponent } from "./line-chart-interrupted-path-terminus/line-chart-interrupted-path-terminus-example.component";
import { LineChartTestComponent } from "./line-chart-test/line-chart-test.component";
import { LineChartVisualTestComponent } from "./line-chart-visual-test/line-chart-visual-test.component";
import { LineChartWith2YAxesExampleComponent } from "./line-chart-with-2y-axes/line-chart-with-2y-axes-example.component";
import { LineChartWithAxisLabelsExampleComponent } from "./line-chart-with-axis-labels/line-chart-with-axis-labels.example.component";
import { LineChartWithLargeValuesExampleComponent } from "./line-chart-with-large-values/line-chart-with-large-values.example.component";
import { LineChartWithLegendExampleComponent } from "./line-chart-with-legend/line-chart-with-legend.example.component";
import { LineChartWithRichTileLegendExampleComponent } from "./line-chart-with-rich-tile-legend/line-chart-with-rich-tile-legend.example.component";

const exampleRoutes: Routes = [
    {
        path: "",
        component: ChartDocsLineComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.beta,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "axis-labels",
        component: LineChartWithAxisLabelsExampleComponent,
    },
    {
        path: "two-y-axes",
        component: LineChartWith2YAxesExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "basic",
        component: LineChartBasicExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "rich-legend-tile",
        component: LineChartWithRichTileLegendExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "interrupted",
        component: LineChartInterruptedBasicExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "interrupted-calculated",
        component: LineChartInterruptedCalculatedExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "interrupted-path-terminus",
        component: LineChartInterruptedPathTerminusExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "test",
        component: LineChartTestComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "visual-test",
        component: LineChartVisualTestComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
];

@NgModule({
    declarations: [
        ChartDocsLineComponent,
        LineChartWithAxisLabelsExampleComponent,
        LineChartBasicExampleComponent,
        LineChartTestComponent,
        LineChartVisualTestComponent,
        LineChartWithLegendExampleComponent,
        LineChartWithRichTileLegendExampleComponent,
        LineChartWith2YAxesExampleComponent,
        LineChartInterruptedBasicExampleComponent,
        LineChartInterruptedPathTerminusExampleComponent,
        LineChartInterruptedCalculatedExampleComponent,
        LineChartWithLargeValuesExampleComponent,
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
export class ChartDocsLineModule {
}
