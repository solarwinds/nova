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

import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";
import keyBy from "lodash/keyBy";

import { ThemeSwitchService } from "@nova-ui/bits";
import {
    DashboardComponent,
    DATA_SOURCE,
    IDashboard,
    IWidget,
    ProviderRegistryService,
    WidgetTypesService,
} from "@nova-ui/dashboards";

import { AcmeFormSubmitHandler } from "./acme-form-submit-handler";
import { positions, widgetConfigs } from "./widgets";
import {
    TestTimeseriesDataSource,
    TestTimeseriesDataSource2,
    TestTimeseriesEventsDataSource,
    TestTimeseriesStatusDataSource,
    TestTimeseriesStatusIntervalDataSource,
} from "../../data/timeseries-data-sources";

/**
 * A component that instantiates the dashboard
 */
@Component({
    selector: "acme-dashboard",
    templateUrl: "./timeseries-test.component.html",
    styleUrls: ["./timeseries-test.component.less"],
    encapsulation: ViewEncapsulation.Emulated,
    changeDetection: ChangeDetectionStrategy.Default,
    providers: [AcmeFormSubmitHandler],
    standalone: false,
})
export class AcmeDashboardComponent implements OnInit {
    @ViewChild(DashboardComponent, { static: true })
    dashboardComponent: DashboardComponent;

    public dashboard: IDashboard = {
        positions: {},
        widgets: {},
    };

    public gridsterConfig = {
        minCols: 12,
        maxCols: 12,
        minRows: 12,
    };

    public editMode = false;
    public dsError = false;

    constructor(
        private providerRegistry: ProviderRegistryService,
        public submitHandler: AcmeFormSubmitHandler,
        public themeSwitcherService: ThemeSwitchService,
        private widgetTypesService: WidgetTypesService
    ) {
        this.providerRegistry.setProviders({
            [TestTimeseriesDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: TestTimeseriesDataSource,
                deps: [],
            },
            [TestTimeseriesDataSource2.providerId]: {
                provide: DATA_SOURCE,
                useClass: TestTimeseriesDataSource2,
                deps: [],
            },
            [TestTimeseriesEventsDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: TestTimeseriesEventsDataSource,
                deps: [],
            },
            [TestTimeseriesStatusDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: TestTimeseriesStatusDataSource,
                deps: [],
            },
            [TestTimeseriesStatusIntervalDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: TestTimeseriesStatusIntervalDataSource,
                deps: [],
            },
        });
    }

    public ngOnInit(): void {
        const widgetsWithStructure = widgetConfigs.map((w) =>
            this.widgetTypesService.mergeWithWidgetType(w)
        );
        const widgetsIndex = keyBy(widgetsWithStructure, (w: IWidget) => w.id);

        this.dashboard = {
            positions,
            widgets: widgetsIndex,
        };
    }

    public onDsErrorChange(error: boolean): void {
        TestTimeseriesDataSource.mockError = error;
    }
}
