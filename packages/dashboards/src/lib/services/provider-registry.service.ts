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

import { DecimalPipe } from "@angular/common";
import {
    Injectable,
    Injector,
    NgZone,
    Optional,
    StaticProvider,
} from "@angular/core";

import {
    LoggerService,
    TimeframeService,
    VirtualViewportManager,
} from "@nova-ui/bits";

import { DataSourceAdapter } from "../components/providers/data-source-adapter";
import { DrilldownDataSourceAdapter } from "../components/providers/drilldown-data-source-adapter";
import { EventBusDebugger } from "../components/providers/event-bus-debugger";
import { UrlInteractionHandler } from "../components/providers/interaction/url-interaction-handler";
import { KpiColorPrioritizer } from "../components/providers/kpi-color-prioritizer";
import { KpiDataSourceAdapter } from "../components/providers/kpi-data-source-adapter";
import { KpiScaleSyncBroker } from "../components/providers/kpi-scale-sync-broker";
import { KpiStatusContentFallbackAdapter } from "../components/providers/kpi-status-content-fallback-adapter";
import { LoadingAdapter } from "../components/providers/loading-adapter";
import { PizzagnaBroadcasterService } from "../components/providers/pizzagna-broadcaster.service";
import { Refresher } from "../components/providers/refresher";
import { RefresherSettingsService } from "../components/providers/refresher-settings.service";
import { StatusContentFallbackAdapter } from "../components/providers/status-content-fallback-adapter";
import { TableDataSourceAdapter } from "../components/providers/table-data-source-adapter";
import { TimeseriesDataSourceAdapter } from "../components/providers/timeseries-data-source-adapter";
import { DashwizService } from "../configurator/components/wizard/dashwiz/dashwiz.service";
import { ConfiguratorDataSourceManagerService } from "../configurator/services/configurator-data-source-manager.service";
import { KpiSectionConverterService } from "../configurator/services/converters/kpi/kpi-section-converter/kpi-section-converter.service";
import { KpiTilesConverterService } from "../configurator/services/converters/kpi/kpi-tiles-converter.service";
// eslint-disable-next-line max-len
import { ProportionalWidgetChartOptionsConverterService } from "../configurator/services/converters/proportional/proportional-widget-chart-options-converter.service";
import { GenericArrayConverterService } from "../configurator/services/converters/shared/generic-array-converter/generic-array-converter.service";
import { GenericConverterService } from "../configurator/services/converters/shared/generic-converter/generic-converter.service";
// eslint-disable-next-line max-len
import { TitleAndDescriptionConverterService } from "../configurator/services/converters/shared/title-and-description-converter/title-and-description-converter.service";
import { TableColumnsConverterService } from "../configurator/services/converters/table/table-columns-converter.service";
import { TableFiltersConverterService } from "../configurator/services/converters/table/table-filters-converter.service";
import { TableScrollTypeConverterService } from "../configurator/services/converters/table/table-scroll-type-converter.service";
import { TimeseriesMetadataConverterService } from "../configurator/services/converters/timeseries/timeseries-metadata-converter.service";
import { TimeseriesSeriesConverterService } from "../configurator/services/converters/timeseries/timeseries-series-converter.service";
import { TimeseriesTileIndicatorDataConverterService } from "../configurator/services/converters/timeseries/timeseries-tile-indicator-data-converter.service";
import { CONFIGURATOR_CONVERTER } from "../configurator/services/converters/types";
import { PreviewService } from "../configurator/services/preview.service";
import { PizzagnaService } from "../pizzagna/services/pizzagna.service";
import {
    DASHBOARD_EVENT_BUS,
    DATA_SOURCE,
    FORMATTERS_REGISTRY,
    PIZZAGNA_EVENT_BUS,
} from "../types";
import { EventRegistryService } from "./event-registry.service";
import { KpiColorComparatorsRegistryService } from "./kpi-color-comparators-registry.service";
import {
    KpiFormattersRegistryService,
    ProportionalDonutContentFormattersRegistryService,
    RiskScoreFormattersRegistryService,
    TableFormatterRegistryService,
} from "./table-formatter-registry.service";
import {
    IStaticProviders,
    NOVA_CONFIGURATOR_DATA_SOURCE_MANAGER,
    NOVA_DASHBOARD_EVENT_PROXY,
    NOVA_DATASOURCE_ADAPTER,
    NOVA_DATASOURCE_INTERVAL_REFRESHER,
    NOVA_DRILLDOWN_DATASOURCE_ADAPTER,
    NOVA_EVENT_BUS_DEBUGGER,
    NOVA_GENERIC_ARRAY_CONVERTER,
    NOVA_GENERIC_CONVERTER,
    NOVA_KPI_COLOR_PRIORITIZER,
    NOVA_KPI_DATASOURCE_ADAPTER,
    NOVA_KPI_FORMATTERS_REGISTRY,
    NOVA_KPI_SCALE_SYNC_BROKER,
    NOVA_KPI_SECTION_CONVERTER,
    NOVA_KPI_STATUS_CONTENT_FALLBACK_ADAPTER,
    NOVA_KPI_TILES_CONVERTER,
    NOVA_LOADING_ADAPTER,
    NOVA_PIZZAGNA_BROADCASTER,
    NOVA_PROPORTIONAL_CONTENT_FORMATTERS_REGISTRY,
    NOVA_PROPORTIONAL_WIDGET_CHART_OPTIONS_CONVERTER,
    NOVA_STATUS_CONTENT_FALLBACK_ADAPTER,
    NOVA_TABLE_COLUMNS_CONVERTER,
    NOVA_TABLE_DATASOURCE_ADAPTER,
    NOVA_TABLE_FILTERS_CONVERTER,
    NOVA_TABLE_FORMATTERS_REGISTRY,
    NOVA_TIMESERIES_DATASOURCE_ADAPTER,
    NOVA_TIMESERIES_METADATA_CONVERTER,
    NOVA_TIMESERIES_SERIES_CONVERTER,
    NOVA_TIMESERIES_TILE_INDICATOR_DATA_CONVERTER,
    NOVA_TITLE_AND_DESCRIPTION_CONVERTER,
    NOVA_URL_INTERACTION_HANDLER,
    NOVA_VIRTUAL_VIEWPORT_MANAGER,
    NOVA_RISK_SCORE_FORMATTERS_REGISTRY,
    NOVA_TABLE_SCROLL_TYPE_CONVERTER,
} from "./types";
import { UrlInteractionService } from "./url-interaction.service";
import { WidgetConfigurationService } from "./widget-configuration.service";
import { WidgetToDashboardEventProxyService } from "./widget-to-dashboard-event-proxy.service";

