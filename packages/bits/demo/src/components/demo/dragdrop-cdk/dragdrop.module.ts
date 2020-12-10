import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { DEMO_PATH_TOKEN, NuiCommonModule, NuiDndModule, NuiDocsModule, SrlcStage } from "@nova-ui/bits";

import { NuiDragDropModule } from "../../../../../src/lib/dragdrop/dragdrop.module";

import { DragdropExampleComponent } from "./dragdrop.example.component";

const routes = [{
    path: "",
    component: DragdropExampleComponent,
    data: {
        "srlc": {
            "stage": SrlcStage.preAlpha,
        },
    },
}];

@NgModule({
    imports: [
        NuiDocsModule,
        NuiCommonModule,
        NuiDndModule,
        RouterModule.forChild(routes),
        NuiDragDropModule,
    ],
    declarations: [
        DragdropExampleComponent,
    ],
    providers: [
        {
            provide: DEMO_PATH_TOKEN,
            useFactory: () => (<any>require).context(`!!raw-loader!./`, true, /.*\.(ts|html|less)$/),
        },
    ],
    exports: [
        RouterModule,
    ],
})
export class DragDropCdkDemoModule {
}
