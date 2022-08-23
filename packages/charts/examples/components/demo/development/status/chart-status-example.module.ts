import { DragDropModule } from "@angular/cdk/drag-drop";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { NuiIconModule } from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { DemoCommonModule } from "../../common/demo-common.module";
import { ChartStatusTestComponent } from "./status-test/chart-status-test.component";
import { ChartWaterfallSimpleComponent } from "./waterfall-simple/chart-waterfall-simple.component";
import { ChartWaterfallTestComponent } from "./waterfall-test/chart-waterfall-test.component";

const collectionRoutes: Routes = [
    {
        path: "",
        component: ChartStatusTestComponent,
    },
    {
        path: "waterfall",
        component: ChartWaterfallTestComponent,
    },
    {
        path: "waterfall-simple",
        component: ChartWaterfallSimpleComponent,
    },
];

@NgModule({
    declarations: [
        ChartStatusTestComponent,
        ChartWaterfallSimpleComponent,
        ChartWaterfallTestComponent,
    ],
    imports: [
        DragDropModule,
        NuiIconModule,
        DemoCommonModule,
        NuiChartsModule,
        RouterModule.forChild(collectionRoutes),
    ],
})
export class ChartStatusExampleModule {}
