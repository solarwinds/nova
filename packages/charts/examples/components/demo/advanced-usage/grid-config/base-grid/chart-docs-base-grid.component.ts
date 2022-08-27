import { Component } from "@angular/core";

import { XYGridConfig } from "@nova-ui/charts";

@Component({
    selector: "nui-chart-docs-base-grid",
    templateUrl: "./chart-docs-base-grid.component.html",
})
export class ChartDocsBaseGridComponent {
    public gridInstantiation = `const gridConfig = new XYGridConfig();
gridConfig.dimension.padding.left = 20;
this.chart = new Chart(new XYGrid(gridConfig));
...`;
    public gridReconfiguration = `const gridConfig = new XYGridConfig();
gridConfig.dimension.padding.left = 20;
this.chart.getGrid().config(gridConfig);
...`;
    public defaultMargins = XYGridConfig.DEFAULT_MARGIN;
}
