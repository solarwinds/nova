import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SrlcStage } from "@nova-ui/bits";

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
                "hideIndicator": true,
            },
        },
    },
    {
        path: "drag-and-drop",
        loadChildren: async (): Promise<unknown> => import("./drag-and-drop/dnd.module").then(m => m.DndModule),
        data: {
            "srlc": {
                "stage": SrlcStage.beta,
            },
        },
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
export class ExternalLibrariesModule { }
