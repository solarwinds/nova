import { Component } from "@angular/core";

@Component({
    selector: "nui-proportional-donut-content-docs",
    templateUrl: "./proportional-donut-content-docs.component.html",
})
export class ProportionalDonutContentDocsComponent {
    public dataSourceDataFieldsConfig = `
public dataFieldsConfig: IProportionalDataFieldsConfig = {
    dataFields$: new BehaviorSubject<IDataField[]>(this.dataFields),
    chartSeriesDataFields$: new BehaviorSubject<IDataField[]>(this.chartSeriesDataFields),
};
    `;

    public widgetConfigSlice = `
"properties": {
    "configuration": {
        "chartOptions": {
            donutContentConfig: {
                formatter: {
                    componentType: SiUnitsFormatterComponent.lateLoadKey,
                },
                aggregator: {
                    aggregatorType: sumAggregator.aggregatorType,
                },
            },
        }
    }
}

    `;

}
