import {Component} from "@angular/core";

@Component({
    selector: "nui-dnd-docs",
    templateUrl: "./dnd-docs.example.component.html",
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
export class MyModule {}`
        .replace("\r\n", "<br/>") // nice rendering
    ;

    public hideHandleWhileDragging = `
.dnd-drag-preview .drag-handle {
    display: none;
}
    `;
}
