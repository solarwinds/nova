import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { AcmeComponentsModule } from "./components/components.module";

const routes = [
    {
        path: "prototype-1",
        loadChildren: () => import("../prototypes/prototype-1/prototype-1.module").then(m => m.Prototype1Module),
    },
    {
        path: "timeseries",
        loadChildren: () => import("../prototypes/timeseries/timeseries-widget-prototype.module").then(m => m.TimeseriesWidgetPrototypeModule),
    },
    {
        path: "table",
        loadChildren: () => import("../prototypes/table/table-widget-prototype.module").then(m => m.TableWidgetPrototypeModule),
    },
];

@NgModule({
    imports: [
        CommonModule,
        AcmeComponentsModule,
        RouterModule.forChild(routes),
    ],
})
export class DashboardPrototypesModule { }
