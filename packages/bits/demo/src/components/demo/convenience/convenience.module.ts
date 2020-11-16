import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SrlcStage } from "@solarwinds/nova-bits";

import { SummaryComponent } from "./index";


const routes = [
    {
        path: "", redirectTo: "summary", pathMatch: "full",
    },
    {
        path: "summary",
        component: SummaryComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.beta,
            },
        },
    },
    {
        path: "time-frame-bar",
        loadChildren: () => import("./time-frame-bar/time-frame-bar.module").then(m => m.TimeFrameBarModule),
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
    ],
    declarations: [
        SummaryComponent,
    ],
    exports: [
        RouterModule,
    ],
})
export class ConvenienceModule { }
