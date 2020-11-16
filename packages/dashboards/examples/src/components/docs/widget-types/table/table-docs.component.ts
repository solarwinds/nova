import { Component } from "@angular/core";

@Component({
    selector: "nui-table-docs",
    templateUrl: "./table-docs.component.html",
})
export class TableDocsComponent {

    public widgetFileText = require("!!raw-loader!../../../../../../src/lib/widget-types/table/table-widget.ts").default;
    public configuratorFileText = require("!!raw-loader!../../../../../../src/lib/widget-types/table/table-configurator.ts").default;

}
