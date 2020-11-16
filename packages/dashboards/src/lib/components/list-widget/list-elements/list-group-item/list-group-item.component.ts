import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";

import { IHasChangeDetector } from "../../../../types";

@Component({
    selector: "nui-list-group-item",
    templateUrl: "./list-group-item.component.html",
    styleUrls: ["list-group-item.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: "w-100" },
})
export class ListGroupItemComponent implements IHasChangeDetector, OnChanges {
    static lateLoadKey = "ListGroupItemComponent";

    @Input() public id: string;
    @Input() public label: string;
    @Input() public statuses: { [key: string]: any };

    @Input() public canNavigate: boolean;

    @Output() public navigated = new EventEmitter<ListGroupItemComponent>();

    public currentColumnWidth: string;

    constructor(public changeDetector: ChangeDetectorRef) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes.statuses) {
            this.currentColumnWidth = this.getBasis();
        }
    }

    onButtonClick() {
        if (this.canNavigate) {
            this.navigated.emit(this);
        }
    }

    private getBasis() {
        const statusesLength = Object.keys(this.statuses).length;
        return statusesLength ? 100 / statusesLength + "%" : "unset";
    }
}
