import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { NuiIconModule, NuiRadioModule } from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { DemoCommonModule } from "../../common/demo-common.module";
import { OneDimensionalDataExampleComponent } from "./one-dimensional-data-example/one-dimensional-data.example.component";
import { TwoDimensionalDataExampleComponent } from "./two-dimensional-data-example/two-dimensional-data.example.component";

const routes: Routes = [
    {
        path: "1d",
        component: OneDimensionalDataExampleComponent,
    },
    {
        path: "2d",
        component: TwoDimensionalDataExampleComponent,
    },
];

@NgModule({
    declarations: [
        OneDimensionalDataExampleComponent,
        TwoDimensionalDataExampleComponent,
    ],
    imports: [
        DemoCommonModule,
        NuiChartsModule,
        NuiIconModule,
        NuiRadioModule,
        RouterModule.forChild(routes),
    ],
})
export class TypeSwitchExampleModule {}
