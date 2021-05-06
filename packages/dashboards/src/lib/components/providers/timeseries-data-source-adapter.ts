import { Inject } from "@angular/core";
import { EventBus, IDataSource, IEvent, IFilteringOutputs } from "@nova-ui/bits";
import clone from "lodash/clone";

import { PizzagnaService } from "../../pizzagna/services/pizzagna.service";
import { DATA_SOURCE, PIZZAGNA_EVENT_BUS } from "../../types";
import { ITimeseriesWidgetData, ITimeseriesWidgetSeries } from "../timeseries-widget/types";

import { DataSourceAdapter } from "./data-source-adapter";
import { ITimeseriesDataSourceAdapterConfiguration } from "./types";

export class TimeseriesDataSourceAdapter extends DataSourceAdapter {
    private seriesIndex: ITimeseriesWidgetSeries[] = [];

    constructor(@Inject(PIZZAGNA_EVENT_BUS) eventBus: EventBus<IEvent>,
        @Inject(DATA_SOURCE) dataSource: IDataSource,
                                            pizzagnaService: PizzagnaService) {
        super(eventBus, dataSource, pizzagnaService);
    }

    public updateConfiguration(properties: ITimeseriesDataSourceAdapterConfiguration) {
        this.seriesIndex = clone(properties.series);

        super.updateConfiguration(properties);
    }

    protected processOutput(value: IFilteringOutputs): IFilteringOutputs {
        if (!value) {
            return value;
        }
        return {
            ...value,
            series: this.buildSeriesSet(value?.series),
        };
    }

    /**
     * Builds the series set by mapping the series selected in the configurator to the data received from the data source.
     * @param data
     */
    private buildSeriesSet(data: ITimeseriesWidgetData[]) {
        if (!data) {
            return [];
        }

        // displaying only series which are in widget config
        return data
            .filter((series: ITimeseriesWidgetData) => this.seriesIndex.find(s => s.selectedSeriesId === series.id))
            .map((series: ITimeseriesWidgetData) => ({
                id: series.id,
                data: series.data,
                link: series.link,
                secondaryLink: series.secondaryLink,
                legendDescriptionPrimary: this.seriesIndex.find(s => s.selectedSeriesId === series.id)?.label,
                legendDescriptionSecondary: series.description,
            }));
    }
}
