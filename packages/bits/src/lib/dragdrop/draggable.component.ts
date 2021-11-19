import { CdkDrag, CdkDropList } from "@angular/cdk/drag-drop";
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from "@angular/core";

import { DroppableComponent } from "./droppable.component";

/**
 * @ignore
 */
@Component({
    selector: "nui-draggable",
    templateUrl: "./draggable.component.html",
    styleUrls: ["./draggable.component.less"],
    host: { "aria-grabbed": "supported" },
})
export class DraggableComponent implements OnInit {
    @Input() payload: any;
    @Input() dropTarget: DroppableComponent;
    @Input() dragHandle: boolean = false;
    @Input() dragPreview: TemplateRef<any>;
    @Output() dragStart = new EventEmitter();
    @Output() dragEnd = new EventEmitter();

    @ViewChild(CdkDropList, { static: true }) dropList: CdkDropList;
    @ViewChild(CdkDrag, { static: true }) dragElement: CdkDrag;

    constructor() { }

    ngOnInit(): void {
        this.dragElement.dropContainer = this.dropTarget.dropList;
    }
}
