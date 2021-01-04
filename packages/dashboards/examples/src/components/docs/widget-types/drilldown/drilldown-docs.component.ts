import { Component } from "@angular/core";

@Component({
    selector: "nui-drilldown-docs",
    templateUrl: "./drilldown-docs.component.html",
})
export class DrilldownDocsComponent {
    public widgetFileText = require("!!raw-loader!../../../../../../src/lib/widget-types/drilldown/drilldown-widget.ts").default;
    public configuratorFileText = require("!!raw-loader!../../../../../../src/lib/widget-types/drilldown/drilldown-configurator").default;
    public predefinedGroping = `
listWidget: {
    providers: {
        [WellKnownProviders.Adapter]: {
            providerId: NOVA_DRILLDOWN_DATASOURCE_ADAPTER,
            properties: {
                ...
                // adapter props
                drillstate: [],
                groupBy: ["regionName", "subregionName"],
                groups: ["regionName", "subregionName"],
                ...
            },
        },
    },
},
`;
}
