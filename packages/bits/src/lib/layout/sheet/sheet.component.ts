import {Component, ElementRef, HostBinding, Input, OnInit } from "@angular/core";

import {ResizeDirection} from "../../../common/directives/resizer/public-api";
import {ILayoutElementDirection} from "../public-api";


// <example-url>./../examples/index.html#/layout</example-url>
@Component({
    selector: "nui-sheet",
    templateUrl: "./sheet.component.html",
    host: {"class": "nui-sheet"},
    styleUrls: ["./sheet.component.less"],
})
export class SheetComponent implements OnInit {
    @HostBinding("class.sheet-fit-content")
    @Input() fitContent: boolean;
    @Input() direction: ILayoutElementDirection = "row";
    @Input() initialSizeValue: string;
    @HostBinding("class.sheet-direction-column") directionColumn = false;
    @HostBinding("class.sheet-direction-row") directionRow = true;

    public resizeDirection: ResizeDirection;

    constructor(public elRef: ElementRef) {}

    ngOnInit() {
        this.directionColumn = (this.directionColumn && !this.directionRow) || this.direction === "column";
        this.directionRow = (!this.directionColumn && this.directionRow) || this.direction === "row";
        this.resizeDirection = this.direction === "row" ? ResizeDirection.right : ResizeDirection.bottom;
    }
}
