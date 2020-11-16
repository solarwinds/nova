import { Component } from "@angular/core";

@Component({
    selector: "nui-timeseries-docs",
    templateUrl: "./timeseries-docs.component.html",
})
export class TimeseriesDocsComponent {

    public timeseriesWidgetFileText = require("!!raw-loader!../../../../../../src/lib/widget-types/timeseries/timeseries-widget.ts").default;
    public timeseriesConfiguratorFileText = require("!!raw-loader!../../../../../../src/lib/widget-types/timeseries/timeseries-configurator.ts").default;

}
