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
    Component,
    ElementRef,
    Inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
} from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { EventBus, IEvent, IEventDefinition } from "@nova-ui/bits";
import {
    TimeseriesZoomPlugin,
    TimeseriesZoomPluginsSyncService,
    ITimeseriesZoomPluginInspectionFrame,
} from "@nova-ui/charts";
import { PIZZAGNA_EVENT_BUS } from "../../../types";
import moment from "moment/moment";

export const TIMESERIES_INSPECTION_MENU_ZOOM_IN: IEventDefinition<
    IEvent<ITimeseriesZoomPluginInspectionFrame>
> = {
    id: "TIMESERIES_INSPECTION_MENU_ZOOM_IN",
};

export const TIMESERIES_INSPECTION_MENU_ZOOM_OUT: IEventDefinition<
    IEvent<ITimeseriesZoomPluginInspectionFrame>
> = {
    id: "TIMESERIES_INSPECTION_MENU_ZOOM_OUT",
};

export const TIMESERIES_INSPECTION_MENU_EXPLORE: IEventDefinition<
    IEvent<ITimeseriesZoomPluginExploreData>
> = {
    id: "TIMESERIES_INSPECTION_MENU_EXPLORE",
};

export const TIMESERIES_INSPECTION_MENU_CLOSE: IEventDefinition<IEvent<void>> =
    {
        id: "TIMESERIES_INSPECTION_MENU_CLOSE",
    };

export const TIMESERIES_INSPECTION_MENU_SYNCHRONIZE: IEventDefinition<
    IEvent<void>
> = {
    id: "TIMESERIES_INSPECTION_MENU_SYNCHRONIZE",
};

export interface ITimeseriesZoomPluginExploreData {
    ids: string;
    startDate: moment.Moment;
    endDate: moment.Moment;
    openSidePanel: boolean;
    exploringEnabled: boolean;
}

@Component({
    selector: "nui-timeseries-inspection-menu",
    templateUrl: "./timeseries-inspection-menu.component.html",
    styleUrls: ["./timeseries-inspection-menu.component.less"],
})
export class TimeseriesInspectionMenuComponent
    implements OnInit, OnChanges, OnDestroy
{
    @Input() plugin: TimeseriesZoomPlugin;
    @Input() exploringEnabled = false;
    @Input() metricIds?: string;
    @Input() collectionId?: string;
    @Input() allowed?: boolean = false;

    private offset = 38;
    private destroy$ = new Subject<void>();

    constructor(
        public element: ElementRef,
        @Inject(PIZZAGNA_EVENT_BUS) private eventBus: EventBus<IEvent>,
        private syncService: TimeseriesZoomPluginsSyncService
    ) {}
    public ngOnInit() {
        this.plugin.zoomCreated$.subscribe(() => this.explore(false));

        this.eventBus
            .getStream(TIMESERIES_INSPECTION_MENU_SYNCHRONIZE)
            .subscribe(() => {
                const { startDate, endDate } = this.plugin.getInspectionFrame();
                if (startDate && endDate) {
                    this.syncService.syncPositionInsideCollection(
                        this.collectionId ?? "",
                        startDate,
                        endDate
                    );
                }
            });

        this.plugin?.openPopover$
            .pipe(takeUntil(this.destroy$))
            .subscribe((x: number) => {
                // moves element to the correct position
                this.element.nativeElement.style.left = this.offset + x + "px";
            });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.allowed?.currentValue) {
            this.plugin.showPopover();
        } else {
            this.plugin.closePopover();
        }
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public clearZoom(): void {
        this.syncService.clearZoomInsideCollection(this.collectionId ?? "");
        this.eventBus.next(TIMESERIES_INSPECTION_MENU_CLOSE, {});
    }

    public isZoomInAllowed(): boolean {
        const { startDate, endDate } = this.plugin.getInspectionFrame();

        if (!startDate || !endDate) {
            return true;
        }

        // doesn't allow zoom for timeframe smaller than 10 minutes
        return endDate.diff(startDate, "minutes") > 10;
    }

    public zoomIn(): void {
        const inspectionTimeframe = this.plugin.getInspectionFrame();
        this.eventBus.next(TIMESERIES_INSPECTION_MENU_ZOOM_IN, {
            payload: inspectionTimeframe,
        });
        this.syncService.clearZoomInsideCollection(this.collectionId ?? "");
    }

    public zoomOut(): void {
        const inspectionTimeframe = this.plugin.getInspectionFrame();
        this.eventBus.next(TIMESERIES_INSPECTION_MENU_ZOOM_OUT, {
            payload: inspectionTimeframe,
        });
        setTimeout(() => {
            this.plugin.closePopover();
        });
    }

    public explore(openSidePanel = false): void {
        const inspectionTimeframe = this.plugin.getInspectionFrame();
        this.eventBus.next(TIMESERIES_INSPECTION_MENU_EXPLORE, {
            payload: {
                ids: this.metricIds,
                startDate: inspectionTimeframe.startDate,
                endDate: inspectionTimeframe.endDate,
                openSidePanel,
                exploringEnabled: this.exploringEnabled,
            },
        });
    }
}
