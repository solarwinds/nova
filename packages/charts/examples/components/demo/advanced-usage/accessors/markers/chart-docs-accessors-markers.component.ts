import { Component } from "@angular/core";

@Component({
    selector: "nui-chart-docs-accessors-markers",
    templateUrl: "./chart-docs-accessors-markers.component.html",
})
export class ChartDocsAccessorsMarkersComponent {
    public customAccessorSnippet = `const accessors = new LineAccessors();
accessors.series.marker = () => CHART_MARKERS[2];
...`;
    public customProviderSnippet = `const accessors = new LineAccessors();
const customMarkerSet = [CHART_MARKERS[6], CHART_MARKERS[8], CHART_MARKERS[9]];
accessors.series.marker = new SequentialChartMarkerProvider(customMarkerSet).get;
...`;
}
