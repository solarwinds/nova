import { Component, HostBinding, Input, OnInit } from "@angular/core";

import { ILayoutElementDirection } from "../public-api";

// <example-url>./../examples/index.html#/layout</example-url>
@Component({
    selector: "nui-card-group",
    templateUrl: "./card-group.component.html",
    styleUrls: ["./card-group.component.less"],
})
export class CardGroupComponent implements OnInit {
    @Input() direction: ILayoutElementDirection = "row";
    @HostBinding("class.card-group-direction-column") directionColumn = false;
    @HostBinding("class.card-group-direction-row") directionRow = true;
    ngOnInit() {
        this.directionColumn =
            (this.directionColumn && !this.directionRow) ||
            this.direction === "column";
        this.directionRow =
            (!this.directionColumn && this.directionRow) ||
            this.direction === "row";
    }
}
