import { Component } from "@angular/core";

@Component({
    selector: "nui-cartesian-docs",
    templateUrl: "./cartesian-docs.component.html",
    styleUrls: ["./cartesian-docs.component.css"],
})
export class CartesianDocsComponent {
    public cartesianWidgetFileText =
        require("!!raw-loader!../../../../../../../src/lib/widget-types/cartesian/cartesian-widget.ts")
            .default;
    public cartesianConfiguratorFileText =
        require("!!raw-loader!../../../../../../../src/lib/widget-types/cartesian/cartesian-configurator.ts").default
}
