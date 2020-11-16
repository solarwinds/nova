import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DEMO_PATH_TOKEN, SrlcStage } from "@solarwinds/nova-bits";

import { SchematicsDocsComponent } from "./schematics-docs.component";

const staticRoutes: Routes = [
    {
        path: "",
        component: SchematicsDocsComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.ga,
            },
        },
    },
];

@NgModule({
    declarations: [
        SchematicsDocsComponent,
    ],
    exports: [
        SchematicsDocsComponent,
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(staticRoutes),
    ],
    providers: [
        { provide: DEMO_PATH_TOKEN, useFactory: () => (<any>require).context(`!!raw-loader!./`, true, /.*\.(ts|html|less)$/) },
    ],
})
export class SchematicsDocsModule {
}
