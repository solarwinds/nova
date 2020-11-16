import { Component } from "@angular/core";

@Component({
    selector: "nui-chart-docs-spark",
    templateUrl: "./chart-docs-spark.component.html",
})
export class ChartDocsSparkComponent {
    public gridConfiguration = `public chart = new Chart(new XYGrid(new SparkChartGridConfig(false, false)));
...`;
    public scaleInstantiationWithId = `const scale = new TimeScale("example-scale-id");
...`;
    public collectionIdHtml = `<div *ngFor="let s of chartAssist.sparks">
    <nui-chart class="d-flex" [chart]="s.chart" nuiChartCollectionId="example-collection-id"></nui-chart>
</div>`;
}
