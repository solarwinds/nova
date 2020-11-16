import { Component } from "@angular/core";

@Component({
    selector: "nui-chart-docs-bar",
    templateUrl: "./chart-docs-bar.component.html",
})
export class ChartDocsBarComponent {
    public horizontalConfig = `public config = { horizontal: true } as IBarChartConfig;
...
... barGrid(this.config) ...
... barScales(this.config) ...
... barAccessors(this.config) ...`;
}
