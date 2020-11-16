import isEmpty from "lodash/isEmpty";
import { Subject, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { INTERACTION_COORDINATES_EVENT, INTERACTION_VALUES_ACTIVE_EVENT, INTERACTION_VALUES_EVENT, MOUSE_ACTIVE_EVENT } from "../../constants";
import { ChartPlugin } from "../common/chart-plugin";
import { MouseInteractiveArea } from "../common/mouse-interactive-area";
import { IInteractionEvent, InteractionType } from "../common/types";
import { UtilityService } from "../common/utility.service";

import { IInteractionValues } from "./types";

/** @ignore */
export class MouseInteractiveAreaPlugin extends ChartPlugin {
    private destroy$ = new Subject();
    private interactionValuesActive = true;

    constructor(private mouseInteractiveArea: MouseInteractiveArea) {
        super();
    }

    public initialize(): void {
        this.mouseInteractiveArea.active.pipe(takeUntil(this.destroy$)).subscribe((active: boolean) => {
            this.chart.getEventBus().getStream(MOUSE_ACTIVE_EVENT).next({ data: active });
        });

        this.chart.getEventBus().getStream(MOUSE_ACTIVE_EVENT)
            .pipe(takeUntil(this.destroy$))
            .subscribe((event) => {
                const active: boolean = event.data;
                if (!active && this.chart.getDataManager().chartSeriesSet) {
                    this.highlightReset();
                }
            });

        this.chart.getEventBus().getStream(INTERACTION_VALUES_ACTIVE_EVENT)
            .pipe(takeUntil(this.destroy$))
            .subscribe((event) => this.interactionValuesActive = event.data);

        this.mouseInteractiveArea.interaction
            .pipe(takeUntil(this.destroy$))
            .subscribe((event: IInteractionEvent) => {
                const gridScales = this.chart.getGrid().scales;
                if (isEmpty(gridScales)) {
                    return;
                }

                if (this.interactionValuesActive) {
                    const xScales = gridScales.x.list;
                    const yScales = gridScales.y.list;
                    const xCoordinate = event.coordinates.x;
                    const yCoordinate = event.coordinates.y;

                    const values: IInteractionValues = UtilityService.getXYValues(xScales, yScales, xCoordinate, yCoordinate);
                    this.chart.getEventBus().getStream(INTERACTION_VALUES_EVENT).next({ data: { interactionType: event.type, values } });
                }

                this.chart.getEventBus().getStream(INTERACTION_COORDINATES_EVENT).next({
                    data: { interactionType: event.type, coordinates: event.coordinates },
                });
            });
    }

    public update() {
        this.highlightReset();
    }

    public updateDimensions(): void {
        this.highlightReset();
    }

    public destroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private highlightReset() {
        this.chart.getEventBus().getStream(INTERACTION_VALUES_EVENT).next({ data: { interactionType: InteractionType.MouseMove, values: {} } });
    }
}
