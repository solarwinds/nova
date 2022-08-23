import { Component } from "@angular/core";

import {
    IEnhancedLineCapConfig,
    ILineRendererConfig,
    LineRenderer,
} from "@nova-ui/charts";

@Component({
    selector: "nui-chart-docs-line",
    templateUrl: "./chart-docs-line.component.html",
})
export class ChartDocsLineComponent {
    getEnhancedLineCapConfigPropKey(key: keyof IEnhancedLineCapConfig): string {
        return key;
    }

    getLineRendererConfigPropKey(key: keyof ILineRendererConfig): string {
        return key;
    }

    getLineRendererPropKey(key: keyof LineRenderer): string {
        return key;
    }
}
