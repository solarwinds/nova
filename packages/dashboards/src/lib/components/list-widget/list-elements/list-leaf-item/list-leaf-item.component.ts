import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Inject,
    Input,
    OnInit,
    Output,
} from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { EventBus, IEvent } from "@nova-ui/bits";

import { WIDGET_SEARCH } from "../../../../services/types";
import { IHasChangeDetector, PIZZAGNA_EVENT_BUS } from "../../../../types";

@Component({
    selector: "nui-list-leaf-item",
    templateUrl: "./list-leaf-item.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: "w-100" },
    styleUrls: ["list-leaf-item.component.less"],
})
export class ListLeafItemComponent implements IHasChangeDetector, OnInit {
    static lateLoadKey = "ListLeafItemComponent";

    @Input() public icon: string;
    @Input() public status: string;
    @Input() public detailedUrl: string;
    @Input() public label: string;
    @Input() public canNavigate: boolean;
    @Input() public url: string;

    @Output() public navigated = new EventEmitter<ListLeafItemComponent>();

    public searchTerm: string = "";
    protected destroy$ = new Subject();

    onButtonClick() {
        if (this.canNavigate) {
            this.navigated.emit(this);
        }
    }

    constructor(
        public changeDetector: ChangeDetectorRef,
        @Inject(PIZZAGNA_EVENT_BUS) public eventBus: EventBus<IEvent>
    ) {}

    public ngOnInit() {
        this.eventBus
            .getStream(WIDGET_SEARCH)
            .pipe(takeUntil(this.destroy$))
            .subscribe((event) => {
                this.searchTerm = event.payload;
                this.changeDetector.markForCheck();
            });
    }
}
