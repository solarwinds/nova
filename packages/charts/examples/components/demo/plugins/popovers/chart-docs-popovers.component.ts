import { Component } from "@angular/core";

@Component({
    selector: "nui-chart-docs-popovers",
    templateUrl: "./chart-docs-popovers.component.html",
})
export class ChartDocsPopoversComponent {
    public popoverTypeScript = `this.popoverPlugin = new ChartPopoverPlugin();
this.chart.addPlugin(this.popoverPlugin);
...`;
    public popoverHtml = `...
<nui-chart-popover [plugin]="popoverPlugin" [template]="popoverTemplate"></nui-chart-popover>

<ng-template #popoverTemplate let-dataPoints="dataPoints">
    <div class="p-3">
        <div *ngFor="let item of dataPoints | keyvalue">
            <strong>{{item.key}}: </strong>
            <code>{{item.value.data | json}}</code>
        </div>
    </div>
</ng-template>
...`;
}
