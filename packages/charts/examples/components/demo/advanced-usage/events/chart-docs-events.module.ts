import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import {
    DEMO_PATH_TOKEN, NuiButtonModule, NuiCheckboxModule, NuiDocsModule, NuiMessageModule, NuiSelectModule, SrlcStage
} from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { ChartDocsEventsComponent } from "./chart-docs-events.component";
import { EventSamplerComponent } from "./event-sampler/event-sampler.component";
import { EventsBasicExampleComponent } from "./events-basic/events-basic-example.component";

const exampleRoutes: Routes = [
    {
        path: "",
        component: ChartDocsEventsComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.beta,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "basic",
        component: EventsBasicExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "event-sampler",
        component: EventSamplerComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
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
        { provide: DEMO_PATH_TOKEN, useFactory: () => (<any>require).context(`!!raw-loader!./`, true, /.*\.(ts|html|less)$/) },
    ],
})
export class ChartDocsEventsModule { }
