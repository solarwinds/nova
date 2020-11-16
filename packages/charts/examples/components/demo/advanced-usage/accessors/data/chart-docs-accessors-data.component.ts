import { Component } from "@angular/core";

@Component({
    selector: "nui-chart-docs-accessors-data",
    templateUrl: "./chart-docs-accessors-data.component.html",
})
export class ChartDocsAccessorsDataComponent {
    public customAccessorCode = `const customAccessors = new LineAccessors();
customAccessors.data = {
    x: (datum: any) => datum.z,
    y: (datum: any) => datum.y * 2,
};
...`;
}
