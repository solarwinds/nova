import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NuiChartsModule } from "@nova-ui/charts";

import { DemoCommonModule } from "../../common/demo-common.module";

import { LineTimeSeriesTestComponent } from "./line-time-series/line-time-series-test.component";

const collectionRoutes: Routes = [
    {
        path: "line",
        component: LineTimeSeriesTestComponent,
    },
];

@NgModule({
    declarations: [LineTimeSeriesTestComponent],
    imports: [
        DemoCommonModule,
        NuiChartsModule,
        RouterModule.forChild(collectionRoutes),
    ],
})
export class TimeBandsExampleModule {}
