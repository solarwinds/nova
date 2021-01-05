import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    Output,
} from "@angular/core";

import { IHasChangeDetector } from "../../../../types";

const MEDIUM_WIDTH = 600;
const SMALL_WIDTH = 480;

@Component({
    selector: "nui-list-group-item",
    templateUrl: "./list-group-item.component.html",
    styleUrls: ["list-group-item.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: "w-100",
    },
})
export class ListGroupItemComponent implements IHasChangeDetector {
    static lateLoadKey = "ListGroupItemComponent";

    @Input() public id: string;
    @Input() public label: string;
    @Input() public statuses: Array<{ [key: string]: any }>;

    @Input() public canNavigate: boolean;
    @Input() set widgetWidth(res: number) {
        this.isMedium = res <= MEDIUM_WIDTH && res > SMALL_WIDTH;
        this.isSmall = res <= SMALL_WIDTH;
    }

    @Output() public navigated = new EventEmitter<ListGroupItemComponent>();

    public isMedium: boolean;
    public isSmall: boolean;

    constructor(public changeDetector: ChangeDetectorRef) {}

    onButtonClick() {
        if (this.canNavigate) {
            this.navigated.emit(this);
        }
    }
}