@Injectable({ providedIn: "root" })
export class ProviderRegistryService {
    public staticProviders: IStaticProviders = {};

    constructor(private logger: LoggerService) {
        this.setProviders({
            [NOVA_DATASOURCE_INTERVAL_REFRESHER]: {
                provide: Refresher,
                deps: [PIZZAGNA_EVENT_BUS, NgZone, RefresherSettingsService],
            },
            [NOVA_DASHBOARD_EVENT_PROXY]: {
                provide: WidgetToDashboardEventProxyService,
                deps: [
                    PIZZAGNA_EVENT_BUS,
                    [new Optional(), DASHBOARD_EVENT_BUS],
                    [new Optional(), WidgetConfigurationService],
                    EventRegistryService,
                    PizzagnaService,
                ],
            },
            [NOVA_DATASOURCE_ADAPTER]: {
                provide: DataSourceAdapter,
                deps: [
                    PIZZAGNA_EVENT_BUS,
                    [new Optional(), DATA_SOURCE],
                    PizzagnaService,
                ],
            },
            [NOVA_TABLE_DATASOURCE_ADAPTER]: {
                provide: TableDataSourceAdapter,
                deps: [
                    PIZZAGNA_EVENT_BUS,
                    [new Optional(), DATA_SOURCE],
                    PizzagnaService,
                    VirtualViewportManager,
                ],
            },
            [NOVA_TIMESERIES_DATASOURCE_ADAPTER]: {
                provide: TimeseriesDataSourceAdapter,
                deps: [
                    PIZZAGNA_EVENT_BUS,
                    [new Optional(), DATA_SOURCE],
                    PizzagnaService,
                ],
            },
            [NOVA_KPI_DATASOURCE_ADAPTER]: {
                provide: KpiDataSourceAdapter,
                deps: [
                    PIZZAGNA_EVENT_BUS,
                    [new Optional(), DATA_SOURCE],
                    PizzagnaService,
                    DecimalPipe,
                ],
            },
            [NOVA_DRILLDOWN_DATASOURCE_ADAPTER]: {
                provide: DrilldownDataSourceAdapter,
                deps: [
                    PIZZAGNA_EVENT_BUS,
                    [new Optional(), DATA_SOURCE],
                    PizzagnaService,
                ],
            },
            [NOVA_KPI_COLOR_PRIORITIZER]: {
                provide: KpiColorPrioritizer,
                deps: [
                    [new Optional(), DATA_SOURCE],
                    PizzagnaService,
                    KpiColorComparatorsRegistryService,
                ],
            },
            [NOVA_TITLE_AND_DESCRIPTION_CONVERTER]: {
                provide: CONFIGURATOR_CONVERTER,
                useClass: TitleAndDescriptionConverterService,
                deps: [PIZZAGNA_EVENT_BUS, PreviewService, PizzagnaService],
            },
            [NOVA_PROPORTIONAL_WIDGET_CHART_OPTIONS_CONVERTER]: {
                provide: CONFIGURATOR_CONVERTER,
                useClass: ProportionalWidgetChartOptionsConverterService,
                deps: [PIZZAGNA_EVENT_BUS, PreviewService, PizzagnaService],
            },
            [NOVA_KPI_TILES_CONVERTER]: {
                provide: CONFIGURATOR_CONVERTER,
                useClass: KpiTilesConverterService,
                deps: [PIZZAGNA_EVENT_BUS, PreviewService, PizzagnaService],
            },
            [NOVA_KPI_SECTION_CONVERTER]: {
                provide: CONFIGURATOR_CONVERTER,
                useClass: KpiSectionConverterService,
                deps: [PIZZAGNA_EVENT_BUS, PreviewService, PizzagnaService],
            },
            [NOVA_GENERIC_CONVERTER]: {
                provide: CONFIGURATOR_CONVERTER,
                useClass: GenericConverterService,
                deps: [PIZZAGNA_EVENT_BUS, PreviewService, PizzagnaService],
            },
            [NOVA_GENERIC_ARRAY_CONVERTER]: {
                provide: CONFIGURATOR_CONVERTER,
                useClass: GenericArrayConverterService,
                deps: [PIZZAGNA_EVENT_BUS, PreviewService, PizzagnaService],
            },
            [NOVA_TIMESERIES_TILE_INDICATOR_DATA_CONVERTER]: {
                provide: CONFIGURATOR_CONVERTER,
                useClass: TimeseriesTileIndicatorDataConverterService,
                deps: [
                    PIZZAGNA_EVENT_BUS,
                    PreviewService,
                    PizzagnaService,
                    TimeframeService,
                ],
            },
            [NOVA_TIMESERIES_METADATA_CONVERTER]: {
                provide: CONFIGURATOR_CONVERTER,
                useClass: TimeseriesMetadataConverterService,
                deps: [
                    PIZZAGNA_EVENT_BUS,
                    PreviewService,
                    PizzagnaService,
                    TimeframeService,
                ],
            },
            [NOVA_TIMESERIES_SERIES_CONVERTER]: {
                provide: CONFIGURATOR_CONVERTER,
                useClass: TimeseriesSeriesConverterService,
                deps: [PIZZAGNA_EVENT_BUS, PreviewService, PizzagnaService],
            },
            [NOVA_TABLE_COLUMNS_CONVERTER]: {
                provide: CONFIGURATOR_CONVERTER,
                useClass: TableColumnsConverterService,
                deps: [PIZZAGNA_EVENT_BUS, PreviewService, PizzagnaService],
            },
            [NOVA_TABLE_FILTERS_CONVERTER]: {
                provide: CONFIGURATOR_CONVERTER,
                useClass: TableFiltersConverterService,
                deps: [PIZZAGNA_EVENT_BUS, PreviewService, PizzagnaService],
            },
            [NOVA_TABLE_SCROLL_TYPE_CONVERTER]: {
                provide: CONFIGURATOR_CONVERTER,
                useClass: TableScrollTypeConverterService,
                deps: [PIZZAGNA_EVENT_BUS, PreviewService, PizzagnaService],
            },
            [NOVA_LOADING_ADAPTER]: {
                provide: LoadingAdapter,
                deps: [PIZZAGNA_EVENT_BUS, PizzagnaService],
            },
            [NOVA_STATUS_CONTENT_FALLBACK_ADAPTER]: {
                provide: StatusContentFallbackAdapter,
                deps: [PIZZAGNA_EVENT_BUS, PizzagnaService],
            },
            [NOVA_KPI_STATUS_CONTENT_FALLBACK_ADAPTER]: {
                provide: KpiStatusContentFallbackAdapter,
                deps: [PIZZAGNA_EVENT_BUS, PizzagnaService],
            },
            [NOVA_KPI_SCALE_SYNC_BROKER]: {
                provide: KpiScaleSyncBroker,
                deps: [PIZZAGNA_EVENT_BUS, PizzagnaService],
            },
            [NOVA_URL_INTERACTION_HANDLER]: {
                provide: UrlInteractionHandler,
                deps: [
                    PIZZAGNA_EVENT_BUS,
                    "windowObject",
                    LoggerService,
                    UrlInteractionService,
                ],
            },
            [NOVA_EVENT_BUS_DEBUGGER]: {
                provide: EventBusDebugger,
                deps: [PIZZAGNA_EVENT_BUS],
            },
            [NOVA_VIRTUAL_VIEWPORT_MANAGER]: {
                provide: VirtualViewportManager,
                deps: [],
            },
            [NOVA_PIZZAGNA_BROADCASTER]: {
                provide: PizzagnaBroadcasterService,
                deps: [PizzagnaService],
            },
            [NOVA_TABLE_FORMATTERS_REGISTRY]: {
                provide: FORMATTERS_REGISTRY,
                useExisting: TableFormatterRegistryService,
                deps: [PizzagnaService],
            },
            [NOVA_KPI_FORMATTERS_REGISTRY]: {
                provide: FORMATTERS_REGISTRY,
                useExisting: KpiFormattersRegistryService,
                deps: [PizzagnaService],
            },
            [NOVA_RISK_SCORE_FORMATTERS_REGISTRY]: {
                provide: FORMATTERS_REGISTRY,
                useExisting: RiskScoreFormattersRegistryService,
                deps: [PizzagnaService],
            },
            [NOVA_PROPORTIONAL_CONTENT_FORMATTERS_REGISTRY]: {
                provide: FORMATTERS_REGISTRY,
                useExisting: ProportionalDonutContentFormattersRegistryService,
                deps: [PizzagnaService],
            },
            [NOVA_CONFIGURATOR_DATA_SOURCE_MANAGER]: {
                provide: ConfiguratorDataSourceManagerService,
                deps: [PIZZAGNA_EVENT_BUS, [new Optional(), DashwizService]],
            },
        });
    }

    public setProviders(providers: IStaticProviders): void {
        this.staticProviders = Object.assign(
            {},
            this.staticProviders,
            providers
        );
    }

    public getProvider(providerId: string): StaticProvider {
        const provider = this.staticProviders[providerId];
        if (!provider) {
            this.logger.warn("No provider registered for id", providerId);
            this.logger.warn(
                "Known providers:",
                Object.keys(this.staticProviders).join(", ")
            );
        }
        return provider;
    }

    public getProviderInstance(
        provider: StaticProvider,
        parentInjector: Injector
    ): any {
        const injector = Injector.create({
            providers: [provider],
            parent: parentInjector,
        });
        return injector.get(DATA_SOURCE);
    }
}
