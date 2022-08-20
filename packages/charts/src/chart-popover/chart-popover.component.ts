import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    TemplateRef,
    ViewChild,
} from "@angular/core";
import { PopoverComponent } from "@nova-ui/bits";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { IDataPointsPayload } from "../core/common/types";
import { ChartPopoverPlugin } from "../core/plugins/chart-popover-plugin";
import { IElementPosition } from "../core/plugins/types";

@Component({
    selector: "nui-chart-popover",
    templateUrl: "./chart-popover.component.html",
    styleUrls: ["./chart-popover.component.less"],
})
export class ChartPopoverComponent implements OnChanges, OnInit, OnDestroy {
    @Input() plugin: ChartPopoverPlugin;

    @Input() template: TemplateRef<any>;

    @Output() update = new EventEmitter<IDataPointsPayload>();

    @ViewChild(PopoverComponent) popover: PopoverComponent;

    private destroy$ = new Subject();
    private initPlugin$ = new Subject();

    constructor(
        private changeDetector: ChangeDetectorRef,
        public element: ElementRef
    ) {}

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.plugin && !changes.plugin.isFirstChange()) {
            this.initPlugin();
        }
    }

    public ngOnInit() {
        this.initPlugin();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.initPlugin$.complete();
    }

    private initPlugin() {
        this.initPlugin$.next();

        this.plugin?.openPopoverSubject
            .pipe(takeUntil(this.initPlugin$), takeUntil(this.destroy$))
            .subscribe(() => {
                this.changeDetector.markForCheck();
            });

        this.plugin?.updatePositionSubject
            .pipe(takeUntil(this.initPlugin$), takeUntil(this.destroy$))
            .subscribe((position: IElementPosition) => {
                this.popover?.resetSize();
                // calculating a width offset to position the popover's host element at the midpoint of the popover target
                const widthOffset = position.width / 2;
                this.element.nativeElement.style.left =
                    position.left + widthOffset + "px";
                this.element.nativeElement.style.top = position.top + "px";
                this.popover?.updatePosition();
                this.update.next(this.plugin?.dataPoints);
            });
    }
}
