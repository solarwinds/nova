import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DEMO_PATH_TOKEN, NuiDocsModule, NuiIconModule, NuiMessageModule, SrlcStage } from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { DemoCommonModule } from "../../common/demo-common.module";

import { BarChartHorizontalExampleComponent } from "./bar-chart-horizontal/bar-chart-horizontal.example.component";
import { BarChartTestComponent } from "./bar-chart-test/bar-chart-test.component";
// eslint-disable-next-line max-len
import { BarChartTickLabelMaxWidthWithMarginTestComponent } from "./bar-chart-test/bar-chart-tick-label-max-width-with-margin/bar-chart-tick-label-max-width-with-margin-test.component";
import { BarChartTickLabelMaxWidthTestComponent } from "./bar-chart-test/bar-chart-tick-label-max-width/bar-chart-tick-label-max-width-test.component";
import { BasicHorizontalBarChartTestComponent } from "./bar-chart-test/basic-horizontal/basic-horizontal-bar-chart-test.component";
import { BasicVerticalBarChartTestComponent } from "./bar-chart-test/basic-vertical/basic-vertical-bar-chart-test.component";
import { DaylightSavingTimeTestModule } from "./bar-chart-test/daylight-saving-time/daylight-saving-time-test.module";
import { HorizontalWithLegendBarChartTestComponent } from "./bar-chart-test/horizontal-with-legend/horizontal-with-legend-bar-chart-test.component";
import { TimeIntervalTestComponent } from "./bar-chart-test/time-interval/time-interval.test.component";
import { VerticalWithLegendBarChartTestComponent } from "./bar-chart-test/vertical-with-legend/vertical-with-legend-bar-chart-test.component";
import { VerticalWithTimescaleBarChartTestComponent } from "./bar-chart-test/vertical-with-timescale/vertical-with-timescale-bar-chart-test.component";
import { BarChartTimeIntervalExampleComponent } from "./bar-chart-time-interval/bar-chart-time-interval.example.component";
import { BarChartTimeScaleExampleComponent } from "./bar-chart-time-scale/bar-chart-time-scale.example.component";
import { BarChartWithLegendExampleComponent } from "./bar-chart-with-legend/bar-chart-with-legend.example.component";
import { BarChartExampleComponent } from "./bar-chart/bar-chart.example.component";
import { ChartDocsBarComponent } from "./chart-docs-bar.component";

const exampleRoutes: Routes = [
    {
        path: "",
        component: ChartDocsBarComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.beta,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "bar-chart",
        component: BarChartExampleComponent,
        data: {
            "srlc": {
                hideIndicator: true,
            },
        },
    },
    {
        path: "horizontal",
        component: BarChartHorizontalExampleComponent,
        data: {
            "srlc": {
                hideIndicator: true,
            },
        },
    },
    {
        path: "with-legend",
        component: BarChartWithLegendExampleComponent,
    },
    {
        path: "test",
        component: BarChartTestComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "dst-time-interval-test",
        component: DaylightSavingTimeTestModule.DstTimeIntervalTestPageComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "time-interval",
        component: BarChartTimeIntervalExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "vertical-bar-test",
        component: BasicVerticalBarChartTestComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "horizontal-bar-test",
        component: BasicHorizontalBarChartTestComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "bar-chart-max-width-test",
        component: BarChartTickLabelMaxWidthTestComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "bar-chart-max-width-with-margin-test",
        component: BarChartTickLabelMaxWidthWithMarginTestComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
];

@NgModule({
    declarations: [
        ChartDocsBarComponent,
        BarChartExampleComponent,
        BarChartHorizontalExampleComponent,
        BarChartTimeScaleExampleComponent,
        BarChartTimeIntervalExampleComponent,
        BarChartTickLabelMaxWidthTestComponent,
        BarChartTickLabelMaxWidthWithMarginTestComponent,
        BarChartWithLegendExampleComponent,
        BarChartTestComponent,
        BasicHorizontalBarChartTestComponent,
        BasicVerticalBarChartTestComponent,
        VerticalWithTimescaleBarChartTestComponent,
        VerticalWithLegendBarChartTestComponent,
        HorizontalWithLegendBarChartTestComponent,
        TimeIntervalTestComponent,
    ],
    imports: [
        DemoCommonModule,
        NuiChartsModule,
        NuiIconModule,
        NuiDocsModule,
        NuiMessageModule,
        DaylightSavingTimeTestModule,
        RouterModule.forChild(exampleRoutes),
    ],
    providers: [
        { provide: DEMO_PATH_TOKEN, useFactory: () => (<any>require).context(`!!raw-loader!./`, true, /.*\.(ts|html|less)$/) },
    ],
})
export class ChartDocsBarModule {
}
