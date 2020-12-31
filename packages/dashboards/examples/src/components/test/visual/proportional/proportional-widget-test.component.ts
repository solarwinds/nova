import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ThemeSwitchService } from "@solarwinds/nova-bits";
import {
    DATA_SOURCE,
    DEFAULT_PROPORTIONAL_CONTENT_AGGREGATORS,
    DEFAULT_PROPORTIONAL_CONTENT_FORMATTERS,
    IDashboard,
    IWidget,
    ProportionalContentAggregatorsRegistryService,
    ProportionalDonutContentFormattersRegistryService,
    ProviderRegistryService,
    WidgetTypesService,
} from "@solarwinds/nova-dashboards";
import keyBy from "lodash/keyBy";

import { TestProportionalDataSource, TestProportionalDataSource2, TestProportionalDataSource3, TestProportionalDataSource4 } from "../../data/proportional-data-sources";

import { positions, widgets } from "./widgets";

/**
 * A component that instantiates the dashboard
 */
@Component({
    selector: "acme-dashboard",
    templateUrl: "./proportional-widget-test.component.html",
    styleUrls: ["./proportional-widget-test.component.less"],
    encapsulation: ViewEncapsulation.Emulated,
    changeDetection: ChangeDetectionStrategy.Default,
    host: { class: "proportional-widget", id: "proportional-widget" },
})
export class AcmeDashboardComponent implements OnInit {
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

    constructor(
        private providerRegistry: ProviderRegistryService,
        aggregatorRegistry: ProportionalContentAggregatorsRegistryService,
        contentFormattersRegistry: ProportionalDonutContentFormattersRegistryService,
        public themeSwitcherService: ThemeSwitchService,
        private widgetTypesService: WidgetTypesService
    ) {
        this.providerRegistry.setProviders({
            [TestProportionalDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: TestProportionalDataSource,
                deps: [],
            },
            [TestProportionalDataSource2.providerId]: {
                provide: DATA_SOURCE,
                useClass: TestProportionalDataSource2,
                deps: [],
            },
            [TestProportionalDataSource3.providerId]: {
                provide: DATA_SOURCE,
                useClass: TestProportionalDataSource3,
                deps: [],
            },
            [TestProportionalDataSource4.providerId]: {
                provide: DATA_SOURCE,
                useClass: TestProportionalDataSource4,
                deps: [],
            },
        });
        contentFormattersRegistry.addItems(DEFAULT_PROPORTIONAL_CONTENT_FORMATTERS);
        aggregatorRegistry.addItems(DEFAULT_PROPORTIONAL_CONTENT_AGGREGATORS);
    }

    public ngOnInit(): void {
        const widgetsWithStructure = widgets.map(w => ({
            ...w,
            pizzagna: {
                ...this.widgetTypesService.getWidgetType(w.type, w.version).widget,
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
