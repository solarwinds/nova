import { Component } from "@angular/core";

@Component({
    selector: "nui-kpi-background-color-docs",
    templateUrl: "./kpi-background-color-docs.component.html",
})
export class KpiBackgroundColorDocsComponent {
    public comparatorsRegistryCode = `
        this.comparatorsRegistry.registerComparators({
            "!=": {
                comparatorFn: (actual: any, reference: any) => actual != reference,
                label: "Not equal",
            },
        });
    `;
}
