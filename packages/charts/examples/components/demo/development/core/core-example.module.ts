import { NgModule, Provider } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import {
    LoggerService, LogLevel, NuiButtonModule, NuiCheckboxModule, NuiDocsModule, NuiEnvironment, NuiIconModule, NuiSwitchModule
} from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { DemoCommonModule } from "../../common/demo-common.module";

import { ChartExampleComponent } from "./chart/chart.example.component";
import { ChartDomainExampleComponent } from "./domain/chart-domain.example.component";
import { ChartEventBusTestComponent } from "./event-bus/chart-event-bus-test.component";
import { ChartMarkersExampleComponent } from "./markers/chart-markers.example.component";

const coreRoutes: Routes = [
    {
        path: "chart",
        component: ChartExampleComponent,
    },
    {
        path: "domain",
        component: ChartDomainExampleComponent,
    },
    {
        path: "markers",
        component: ChartMarkersExampleComponent,
    },
    {
        path: "event-bus",
        component: ChartEventBusTestComponent,
    },
];

const environment = new NuiEnvironment();
environment.logLevel = LogLevel.debug;

@NgModule({
    declarations: [
        ChartExampleComponent,
        ChartDomainExampleComponent,
        ChartEventBusTestComponent,
        ChartMarkersExampleComponent,
    ],
    imports: [
        DemoCommonModule,
        NuiChartsModule,
        NuiButtonModule,
        NuiCheckboxModule,
        NuiDocsModule,
        NuiIconModule,
        NuiSwitchModule,
        RouterModule.forChild(coreRoutes),
    ],
    providers: [
        { provide: LoggerService, useValue: new LoggerService(environment) } as Provider,
    ],
})
export class CoreExampleModule {
}
