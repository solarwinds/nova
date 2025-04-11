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

import { KeyValue } from "@angular/common";
import {
    AfterViewInit,
    Component,
    EventEmitter,
    HostBinding,
    Inject,
    Input,
    OnChanges,
    Output,
    QueryList,
    SimpleChanges,
    ViewChild,
    ViewChildren,
    ViewEncapsulation,
} from "@angular/core";
import {
    GridsterComponent,
    GridsterConfig,
    GridsterItem,
    GridsterItemComponent,
    GridsterItemComponentInterface,
} from "angular-gridster2";
import _defaultsDeep from "lodash/defaultsDeep";

import { EventBus, immutableSet } from "@nova-ui/bits";

import { DEFAULT_GRIDSTER_CONFIG } from "./default-gridster-config";
import { IDashboard, IDashboardBelowFoldLazyLoadingConfig } from "./types";
import {
    DASHBOARD_EDIT_MODE,
    WIDGET_POSITION_CHANGE,
    WIDGET_RESIZE,
} from "../../services/types";
import { IWidgetEvent } from "../../services/widget-to-dashboard-event-proxy.service";
import { DASHBOARD_EVENT_BUS } from "../../types";
import { IWidget } from "../widget/types";

@Component({
    selector: "nui-dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.less"],
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: DASHBOARD_EVENT_BUS,
            useClass: EventBus,
        },
    ],
})
export class DashboardComponent implements OnChanges, AfterViewInit {
    @Input() gridsterConfig: GridsterConfig;

    @Input()
    get dashboard(): IDashboard {
        return this.dashboardBuffer || this._dashboard;
    }

    set dashboard(value: IDashboard) {
        this._dashboard = value;
        this.dashboardBuffer = null;
    }

    private _dashboard: IDashboard;
    // we use this buffer to store temporary values when cumulative changes are necessary before two-way binding kicks in
    public dashboardBuffer: IDashboard | null;

    @Input() editMode = false;
    @Input()
    public belowFoldLazyLoadingConfig: IDashboardBelowFoldLazyLoadingConfig;

    @Output() gridsterConfigChange = new EventEmitter<GridsterConfig>();
    @Output() dashboardChange = new EventEmitter<IDashboard>();

    @HostBinding("class.nui-dashboard")
    get hostClass(): boolean {
        return true;
    }

    @ViewChild(GridsterComponent)
    public gridster: GridsterComponent;

    @ViewChildren(GridsterItemComponent)
    public gridsterItems: QueryList<GridsterItemComponent>;

    public gridsterItemsVisibilityMap: Record<string, boolean> = {};

    constructor(
        @Inject(DASHBOARD_EVENT_BUS)
        public readonly eventBus: EventBus<IWidgetEvent>
    ) {}

    public ngAfterViewInit(): void {
        // need to wait till DOM is rendered because of "getBoundingClientRect" under the hood
        setTimeout(() => this.calculateWidgetsVisibility());
    }

    public onGridsterScroll(): void {
        this.calculateWidgetsVisibility();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.gridsterConfig) {
            if (changes.gridsterConfig.isFirstChange()) {
                const gridsterConfig = _defaultsDeep(
                    this.gridsterConfig || {},
                    DEFAULT_GRIDSTER_CONFIG
                );

                this.hookEvent(
                    gridsterConfig,
                    "itemChangeCallback",
                    this.updateWidgetPosition
                );
                this.hookEvent(
                    gridsterConfig,
                    "itemResizeCallback",
                    this.emitWidgetResize
                );

                this.gridsterConfigChange.emit(gridsterConfig);
            }

            if (this.gridsterConfig?.api) {
                this.gridsterConfig.api.optionsChanged?.();
            }
        }

        if (changes.editMode) {
            if (!this.gridsterConfig.resizable) {
                throw new Error(`Gridster's resizable prop is undefined`);
            }
            this.gridsterConfig.resizable.enabled = this.editMode;

            if (!this.gridsterConfig.draggable) {
                throw new Error(`Gridster's draggable prop is undefined`);
            }
            this.gridsterConfig.draggable.enabled = this.editMode;

            this.gridsterConfigChange.emit(
                Object.assign({}, this.gridsterConfig)
            );

            this.eventBus
                .getStream(DASHBOARD_EDIT_MODE)
                .next({ payload: this.editMode });
        }

