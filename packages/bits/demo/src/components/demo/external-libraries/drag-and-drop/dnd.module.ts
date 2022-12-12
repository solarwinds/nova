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

import { DragDropModule } from "@angular/cdk/drag-drop";
import { CdkTreeModule } from "@angular/cdk/tree";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { NuiDndModule, NuiDocsModule, NuiMessageModule } from "@nova-ui/bits";

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
})
export default class DndModule {}
