// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import { Component } from "@angular/core";

@Component({
    selector: "nui-drilldown-docs",
    templateUrl: "./drilldown-docs.component.html",
})
export class DrilldownDocsComponent {
    public widgetFileText =
        require("!!raw-loader!../../../../../../src/lib/widget-types/drilldown/drilldown-widget.ts")
            .default;
    public configuratorFileText =
        require("!!raw-loader!../../../../../../src/lib/widget-types/drilldown/drilldown-configurator")
            .default;
    public predefinedGroping = `
listWidget: {
    providers: {
        [WellKnownProviders.Adapter]: {
            providerId: NOVA_DRILLDOWN_DATASOURCE_ADAPTER,
            properties: {
                ...
                // adapter props
                drillstate: [],
                groupBy: ["regionName", "subregionName"],
                groups: ["regionName", "subregionName"],
                ...
            },
        },
    },
},
`;
    public featuredDeclaredText = `
        private supportedFeatures: IDataSourceFeatures = {
        search: { enabled: true },
    };`;
    public featuresUsedText = `
        this.features = new DataSourceFeatures(this.supportedFeatures);
    `;
}
