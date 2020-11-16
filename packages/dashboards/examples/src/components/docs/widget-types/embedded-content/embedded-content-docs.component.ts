import { Component } from "@angular/core";

@Component({
    selector: "nui-embedded-content-docs",
    templateUrl: "./embedded-content-docs.component.html",
})
export class EmbeddedContentDocsComponent {

    public embeddedContentWidgetFileText = require("!!raw-loader!../../../../../../src/lib/widget-types/embedded-content/embedded-content-widget.ts").default;
    // tslint:disable-next-line:max-line-length
    public embeddedContentConfiguratorFileText = require("!!raw-loader!../../../../../../src/lib/widget-types/embedded-content/embedded-content-configurator.ts").default;
}
