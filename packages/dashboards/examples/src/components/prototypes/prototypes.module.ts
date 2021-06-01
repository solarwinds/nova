import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ConfiguratorHeadingService } from "@nova-ui/dashboards";

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
    {
        path: "many-widgets",
        loadChildren: () => import("../prototypes/many-widgets/many-widgets.module").then(m => m.ManyWidgetsModule),
    },
];

@NgModule({
    imports: [
        CommonModule,
        AcmeComponentsModule,
        RouterModule.forChild(routes),
    ],
    providers: [ConfiguratorHeadingService],
})
export class DashboardPrototypesModule { }
