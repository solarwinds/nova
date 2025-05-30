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

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { DEMO_PATH_TOKEN } from "@nova-ui/bits";
import {
    NuiButtonModule,
    NuiCheckboxModule,
    NuiDocsModule,
    NuiMessageModule,
    NuiSelectModule,
    SrlcStage,
} from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { ChartDocsEventsComponent } from "./chart-docs-events.component";
import { EventSamplerComponent } from "./event-sampler/event-sampler.component";
import { EventsBasicExampleComponent } from "./events-basic/events-basic-example.component";
import { getDemoFiles } from "../../../../demo-files-factory";

const exampleRoutes: Routes = [
    {
        path: "",
        component: ChartDocsEventsComponent,
        data: {
            srlc: {
                stage: SrlcStage.beta,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "basic",
        component: EventsBasicExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "event-sampler",
        component: EventSamplerComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    declarations: [
        ChartDocsEventsComponent,
        EventsBasicExampleComponent,
        EventSamplerComponent,
    ],
    imports: [
        NuiButtonModule,
        NuiCheckboxModule,
        NuiChartsModule,
        NuiDocsModule,
        NuiMessageModule,
        NuiSelectModule,
        RouterModule.forChild(exampleRoutes),
    ],
    providers: [
        {
            provide: DEMO_PATH_TOKEN,
            useValue: getDemoFiles("events"),
        },
    ],
})
export default class ChartDocsEventsModule {}
