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

import { HttpClient } from "@angular/common/http";
import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation,
} from "@angular/core";
import keyBy from "lodash/keyBy";

import { LoggerService, ThemeSwitchService } from "@nova-ui/bits";
import {
    DATA_SOURCE,
    IDashboard,
    IWidget,
    ProviderRegistryService,
    WidgetTypesService,
} from "@nova-ui/dashboards";

import {
    HarryPotterAverageRatingDataSource,
    HarryPotterRatingsCountDataSource,
} from "../data/kpi-datasources";
import {
    BeerReviewCountsByCityMockDataSource,
    BeerReviewCountsByCityMockDataSource2,
} from "../data/proportional-datasources";
import { BeerDataSource } from "../data/table/beer-data-source";
import { RandomUserDataSource } from "../data/table/random-user-data-source";
import {
    BeerVsReadingMockDataSource,
    LoungingVsFrisbeeGolfMockDataSource,
} from "../data/timeseries-data-sources";
import { positions, widgets } from "./widget-configs";

/**
 * A component that instantiates the dashboard
 */
@Component({
    selector: "hero-dashboard",
    templateUrl: "./hero-dashboard.component.html",
    styleUrls: ["./hero-dashboard.component.less"],
    encapsulation: ViewEncapsulation.Emulated,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class HeroDashboardComponent implements OnInit {
    public dashboard: IDashboard = {
        positions: {},
        widgets: {},
    };

    public gridsterConfig = {};
    public editMode = false;

    constructor(
        private providerRegistry: ProviderRegistryService,
        public themeSwitcherService: ThemeSwitchService,
        private widgetTypesService: WidgetTypesService
    ) {
        this.providerRegistry.setProviders({
            [HarryPotterAverageRatingDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: HarryPotterAverageRatingDataSource,
                deps: [HttpClient],
            },
            [HarryPotterRatingsCountDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: HarryPotterRatingsCountDataSource,
                deps: [HttpClient],
            },
            [BeerReviewCountsByCityMockDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: BeerReviewCountsByCityMockDataSource,
                deps: [],
            },
            [BeerReviewCountsByCityMockDataSource2.providerId]: {
                provide: DATA_SOURCE,
                useClass: BeerReviewCountsByCityMockDataSource2,
                deps: [],
            },
            [RandomUserDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: RandomUserDataSource,
                deps: [LoggerService],
            },
            [BeerDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: BeerDataSource,
                deps: [LoggerService],
            },
            [BeerVsReadingMockDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: BeerVsReadingMockDataSource,
                deps: [],
            },
            [LoungingVsFrisbeeGolfMockDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: LoungingVsFrisbeeGolfMockDataSource,
                deps: [],
            },
        });
    }

    public ngOnInit(): void {
        const widgetsWithStructure = widgets.map((w) => ({
            ...w,
            pizzagna: {
                ...this.widgetTypesService.getWidgetType(w.type, w.version)
                    .widget,
                ...w.pizzagna,
            },
        }));
        const widgetsIndex = keyBy(widgetsWithStructure, (w: IWidget) => w.id);

        this.dashboard = {
            positions: positions,
            widgets: widgetsIndex,
        };
    }
}
