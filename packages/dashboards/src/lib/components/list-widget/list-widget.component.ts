import { CdkDrag } from "@angular/cdk/drag-drop";
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ContentChildren,
    ElementRef,
    HostBinding,
    Inject,
    Input,
    NgZone,
    OnChanges,
    OnDestroy,
    OnInit,
    QueryList,
    SimpleChanges,
    ViewChild,
} from "@angular/core";
import { EventBus, IEvent, RepeatComponent, RepeatItemComponent, ResizeObserverDirective } from "@nova-ui/bits";
import { Subject } from "rxjs";
import { filter, takeUntil, tap } from "rxjs/operators";

import { mapDataToFormatterProperties } from "../../functions/map-data-to-formatter-properties";
import { IHasChangeDetector, PIZZAGNA_EVENT_BUS } from "../../types";

import { IListWidgetConfiguration } from "./types";

const RESIZE_DEBOUNCE_TIME = 10;

@Component({
    selector: "nui-list-widget",
    templateUrl: "./list-widget.component.html",
    styleUrls: ["./list-widget.component.less"],
    host: {style: "overflow: scroll; height: 100%"},
})
export class ListWidgetComponent implements OnDestroy, OnInit, IHasChangeDetector, OnChanges, AfterViewInit {
    static lateLoadKey = "ListWidgetComponent";

    @Input() public data: any[];
    @Input() public configuration: IListWidgetConfiguration;
    @Input() @HostBinding("class") public elementClass: string;
    // 70 px stands for widget header and margins
    @Input() public indentFromTop: number = 70;
    @Input() public virtualScroll: boolean = true;
    @Input() itemSize: number = 32;

    @ViewChild(RepeatComponent) public repeat: RepeatComponent;
    @ContentChildren(RepeatItemComponent) public repeatItems: QueryList<RepeatItemComponent>;

    private itemFormatterProps = new Map();
    private destroy$: Subject<void> = new Subject();
    private widgetWidth: number;

    constructor(public changeDetector: ChangeDetectorRef,
                private zone: NgZone,
                private host: ElementRef,
        @Inject(PIZZAGNA_EVENT_BUS) private eventBus: EventBus<IEvent>) {
    }

    ngOnInit() {
        this.initResizeObserver();
    }

    ngAfterViewInit() {
        this.repeat?.draggableElements?.changes.pipe(
            takeUntil(this.destroy$),
            tap((data: QueryList<CdkDrag>) => console.log(">>> data", data)),
            tap((data: QueryList<CdkDrag>) => console.log(">>> BEFORE data height", data.first.element.nativeElement.getBoundingClientRect().height)),
            tap((data: QueryList<CdkDrag>) => console.log(">>> el", data.first.element.nativeElement)),
            filter((data: any) => {
                const height = data.first.element.nativeElement.getBoundingClientRect().height;
                return height && height !== this.itemSize;
            }),
            tap((data: QueryList<CdkDrag>) => {
                this.itemSize = data.first.element.nativeElement.getBoundingClientRect().height;
                this.changeDetector.detectChanges();
            }),
            tap((data: QueryList<CdkDrag>) => this.repeat?.viewportRef.checkViewportSize())
        )
        .subscribe();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.data?.currentValue) {
            changes.data.currentValue.forEach((v: any) => this.itemFormatterProps.set(v, this.calcItemProps(v)));
        }
    }

    // TODO: think of how to get rid of this logic on listWidget
    // since it's very specific for drilldown and appstack
    onListItemEvent(item: any) {
        this.eventBus.getStream(DRILLDOWN).next({ payload: item });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.itemFormatterProps.clear();
    }

    public getPropsFor(item: any) {
        return {
            ...this.itemFormatterProps.get(item),
            widgetWidth: this.widgetWidth,
        };
    }

    private calcItemProps(item: any) {
        if (!this.configuration) {
            return item;
        }
        return {...mapDataToFormatterProperties(this.configuration, item), ...this.configuration.itemProperties};
    }

    // think of using eventBus to let widget entities know about it's width. - mb some formatters for widget doesn't care about it's width.
    private initResizeObserver() {
        const resizeDirective = new ResizeObserverDirective(this.host, this.zone);
        resizeDirective.debounceTime = RESIZE_DEBOUNCE_TIME;
        resizeDirective.ngAfterViewInit();

        resizeDirective.containerResize.pipe(
            takeUntil(this.destroy$)
        ).subscribe(() => {
            this.widgetWidth = this.host.nativeElement.offsetWidth;
        });
    }
}
