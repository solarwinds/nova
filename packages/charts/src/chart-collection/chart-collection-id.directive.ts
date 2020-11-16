import { AfterViewInit, Directive, Inject, Input } from "@angular/core";

import { CHART_COMPONENT } from "../constants";
import { IChartComponent } from "../core/common/types";

import { ChartCollectionService } from "./chart-collection.service";

/**
 * This directive represents a grouping behavior that is separated from chart components. Any chart component
 * registering the CHART_COMPONENT provider can be injected into this.
 *
 * A group of charts with the same associated chart collection id will share events broadcasted through their event buses.
 */
@Directive({
    selector: "[nuiChartCollectionId]",
})
export class ChartCollectionIdDirective implements AfterViewInit {
    /* tslint:disable-next-line:no-input-rename */
    @Input("nuiChartCollectionId")
    public collectionId: string;

    constructor(@Inject(CHART_COMPONENT) private chartComponent: IChartComponent,
                private chartCollectionService: ChartCollectionService) {
    }

    public ngAfterViewInit(): void {
        this.chartCollectionService.getChartCollection(this.collectionId).addChart(this.chartComponent.chart);
    }
}
