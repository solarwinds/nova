import { Component } from "@angular/core";

@Component({
    selector: "nui-proportional-docs",
    templateUrl: "./proportional-docs.component.html",
})
export class ProportionalDocsComponent {
    public proportionalWidgetFileText =
        require("!!raw-loader!../../../../../../src/lib/widget-types/proportional/proportional-widget.ts")
            .default;
    public proportionalConfiguratorFileText =
        require("!!raw-loader!../../../../../../src/lib/widget-types/proportional/proportional-configurator.ts")
            .default;
}
