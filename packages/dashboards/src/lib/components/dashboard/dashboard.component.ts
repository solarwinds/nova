import { KeyValue } from "@angular/common";
import { Component, EventEmitter, HostBinding, Inject, Input, OnChanges, Output, SimpleChanges, ViewEncapsulation } from "@angular/core";
import { EventBus, immutableSet } from "@solarwinds/nova-bits";
import { GridsterConfig, GridsterItem, GridsterItemComponentInterface } from "angular-gridster2";
import _defaultsDeep from "lodash/defaultsDeep";

import { DASHBOARD_EDIT_MODE, WIDGET_POSITION_CHANGE, WIDGET_RESIZE } from "../../services/types";
import { IWidgetEvent } from "../../services/widget-to-dashboard-event-proxy.service";
import { DASHBOARD_EVENT_BUS, IDashboard, IWidget } from "../../types";

import { DEFAULT_GRIDSTER_CONFIG } from "./default-gridster-config";

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
export class DashboardComponent implements OnChanges {
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

    @Output() gridsterConfigChange = new EventEmitter<GridsterConfig>();
    @Output() dashboardChange = new EventEmitter<IDashboard>();

    @HostBinding("class.nui-dashboard")
    get hostClass() {
        return true;
    }

    constructor(@Inject(DASHBOARD_EVENT_BUS) public readonly eventBus: EventBus<IWidgetEvent>) {
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.gridsterConfig) {
            if (changes.gridsterConfig.isFirstChange()) {
                const gridsterConfig = _defaultsDeep(this.gridsterConfig || {}, DEFAULT_GRIDSTER_CONFIG);

                this.hookEvent(gridsterConfig, "itemChangeCallback", this.updateWidgetPosition);
                this.hookEvent(gridsterConfig, "itemResizeCallback", this.emitWidgetResize);

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


            this.gridsterConfigChange.emit(Object.assign({}, this.gridsterConfig));

            this.eventBus.getStream(DASHBOARD_EDIT_MODE).next({ payload: this.editMode });
        }

        // TODO: position doesn't update on external change of position
        // if (!changes.dashboard.isFirstChange() &&
        //     changes.dashboard.currentValue.positions !== changes.dashboard.previousValue.positions) {
        //     if (this.gridsterConfig.api) {
        //         this.gridsterConfig.api.optionsChanged();
        //     }
        // }
    }

    public orderWidgets = (a: KeyValue<string, IWidget>, b: KeyValue<string, IWidget>): number => {
        const nextWidget = this.dashboard.positions[a.key];
        const currentWidget = this.dashboard.positions[b.key];

        return nextWidget.y - currentWidget.y || nextWidget.x - currentWidget.x;
    }

    public trackByFn = (index: number, item: KeyValue<string, IWidget>) => item.key;

    public onWidgetChange(widget: IWidget) {
        // this could happen when changes are being made on a widget that is being removed
        if (!this.dashboard.widgets[widget.id]) {
            return;
        }
        this.updateWidget(widget);
    }

    public updateWidget(widget: IWidget) {
        let dashboard: IDashboard = this.dashboard;
        if (!this.dashboard.positions[widget.id] && this.gridsterConfig?.api) {
            const gridsterItem = this.gridsterConfig.api.getFirstPossiblePosition?.({
                x: 0,
                y: 0,
                rows: this.gridsterConfig?.defaultItemRows as number,
                cols: this.gridsterConfig?.defaultItemCols as number,
            });
            dashboard = immutableSet(dashboard, `positions.${widget.id}`, gridsterItem);
        }

        dashboard = immutableSet(dashboard, `widgets.${widget.id}`, widget);
        this.dashboardBuffer = dashboard;
        this.dashboardChange.emit(dashboard);
    }

    public removeWidget(widgetId: string, removePosition = true) {
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

    private updateWidgetPosition = (item: GridsterItem, itemComponent: GridsterItemComponentInterface): void => {
        const widgetId = (itemComponent as any).widgetId;
        const dashboard = immutableSet(this.dashboard, "positions." + widgetId, item);

        this.dashboardChange.emit(dashboard);

        this.eventBus.getStream(WIDGET_POSITION_CHANGE).next({
            widgetId: widgetId,
            payload: item,
        });
    }

    private emitWidgetResize = (item: GridsterItem, itemComponent: GridsterItemComponentInterface): void => {
        const widgetId = (itemComponent as any).widgetId;

        this.eventBus.getStream(WIDGET_RESIZE).next({
            widgetId: widgetId,
            payload: { widgetId: widgetId, height: itemComponent.height, width: itemComponent.width },
        });
    }

    private hookEvent(options: GridsterConfig, eventName: string, invoke: (item: GridsterItem, itemComponent: GridsterItemComponentInterface) => void) {
        const prevEvent = options[eventName];
        options[eventName] = (item: GridsterItem, itemComponent: GridsterItemComponentInterface) => {
            invoke(item, itemComponent);

            if (prevEvent) {
                prevEvent(item, itemComponent);
            }
        };
    }
}
