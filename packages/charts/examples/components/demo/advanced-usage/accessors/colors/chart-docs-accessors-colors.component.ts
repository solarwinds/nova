import { Component } from "@angular/core";

@Component({
    selector: "nui-chart-docs-accessors-colors",
    templateUrl: "./chart-docs-accessors-colors.component.html",
})
export class ChartDocsAccessorsColorsComponent {
    public customAccessorSnippet = `const accessors: ILineAccessors = new LineAccessors();
accessors.series.color = () => CHART_PALETTE_CS2[6];
...`;
    public customProviderSnippet = `const accessors = new LineAccessors();
const customPalette = [CHART_PALETTE_CS2[2], CHART_PALETTE_CS2[4], CHART_PALETTE_CS2[0]];
accessors.series.color = new SequentialColorProvider(customPalette).get;
...`;
}
