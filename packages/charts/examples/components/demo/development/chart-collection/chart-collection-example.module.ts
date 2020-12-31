import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NuiDividerModule } from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { DemoCommonModule } from "../../common/demo-common.module";

import { ChartCollectionTestComponent } from "./chart-collection-test/chart-collection-test.component";

const collectionRoutes: Routes = [
    {
        path: "",
        component: ChartCollectionTestComponent,
    },
];

@NgModule({
    declarations: [
        ChartCollectionTestComponent,
    ],
    imports: [
        DemoCommonModule,
        NuiChartsModule,
        NuiDividerModule,
        RouterModule.forChild(collectionRoutes),
    ],
})
export class ChartCollectionExampleModule {
}
