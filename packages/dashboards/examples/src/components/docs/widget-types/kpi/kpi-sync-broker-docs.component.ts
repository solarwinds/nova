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
    selector: "kpi-sync-broker-docs",
    templateUrl: "./kpi-sync-broker-docs.component.html",
    standalone: false,
})
export class KpiSyncBrokerDocsComponent {
    public kpiScaleSyncBroker = `
"tiles": {
    "providers": {
        kpiScaleSyncBroker: {
            providerId: NOVA_KPI_SCALE_SYNC_BROKER,
            properties: {
                scaleSyncConfig: [
                    { id: "value" },
                    { id: "label" },
                    { id: "units" },
                ],
            },
        },
    },
},
`;

    public defineScaleBrokerOnDashboardSetup = `
// To add the sync broker globally to all the kpi tiles you may start with setting up the broker config
// Here you define which values to keep in sync
const brokerConfig = {
            providerId: NOVA_KPI_SCALE_SYNC_BROKER,
            properties: {
                scaleSyncConfig: [
                    { id: "value" },
                    { id: "label" },
                    { id: "units" },
                ],
            },
        };

// And here is how you set the sync broker for every KPI widget in the dashboard.
// Later, you will be able to override this setting for each separate KPI widget in the configuration (just like it is shown in the third
// width of the example with the 'kpiWidgetId3')
this.widgetTypesService.setNode(
    widgetTemplate,
    "widget",
    "tiles.providers.kpiScaleSyncBroker",
    brokerConfig
);
`;
}
