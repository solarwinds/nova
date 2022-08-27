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
