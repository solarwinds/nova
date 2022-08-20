import { Component } from "@angular/core";

@Component({
    selector: "nui-kpi-docs",
    templateUrl: "./kpi-docs.component.html",
})
export class KpiDocsComponent {
    public kpiWidgetFileText =
        require("!!raw-loader!../../../../../../src/lib/widget-types/kpi/kpi-widget.ts")
            .default;
    public kpiConfiguratorFileText =
        require("!!raw-loader!../../../../../../src/lib/widget-types/kpi/kpi-configurator.ts")
            .default;
}
