import { Component } from "@angular/core";
import { CHART_MARKERS, IChartMarker, IValueProvider, RenderState, SequentialChartMarkerProvider } from "@nova-ui/charts";

@Component({
    selector: "nui-legend-visual-test",
    templateUrl: "./legend-visual-test.component.html",
    styleUrls: ["legend-visual-test.component.less"],
})
export class LegendVisualTestComponent {
    public markers: IValueProvider<IChartMarker> = new SequentialChartMarkerProvider(CHART_MARKERS);

    public seriesData = [
        {
            seriesId: "1",
            value: 15.5,
            unitLabel: "Kbps",
            descriptionPrimary: "Primary Description 1",
            descriptionSecondary: "Secondary Description 1",
        },
        {
            seriesId: "2",
            value: "9999k",
            unitLabel: "%",
            descriptionPrimary: "Primary Description 2",
            descriptionSecondary: "Secondary Description 2",
        },
    ];

    public tileBackgroundColor = "#1f77b4";
    public tileColor = "white";

    public renderStates = Object.keys(RenderState);
}
