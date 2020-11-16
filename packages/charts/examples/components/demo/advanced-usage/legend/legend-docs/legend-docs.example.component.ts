import { Component } from "@angular/core";

@Component({
    selector: "nui-legend-docs-example",
    templateUrl: "./legend-docs.example.component.html",
})
export class LegendDocsExampleComponent {
    public legendHtml = `<nui-legend-series (mouseenter)="chartAssist.emphasizeSeries(seriesId)"
       [seriesRenderState]="chartAssist.renderStatesIndex[seriesId]?.state"
       [isSelected]="!chartAssist.isSeriesHidden(seriesId)"
       (isSelectedChange)="chartAssist.toggleSeries(seriesId, $event)">
</nui-legend-series>`;
}
