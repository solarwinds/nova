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

import { ScrollingModule } from "@angular/cdk/scrolling";
import { DecimalPipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
// This is not technically used here, but it does pull in the type for $localize
// noinspection ES6UnusedImports
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { LocalizeFn } from "@angular/localize/init";
import { GridsterModule } from "angular-gridster2";

import {
    NuiBusyModule,
    NuiButtonModule,
    NuiCommonModule,
    NuiIconModule,
    NuiImageModule,
    NuiMenuModule,
    NuiPaginatorModule,
    NuiPopoverModule,
    NuiPopupModule,
    NuiProgressModule,
    NuiRepeatModule,
    NuiRiskScoreModule,
    NuiSearchModule,
    NuiSelectModule,
    NuiSpinnerModule,
    NuiTableModule,
    NuiTimeFrameBarModule,
    NuiTimeFramePickerModule,
    NuiTooltipModule,
} from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { NuiDashboardsCommonModule } from "./common/common.module";
import { WidgetErrorComponent } from "./common/components/widget-error/widget-error.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { EmbeddedContentComponent } from "./components/embedded-content/embedded-content.component";
import { KpiComponent } from "./components/kpi-widget/kpi.component";
import { StackComponent } from "./components/layouts/stack/stack.component";
import { TilesComponent } from "./components/layouts/tiles/tiles.component";
import { ListGroupItemComponent } from "./components/list-widget/list-elements/list-group-item/list-group-item.component";
import { ListLeafItemComponent } from "./components/list-widget/list-elements/list-leaf-item/list-leaf-item.component";
import { ListNavigationBarComponent } from "./components/list-widget/list-elements/list-navigation-bar/list-navigation-bar.component";
import { ListWidgetComponent } from "./components/list-widget/list-widget.component";
import { LoadingComponent } from "./components/loading/loading.component";
import { ProportionalDonutContentComponent } from "./components/proportional-widget/proportional-donut-content/proportional-donut-content.component";
import { ProportionalWidgetComponent } from "./components/proportional-widget/proportional-widget.component";
import { RefresherSettingsService } from "./components/providers/refresher-settings.service";
import { RiskScoreTileComponent } from "./components/risk-score-tile/risk-score-tile.component";
import { DelayedMousePresenceDetectionDirective } from "./components/table-widget/delayed-mouse-presence-detection.directive";
import { TableWidgetComponent } from "./components/table-widget/table-widget.component";
import { TemplateLoadErrorComponent } from "./components/template-load-error/template-load-error.component";
import { TimeframeSelectionComponent } from "./components/time-frame-selection/timeframe-selection.component";
import { StatusBarChartComponent } from "./components/timeseries-widget/chart-presets/status-bar-chart/status-bar-chart.component";
import { LineChartComponent } from "./components/timeseries-widget/chart-presets/xy-chart/chart-types/line-chart.component";
import { StackedAreaChartComponent } from "./components/timeseries-widget/chart-presets/xy-chart/chart-types/stacked-area-chart.component";
import { StackedBarChartComponent } from "./components/timeseries-widget/chart-presets/xy-chart/chart-types/stacked-bar-chart.component";
import { StackedPercentageAreaChartComponent } from "./components/timeseries-widget/chart-presets/xy-chart/chart-types/stacked-percentage-area-chart.component";
import { TimeseriesInspectionMenuComponent } from "./components/timeseries-widget/timeseries-inspection-menu/timeseries-inspection-menu.component";
import { TimeseriesWidgetComponent } from "./components/timeseries-widget/timeseries-widget.component";
import { WidgetSearchComponent } from "./components/widget-search/widget-search.component";
import { WidgetBodyContentComponent } from "./components/widget/widget-body-content/widget-body-content.component";
import { WidgetBodyComponent } from "./components/widget/widget-body/widget-body.component";
import { WidgetHeaderComponent } from "./components/widget/widget-header/widget-header.component";
import { WidgetComponent } from "./components/widget/widget.component";
import { NuiDashboardConfiguratorModule } from "./configurator/configurator.module";
import { DATA_SOURCE_OUTPUT } from "./configurator/types";
import { GridsterItemWidgetIdDirective } from "./directives/gridster-item-widget-id/gridster-item-widget-id.directive";
import { WidgetEditorDirective } from "./directives/widget-editor/widget-editor.directive";
import { NuiPizzagnaModule } from "./pizzagna/pizzagna.module";
import { ComponentPortalService } from "./pizzagna/services/component-portal.service";
import {
    ComponentRegistryService,
    IComponentWithLateLoadKey,
} from "./pizzagna/services/component-registry.service";
import { EventRegistryService } from "./services/event-registry.service";
import {
    KpiFormattersRegistryService,
    RiskScoreFormattersRegistryService,
} from "./services/table-formatter-registry.service";
import {
    DASHBOARD_EDIT_MODE,
    DATA_SOURCE_BUSY,
    PREVIEW_EVENT,
    REFRESH,
    SET_PROPERTY_VALUE,
    SET_TIMEFRAME,
    WIDGET_CREATE,
    WIDGET_EDIT,
    WIDGET_POSITION_CHANGE,
    WIDGET_READY,
    WIDGET_REMOVE,
    WIDGET_RESIZE,
} from "./services/types";
import { WidgetTypesService } from "./services/widget-types.service";
import { drilldown } from "./widget-types/drilldown/drilldown";
import { embeddedContent } from "./widget-types/embedded-content/embedded-content";
import { kpi } from "./widget-types/kpi/kpi";
import { DEFAULT_KPI_FORMATTERS } from "./widget-types/kpi/kpi-configurator";
import { previewPlaceholder } from "./widget-types/preview-placeholder";
import { proportional } from "./widget-types/proportional/proportional";
import { riskScore } from "./widget-types/risk-score/risk-score";
import { DEFAULT_RISK_SCORE_FORMATTERS } from "./widget-types/risk-score/risk-score-configurator";
import { table } from "./widget-types/table/table";
import { timeseries } from "./widget-types/timeseries/timeseries";

const dashboardComponents = [
    DashboardComponent,
    EmbeddedContentComponent,
    GridsterItemWidgetIdDirective,
    KpiComponent,
    RiskScoreTileComponent,
    LineChartComponent,
    LoadingComponent,
    ProportionalWidgetComponent,
    StackComponent,
    StackedAreaChartComponent,
    StackedBarChartComponent,
    StackedPercentageAreaChartComponent,
    StatusBarChartComponent,
    TableWidgetComponent,
    DelayedMousePresenceDetectionDirective,
    TemplateLoadErrorComponent,
    TilesComponent,
    TimeframeSelectionComponent,
    TimeseriesWidgetComponent,
    WidgetBodyComponent,
    WidgetBodyContentComponent,
    WidgetComponent,
    WidgetEditorDirective,
    WidgetHeaderComponent,
    ListWidgetComponent,
    ListLeafItemComponent,
    ListGroupItemComponent,
    ListNavigationBarComponent,
    WidgetSearchComponent,
    ProportionalDonutContentComponent,
    TimeseriesInspectionMenuComponent,
];

const entryComponents: IComponentWithLateLoadKey[] = [
    EmbeddedContentComponent,
    KpiComponent,
    RiskScoreTileComponent,
    LineChartComponent,
    LoadingComponent,
    ProportionalWidgetComponent,
    StackComponent,
    StackedAreaChartComponent,
    StackedBarChartComponent,
    StackedPercentageAreaChartComponent,
    StatusBarChartComponent,
    TableWidgetComponent,
    TemplateLoadErrorComponent,
    TilesComponent,
    TimeframeSelectionComponent,
    TimeseriesWidgetComponent,
    WidgetBodyComponent,
    WidgetBodyContentComponent,
    WidgetHeaderComponent,
    WidgetErrorComponent,
    ListWidgetComponent,
    ListLeafItemComponent,
    ListGroupItemComponent,
    ListNavigationBarComponent,
    WidgetSearchComponent,
    ProportionalDonutContentComponent,
];

@NgModule({
    imports: [
        NuiDashboardsCommonModule,
        GridsterModule,
        NuiBusyModule,
        NuiButtonModule,
        NuiChartsModule,
        NuiDashboardConfiguratorModule,
        NuiIconModule,
        NuiImageModule,
        NuiMenuModule,
        NuiPizzagnaModule,
        NuiPopupModule,
        NuiProgressModule,
        NuiTableModule,
        NuiTimeFrameBarModule,
        ScrollingModule,
        NuiTimeFramePickerModule,
        ReactiveFormsModule,
        NuiSpinnerModule,
        NuiTooltipModule,
        NuiSearchModule,
        NuiCommonModule,
        NuiRepeatModule,
        NuiRiskScoreModule,
        NuiSelectModule,
        NuiPopoverModule,
        NuiPaginatorModule,
    ],
    declarations: dashboardComponents,
    providers: [
        ComponentPortalService,
        WidgetTypesService,
        DecimalPipe,
        RefresherSettingsService,
    ],
    exports: dashboardComponents,
})
export class NuiDashboardsModule {
    constructor(
        widgetTypesService: WidgetTypesService,
        componentRegistry: ComponentRegistryService,
        eventRegistry: EventRegistryService,
        kpiFormattersRegistry: KpiFormattersRegistryService,
        riskScoreFormattersRegistry: RiskScoreFormattersRegistryService
    ) {
        widgetTypesService.registerWidgetType("kpi", 1, kpi);
        widgetTypesService.registerWidgetType("risk-score", 1, riskScore);
        widgetTypesService.registerWidgetType("table", 1, table);
        widgetTypesService.registerWidgetType("proportional", 1, proportional);
        widgetTypesService.registerWidgetType("timeseries", 1, timeseries);
        widgetTypesService.registerWidgetType(
            "previewPlaceholder",
            1,
            previewPlaceholder
        );
        widgetTypesService.registerWidgetType(
            "embedded-content",
            1,
            embeddedContent
        );
        widgetTypesService.registerWidgetType("drilldown", 1, drilldown);

        for (const ec of entryComponents.filter(
            (c: IComponentWithLateLoadKey) => c.lateLoadKey
        )) {
            componentRegistry.registerByLateLoadKey(ec);
        }

        eventRegistry.registerEvent(REFRESH);
        eventRegistry.registerEvent(WIDGET_REMOVE);
        eventRegistry.registerEvent(WIDGET_READY);
        eventRegistry.registerEvent(WIDGET_EDIT);
        eventRegistry.registerEvent(WIDGET_CREATE);
        eventRegistry.registerEvent(WIDGET_RESIZE);
        eventRegistry.registerEvent(WIDGET_POSITION_CHANGE);
        eventRegistry.registerEvent(SET_PROPERTY_VALUE);
        eventRegistry.registerEvent(SET_TIMEFRAME);
        eventRegistry.registerEvent(PREVIEW_EVENT);
        eventRegistry.registerEvent(DASHBOARD_EDIT_MODE);
        eventRegistry.registerEvent(DATA_SOURCE_OUTPUT);
        eventRegistry.registerEvent(DATA_SOURCE_BUSY);

        kpiFormattersRegistry.addItems(DEFAULT_KPI_FORMATTERS);
        riskScoreFormattersRegistry.addItems(DEFAULT_RISK_SCORE_FORMATTERS);
    }
}
