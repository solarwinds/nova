import { Component } from "@angular/core";

@Component({
    selector: "area-chart-bi-directional-stacked-visual-test",
    template: `
        <area-chart-bi-directional-stacked-test [inverted]="false"></area-chart-bi-directional-stacked-test>
        <area-chart-bi-directional-stacked-test [inverted]="true"></area-chart-bi-directional-stacked-test>
    `,
})
export class AreaChartBiDirectionalStackedVisualTestComponent {
}
