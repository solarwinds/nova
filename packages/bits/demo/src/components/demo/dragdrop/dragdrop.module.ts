import { DragDropModule } from "@angular/cdk/drag-drop";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { DEMO_PATH_TOKEN, NuiButtonModule, NuiCommonModule, NuiDocsModule, SrlcStage } from "@solarwinds/nova-bits";

import { NuiFileDropExampleModule } from "./file-drop/file-drop.module";
import {
    DragdropBasicExampleComponent,
    DragdropCdkExampleComponent,
    DragdropExampleComponent,
    DragdropFilesExampleComponent,
} from "./index";

const routes = [{
    path: "",
    component: DragdropExampleComponent,
    data: {
        "srlc": {
            "stage": SrlcStage.alpha,
        },
    },
}];

@NgModule({
    imports: [
        DragDropModule,
        NuiButtonModule,
        NuiDocsModule,
        NuiCommonModule,
        NuiFileDropExampleModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        DragdropExampleComponent,
        DragdropBasicExampleComponent,
        DragdropCdkExampleComponent,
        DragdropFilesExampleComponent,
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
export class DragDropDemoModule {
}
