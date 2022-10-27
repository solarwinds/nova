// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostBinding,
    Inject,
    Input,
    NgZone,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
} from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { EventBus, IEvent, ResizeObserverDirective } from "@nova-ui/bits";

import { mapDataToFormatterProperties } from "../../functions/map-data-to-formatter-properties";
import { DRILLDOWN } from "../../services/types";
import { IHasChangeDetector, PIZZAGNA_EVENT_BUS } from "../../types";
import { IListWidgetConfiguration } from "./types";

const RESIZE_DEBOUNCE_TIME = 10;

@Component({
    selector: "nui-list-widget",
    templateUrl: "./list-widget.component.html",
    styleUrls: ["./list-widget.component.less"],
    host: { style: "overflow: scroll" },
})
export class ListWidgetComponent
    implements OnDestroy, OnInit, IHasChangeDetector, OnChanges
{
    static lateLoadKey = "ListWidgetComponent";

    @Input() public data: any[];
    @Input() public configuration: IListWidgetConfiguration;
    @Input() @HostBinding("class") public elementClass: string;

    private itemFormatterProps = new Map();
    private destroy$: Subject<void> = new Subject();
    private widgetWidth: number;

    constructor(
        public changeDetector: ChangeDetectorRef,
        private zone: NgZone,
        private host: ElementRef,
        @Inject(PIZZAGNA_EVENT_BUS) private eventBus: EventBus<IEvent>
    ) {}

    ngOnInit() {
        this.initResizeObserver();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.data?.currentValue) {
            changes.data.currentValue.forEach((v: any) =>
                this.itemFormatterProps.set(v, this.calcItemProps(v))
            );
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
        return {
            ...mapDataToFormatterProperties(this.configuration, item),
            ...this.configuration.itemProperties,
        };
    }

    // think of using eventBus to let widget entities know about it's width. - mb some formatters for widget doesn't care about it's width.
    private initResizeObserver() {
        const resizeDirective = new ResizeObserverDirective(
            this.host,
            this.zone
        );
        resizeDirective.debounceTime = RESIZE_DEBOUNCE_TIME;
        resizeDirective.ngAfterViewInit();

        resizeDirective.containerResize
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.widgetWidth = this.host.nativeElement.offsetWidth;
            });
    }
}