        // TODO: position doesn't update on external change of position
        // if (!changes.dashboard.isFirstChange() &&
        //     changes.dashboard.currentValue.positions !== changes.dashboard.previousValue.positions) {
        //     if (this.gridsterConfig.api) {
        //         this.gridsterConfig.api.optionsChanged();
        //     }
        // }
    }

    public orderWidgets = (
        a: KeyValue<string, IWidget>,
        b: KeyValue<string, IWidget>
    ): number => {
        const nextWidget = this.dashboard.positions[a.key];
        const currentWidget = this.dashboard.positions[b.key];

        return nextWidget.y - currentWidget.y || nextWidget.x - currentWidget.x;
    };

    public trackByFn = (
        index: number,
        item: KeyValue<string, IWidget>
    ): string => item.key;

    public onWidgetChange(widget: IWidget): void {
        // this could happen when changes are being made on a widget that is being removed
        if (!this.dashboard.widgets[widget.id]) {
            return;
        }
        this.updateWidget(widget);
    }

    public updateWidget(widget: IWidget): void {
        let dashboard: IDashboard = this.dashboard;
        if (!this.dashboard.positions[widget.id] && this.gridsterConfig?.api) {
            const gridsterItem =
                this.gridsterConfig.api.getFirstPossiblePosition?.({
                    x: 0,
                    y: 0,
                    rows: this.gridsterConfig?.defaultItemRows as number,
                    cols: this.gridsterConfig?.defaultItemCols as number,
                });
            dashboard = immutableSet(
                dashboard,
                `positions.${widget.id}`,
                gridsterItem
            );
        }

        dashboard = immutableSet(dashboard, `widgets.${widget.id}`, widget);
        this.dashboardBuffer = dashboard;
        this.dashboardChange.emit(dashboard);
    }

    public removeWidget(widgetId: string, removePosition = true): void {
        let dashboard: IDashboard = this.dashboard;
        if (!dashboard.widgets[widgetId]) {
            return;
        }

        const widgetsClone = Object.assign({}, dashboard.widgets);
        delete widgetsClone[widgetId];
        dashboard = immutableSet(dashboard, "widgets", widgetsClone);

        if (removePosition) {
            const positionsClone = Object.assign({}, dashboard.positions);
            delete positionsClone[widgetId];
            dashboard = immutableSet(dashboard, "positions", positionsClone);
        }

        this.dashboardChange.emit(dashboard);
    }

    public shouldWidgetRender(key: string): boolean {
        return this.belowFoldLazyLoadingConfig?.enabled
            ? this.gridsterItemsVisibilityMap[key]
            : true;
    }

    private updateWidgetPosition = (
        item: GridsterItem,
        itemComponent: GridsterItemComponentInterface
    ): void => {
        const widgetId = String((itemComponent as any).widgetId);
        const dashboard = immutableSet(
            this.dashboard,
            "positions." + widgetId,
            item
        );

        this.dashboardChange.emit(dashboard);

        this.eventBus.getStream(WIDGET_POSITION_CHANGE).next({
            widgetId,
            payload: item,
        });
    };

    private emitWidgetResize = (
        item: GridsterItem,
        itemComponent: GridsterItemComponentInterface
    ): void => {
        const widgetId = (itemComponent as any).widgetId;

        this.eventBus.getStream(WIDGET_RESIZE).next({
            widgetId,
            payload: {
                widgetId,
                height: itemComponent.height,
                width: itemComponent.width,
            },
        });
    };

    private hookEvent(
        options: GridsterConfig,
        eventName: string,
        invoke: (
            item: GridsterItem,
            itemComponent: GridsterItemComponentInterface
        ) => void
    ) {
        const prevEvent = options[eventName];
        options[eventName] = (
            item: GridsterItem,
            itemComponent: GridsterItemComponentInterface
        ) => {
            invoke(item, itemComponent);

            if (prevEvent) {
                prevEvent(item, itemComponent);
            }
        };
    }

    private calculateWidgetsVisibility(): void {
        if (!this.belowFoldLazyLoadingConfig?.enabled) {
            return;
        }

        const gridsterRect: ClientRect =
            this.gridster.el.getBoundingClientRect();

        this.gridsterItemsVisibilityMap = this.gridsterItems.reduce(
            (acc: Record<string, boolean>, next) => {
                const { el } = next;
                const idx: string = (next as any).widgetId;

                // if widget is already loaded don't hide it
                if (
                    !this.belowFoldLazyLoadingConfig.configuration
                        ?.reloadWidgetsOnScroll
                ) {
                    const prevVisibility = acc[idx];
                    if (prevVisibility) {
                        return acc;
                    }
                }

                const rect: ClientRect = el.getBoundingClientRect();

                const getHeightVisibility = () =>
                    (rect.top > gridsterRect.top &&
                        rect.top < gridsterRect.bottom) ||
                    (rect.bottom > gridsterRect.top &&
                        rect.bottom < gridsterRect.bottom);

                const getWidthVisibility = () =>
                    (rect.left > gridsterRect.left &&
                        rect.left < gridsterRect.right) ||
                    (rect.right > gridsterRect.left &&
                        rect.right < gridsterRect.right);

                const isVisible = getHeightVisibility() && getWidthVisibility();

                acc[idx] = isVisible;

                return acc;
            },
            this.gridsterItemsVisibilityMap
        );
    }
}
