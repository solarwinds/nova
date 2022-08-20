import { Component, HostBinding, Input, OnInit } from "@angular/core";

import { ILayoutElementDirection } from "../public-api";

// <example-url>./../examples/index.html#/layout</example-url>
@Component({
    selector: "nui-card",
    templateUrl: "./card.component.html",
    styleUrls: ["./card.component.less"],
})
export class CardComponent implements OnInit {
    @Input() direction: ILayoutElementDirection;
    @HostBinding("class.card-direction-column") directionColumn: boolean;
    @HostBinding("class.card-direction-row") directionRow: boolean;

    ngOnInit() {
        this.directionColumn =
            (this.directionColumn && !this.directionRow) ||
            this.direction === "column";
        this.directionRow =
            (!this.directionColumn && this.directionRow) ||
            this.direction === "row";
    }
}
