import { DragDropModule } from "@angular/cdk/drag-drop";
import { CdkTreeModule } from "@angular/cdk/tree";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import {
    DEMO_PATH_TOKEN,
    NuiDndModule,
    NuiDocsModule,
    NuiMessageModule,
} from "@nova-ui/bits";

import { DndAxisConstraintsExampleComponent } from "./dnd-axis-constraints/dnd-axis-constraints.example.component";
import { DndBasicExampleComponent } from "./dnd-basic/dnd-basic.example.component";
import { DndCustomHandleExampleComponent } from "./dnd-custom-handle/dnd-custom-handle.example.component";
import { DndDocsExampleComponent } from "./dnd-docs/dnd-docs.example.component";
import { DndDragDisabledExampleComponent } from "./dnd-drag-disabled/dnd-drag-disabled-example.component";
import { DndDragPlaceholderExampleComponent } from "./dnd-drag-placeholder/dnd-drag-placeholder-example.component";
import { DndDragPreviewExampleComponent } from "./dnd-drag-preview/dnd-drag-preview.example.component";
import { DndDropzoneVisualExampleComponent } from "./dnd-dropzone-visual/dnd-dropzone-visual-example.component";
import { DndDropzoneExampleComponent } from "./dnd-dropzone/dnd-dropzone.example.component";

const routes: Routes = [
    {
        path: "",
        children: [
            {
                path: "",
                component: DndDocsExampleComponent,
            },
            {
                path: "dropzone",
                component: DndDropzoneExampleComponent,
            },
            {
                path: "dropzone-visual",
                component: DndDropzoneExampleComponent,
            },
        ],
    },
];

@NgModule({
    declarations: [
        DndBasicExampleComponent,
        DndCustomHandleExampleComponent,
        DndDragDisabledExampleComponent,
        DndDragPlaceholderExampleComponent,
        DndDragPreviewExampleComponent,
        DndDocsExampleComponent,
        DndDropzoneExampleComponent,
        DndDropzoneVisualExampleComponent,
        DndAxisConstraintsExampleComponent,
    ],
    imports: [
        NuiDocsModule,
        NuiDndModule,
        NuiMessageModule,
        RouterModule.forChild(routes),
        DragDropModule,
        CdkTreeModule,
    ],
    providers: [
        {
            provide: DEMO_PATH_TOKEN,
            useFactory: () =>
                (<any>require).context(
                    `!!raw-loader!./`,
                    true,
                    /.*\.(ts|html|less)$/
                ),
        },
    ],
})
export class DndModule {}
