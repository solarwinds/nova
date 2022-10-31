// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import { NgModule, Provider } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import {
    LoggerService,
    LogLevel,
    NuiButtonModule,
    NuiCheckboxModule,
    NuiDocsModule,
    NuiEnvironment,
    NuiIconModule,
    NuiSwitchModule,
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
        {
            provide: LoggerService,
            useValue: new LoggerService(environment),
        } as Provider,
    ],
})
export class CoreExampleModule {}
