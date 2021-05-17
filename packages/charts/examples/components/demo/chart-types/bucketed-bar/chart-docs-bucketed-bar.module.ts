import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import {
    DEMO_PATH_TOKEN, NuiButtonModule, NuiCheckboxModule, NuiDocsModule, NuiIconModule, NuiMessageModule, NuiSwitchModule, SrlcStage,
} from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { DemoCommonModule } from "../../common/demo-common.module";

import { BarChartGroupedHorizontalExampleComponent } from "./bar-chart-grouped-horizontal/bar-chart-grouped-horizontal.example.component";
import { BarChartGroupedExampleComponent } from "./bar-chart-grouped/bar-chart-grouped.example.component";
import { BarChartPercentageExampleComponent } from "./bar-chart-percentage/bar-chart-percentage.example.component";
import { BarChartStackedHorizontalExampleComponent } from "./bar-chart-stacked-horizontal/bar-chart-stacked-horizontal.example.component";
import { BarChartStackedExampleComponent } from "./bar-chart-stacked/bar-chart-stacked.example.component";
import { BarChartBucketedTestComponent } from "./bar-chart-test/bar-chart-bucketed-test.component";
import { BasicStackedHorizontalBarChartTestComponent } from "./bar-chart-test/basic-stacked-horizontal/basic-stacked-horizontal-bar-chart-test.component";
import { BasicStackedVerticalBarChartTestComponent } from "./bar-chart-test/basic-stacked-vertical/basic-stacked-vertical-bar-chart-test.component";
import { GroupedHorizontalBarChartTestComponent } from "./bar-chart-test/grouped-horizontal/grouped-horizontal-bar-chart-test.component";
import { GroupedVerticalBarChartTestComponent } from "./bar-chart-test/grouped-vertical/grouped-vertical-bar-chart-test.component";
import { ProportionalVerticalBarChartTestComponent } from "./bar-chart-test/proportional-vertical/proportional-vertical-bar-chart-test.component";
import { ChartDocsBucketedBarComponent } from "./chart-docs-bucketed-bar.component";

const routes: Routes = [
    {
        path: "",
        component: ChartDocsBucketedBarComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.beta,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "stacked",
        component: BarChartStackedExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "stacked-test",
        component: BasicStackedVerticalBarChartTestComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "percentage",
        component: BarChartPercentageExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "grouped",
        component: BarChartGroupedExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "grouped-horizontal",
        component: BarChartGroupedHorizontalExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "test",
        component: BarChartBucketedTestComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
];

@NgModule({
    declarations: [
        ChartDocsBucketedBarComponent,
        BarChartGroupedExampleComponent,
        BarChartGroupedHorizontalExampleComponent,
        BarChartPercentageExampleComponent,
        BarChartStackedExampleComponent,
        BarChartStackedHorizontalExampleComponent,
        BasicStackedHorizontalBarChartTestComponent,
        BasicStackedVerticalBarChartTestComponent,
        GroupedHorizontalBarChartTestComponent,
        GroupedVerticalBarChartTestComponent,
        ProportionalVerticalBarChartTestComponent,
        BarChartBucketedTestComponent,
    ],
    imports: [
        DemoCommonModule,
        NuiButtonModule,
        NuiCheckboxModule,
        NuiSwitchModule,
        NuiChartsModule,
        NuiIconModule,
        NuiDocsModule,
        NuiMessageModule,
        RouterModule.forChild(routes),
    ],
    providers: [
        { provide: DEMO_PATH_TOKEN, useFactory: () => (<any>require).context(`!!raw-loader!./`, true, /.*\.(ts|html|less)$/) },
    ],
})
export class ChartDocsBucketedBarModule {
}
