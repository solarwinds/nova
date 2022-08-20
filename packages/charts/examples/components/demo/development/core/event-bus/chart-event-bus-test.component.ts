import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewEncapsulation,
} from "@angular/core";
import { LoggerService } from "@nova-ui/bits";
import {
    Chart,
    ChartAssist,
    HIGHLIGHT_DATA_POINT_EVENT,
    IAccessors,
    IChart,
    IChartAssistSeries,
    IChartEvent,
    InteractionType,
    INTERACTION_DATA_POINTS_EVENT,
    INTERACTION_SERIES_EVENT,
    INTERACTION_VALUES_EVENT,
    LineAccessors,
    LinearScale,
    LineRenderer,
    LineSelectSeriesInteractionStrategy,
    MOUSE_ACTIVE_EVENT,
    Scales,
    TimeScale,
    XYGrid,
    XYGridConfig,
} from "@nova-ui/charts";
import cloneDeep from "lodash/cloneDeep";
import each from "lodash/each";
import includes from "lodash/includes";

import { DataGenerator } from "../../../../../data-generator";

/**
 * This is here just to test a prototype of angular component, that will use new chart core
 *
 * @ignore
 */
@Component({
    selector: "nui-chart-event-bus-test",
    templateUrl: "./chart-event-bus-test.component.html",
    encapsulation: ViewEncapsulation.Emulated,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartEventBusTestComponent implements OnInit {
    public parsedEvents: string[] = [];
    public eventFilters = [
        MOUSE_ACTIVE_EVENT,
        INTERACTION_VALUES_EVENT,
        INTERACTION_DATA_POINTS_EVENT,
        HIGHLIGHT_DATA_POINT_EVENT,
        INTERACTION_SERIES_EVENT,
    ];
    public interactionTypeFilters = [
        InteractionType.Click,
        InteractionType.MouseMove,
    ];
    public selectedEventFilters: string[];
    public selectedInteractionTypeFilters: InteractionType[];

    public chart: IChart;
    public chartAssist: ChartAssist;

    public isEventFilterChecked(filter: string): boolean {
        return this.selectedEventFilters.indexOf(filter) > -1;
    }

    public onEventFilterChange(filters: string[]) {
        this.selectedEventFilters = filters;
    }

    public isInteractionTypeFilterChecked(filter: InteractionType): boolean {
        return this.selectedInteractionTypeFilters.indexOf(filter) > -1;
    }

    public onInteractionTypeFilterChange(filters: InteractionType[]) {
        this.selectedInteractionTypeFilters = filters;
    }

    constructor(
        private logger: LoggerService,
        private changeDetector: ChangeDetectorRef
    ) {}

    ngOnInit() {
        const gridConfig = new XYGridConfig();
        gridConfig.cursor = "pointer";
        this.chart = new Chart(new XYGrid(gridConfig));
        this.chartAssist = new ChartAssist(this.chart);

        this.selectAllFilters();
        this.chartAssist.update(this.generateDataSeriesSet(2));

        each(this.eventFilters, (eventName) => {
            this.chart
                .getEventBus()
                .getStream(eventName)
                .subscribe((event: IChartEvent) => {
                    if (includes(this.selectedEventFilters, eventName)) {
                        if (
                            !event.data.interactionType ||
                            includes(
                                this.selectedInteractionTypeFilters,
                                event.data.interactionType
                            )
                        ) {
                            this.logger.info(
                                "EVENT:",
                                eventName,
                                "DATA:",
                                event.data
                            );
                            this.parsedEvents.unshift(
                                `Event: "${eventName}" Data: ${JSON.stringify(
                                    event.data
                                )}`
                            );
                            this.parsedEvents = this.parsedEvents.slice(0, 10);
                            this.changeDetector.markForCheck();
                        }
                    }
                });
        });
    }

    public selectAllFilters() {
        this.selectedEventFilters = cloneDeep(this.eventFilters);
        this.selectedInteractionTypeFilters = cloneDeep(
            this.interactionTypeFilters
        );
    }

    public deselectAllFilters() {
        this.selectedEventFilters = [];
        this.selectedInteractionTypeFilters = [];
    }

    private generateDataSeriesSet(
        dataSeriesCount: number
    ): IChartAssistSeries<IAccessors>[] {
        const seriesSet = DataGenerator.generateMockTimeLineSeriesSet(
            dataSeriesCount,
            40
        );
        const scales: Scales = {
            x: new TimeScale(),
            y: new LinearScale(),
        };
        const renderer = new LineRenderer({
            interactionStrategy: new LineSelectSeriesInteractionStrategy(),
        });
        const accessors = new LineAccessors();

        return seriesSet.map((dataSeries) => ({
            ...dataSeries,
            scales,
            renderer,
            accessors,
        }));
    }
}
