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

import { Component } from "@angular/core";
import { NuiDocsModule } from "../../../../../../../src/lib/docs/docs.module";
import { NuiMessageModule } from "../../../../../../../src/lib/message/message.module";
import { DndBasicExampleComponent } from "../dnd-basic/dnd-basic.example.component";
import { DndAxisConstraintsExampleComponent } from "../dnd-axis-constraints/dnd-axis-constraints.example.component";
import { DndDragDisabledExampleComponent } from "../dnd-drag-disabled/dnd-drag-disabled-example.component";
import { DndDragPreviewExampleComponent } from "../dnd-drag-preview/dnd-drag-preview.example.component";
import { DndCustomHandleExampleComponent } from "../dnd-custom-handle/dnd-custom-handle.example.component";
import { DndDragPlaceholderExampleComponent } from "../dnd-drag-placeholder/dnd-drag-placeholder-example.component";
import { DndDropzoneExampleComponent } from "../dnd-dropzone/dnd-dropzone.example.component";

@Component({
    selector: "nui-dnd-docs",
    templateUrl: "./dnd-docs.example.component.html",
    imports: [NuiDocsModule, NuiMessageModule, DndBasicExampleComponent, DndAxisConstraintsExampleComponent, DndDragDisabledExampleComponent, DndDragPreviewExampleComponent, DndCustomHandleExampleComponent, DndDragPlaceholderExampleComponent, DndDropzoneExampleComponent]
})
export class DndDocsExampleComponent {
    public initialSetupCode = `
// our module where we want to use drag-and-drop features
import { DragDropModule } from "@angular/cdk/drag-drop";

@NgModule({
    imports: [
        DragDropModule,
        // other modules that we might need
    ],
    declarations: [ /* our module declaration */],
    exports:      [ /* our exports */ ],
})
export class MyModule {}`.replace("\r\n", "<br/>"); // nice rendering

    public hideHandleWhileDragging = `
.dnd-drag-preview .drag-handle {
    display: none;
}
    `;
}
