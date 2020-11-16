import { Component } from "@angular/core";

@Component({
    selector: "nui-chart-docs-tooltips",
    templateUrl: "./chart-docs-tooltips.component.html",
})
export class ChartDocsTooltipsComponent {
    public tooltipsTypeScript = `this.tooltipsPlugin = new ChartTooltipsPlugin();
this.chart.addPlugin(this.tooltipsPlugin);
...`;
    public tooltipsHtml = `...
<nui-chart-tooltips [plugin]="tooltipsPlugin" [template]="tooltipTemplate"></nui-chart-tooltips>

<ng-template let-dataPoint="dataPoint"
             #tooltipTemplate>
    <div class="p-1 d-flex align-items-center">
        <nui-chart-marker [marker]="chartAssist.markers.get(dataPoint.seriesId)"
                          [color]="chartAssist.palette.standardColors.get(dataPoint.seriesId)"></nui-chart-marker>
        <span class="pl-2">{{dataPoint.data.y}}</span>
    </div>
</ng-template>
...`;
}
