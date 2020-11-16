/* tslint:disable:max-line-length */
import { DragDropModule } from "@angular/cdk/drag-drop";
import { PortalModule } from "@angular/cdk/portal";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import {
    NuiBusyModule,
    NuiButtonModule,
    NuiCheckboxModule,
    NuiDialogModule,
    NuiDividerModule,
    NuiExpanderModule,
    NuiFormFieldModule,
    NuiIconModule,
    NuiImageModule,
    NuiMenuModule,
    NuiMessageModule,
    NuiPanelModule,
    NuiPopupModule,
    NuiRadioModule,
    NuiRepeatModule,
    NuiSearchModule,
    NuiSelectV2Module,
    NuiSorterModule,
    NuiSpinnerModule,
    NuiSwitchModule,
    NuiTextboxModule,
    NuiValidationMessageModule,
    NuiWizardModule,
} from "@solarwinds/nova-bits";
import { GridsterModule } from "angular-gridster2";

import { NuiDashboardsCommonModule } from "../common/common.module";
import { TimeseriesChartPresetService } from "../components/timeseries-widget/timeseries-chart-preset.service";
import { TimeseriesScalesService } from "../components/timeseries-widget/timeseries-scales.service";
import { NuiPizzagnaModule } from "../pizzagna/pizzagna.module";
import { ComponentRegistryService, IComponentWithLateLoadKey } from "../pizzagna/services/component-registry.service";

import { ColorPickerComponent } from "./components/color-picker/color-picker.component";
import { ConfiguratorComponent } from "./components/configurator/configurator.component";
import { FormStackComponent } from "./components/form-stack/form-stack.component";
import { DonutContentPercentageConfigurationComponent } from "./components/formatters/donut-content-percentage-formatter/donut-content-percentage-configuration.component";
import { DonutContentPercentageFormatterComponent } from "./components/formatters/donut-content-percentage-formatter/donut-content-percentage-formatter.component";
import { DonutContentRawFormatterComponent } from "./components/formatters/donut-content-raw-formatter/donut-content-raw-formatter.component";
import { DonutContentSumFormatterComponent } from "./components/formatters/donut-content-sum-formatter/donut-content-sum-formatter.component";
import { IconFormatterComponent } from "./components/formatters/icon-formatter/icon-formatter.component";
import { LinkFormatterComponent } from "./components/formatters/link-formatter/link-formatter.component";
import { RawFormatterComponent } from "./components/formatters/raw-formatter/raw-formatter.component";
import { StatusWithIconFormatterComponent } from "./components/formatters/status-with-icon-formatter/status-with-icon-formatter.component";
import { ConfiguratorHeadingComponent } from "./components/heading/configurator-heading.component";
import { ItemsDynamicComponent } from "./components/items-dynamic/items-dynamic.component";
import { PreviewPlaceholderComponent } from "./components/preview-placeholder/preview-placeholder.component";
import { WidgetClonerComponent } from "./components/widget-cloner/widget-cloner.component";
import { WidgetConfiguratorSectionCoordinatorService } from "./components/widget-configurator-section/widget-configurator-section-coordinator.service";
import { WidgetConfiguratorSectionComponent } from "./components/widget-configurator-section/widget-configurator-section.component";
import { WidgetEditorAccordionComponent } from "./components/widget-editor-accordion/widget-editor-accordion.component";
import { WidgetEditorComponent } from "./components/widget-editor/widget-editor.component";
import { BackgroundColorRulesConfigurationComponent } from "./components/widgets/configurator-items/background-color-rules-configuration/background-color-rules-configuration.component";
import { DataSourceConfigurationV2Component } from "./components/widgets/configurator-items/data-source-configuration-v2/data-source-configuration-v2.component";
import { DataSourceConfigurationComponent } from "./components/widgets/configurator-items/data-source-configuration/data-source-configuration.component";
import { EmbeddedContentConfigurationComponent } from "./components/widgets/configurator-items/embedded-content-configuration/embedded-content-configuration.component";
import { InfoMessageConfigurationComponent } from "./components/widgets/configurator-items/info-message-configuration/info-message-configuration.component";
import { KpiDescriptionConfigurationComponent } from "./components/widgets/configurator-items/kpi-description-configuration/kpi-description-configuration.component";
import { RefreshRateConfiguratorComponent } from "./components/widgets/configurator-items/refresher-configuration/refresh-rate-configurator/refresh-rate-configurator.component";
import { RefresherConfigurationComponent } from "./components/widgets/configurator-items/refresher-configuration/refresher-configuration.component";
import { ThresholdsConfigurationComponent } from "./components/widgets/configurator-items/thresholds-configuration/thresholds-configuration.component";
import { TimeseriesMetadataConfigurationComponent } from "./components/widgets/configurator-items/timeseries-metadata-configuration/timeseries-metadata-configuration.component";
import { TitleAndDescriptionConfigurationComponent } from "./components/widgets/configurator-items/title-and-description-configuration/title-and-description-configuration.component";
import { KpiTilesConfigurationComponent } from "./components/widgets/kpi/kpi-tiles-configuration/kpi-tiles-configuration.component";
import { ProportionalChartOptionsEditorComponent } from "./components/widgets/proportional/chart-options-editor/proportional-chart-options-editor.component";
import { DescriptionConfigurationComponent } from "./components/widgets/table/columns-editor/column-configuration/description-configuration/description-configuration.component";
import { LinkConfiguratorComponent } from "./components/widgets/table/columns-editor/column-configuration/presentation-configuration/portals/link-configurator/link-configurator.component";
import { ValueSelectorComponent } from "./components/widgets/table/columns-editor/column-configuration/presentation-configuration/portals/value-selector/value-selector.component";
import { PresentationConfigurationComponent } from "./components/widgets/table/columns-editor/column-configuration/presentation-configuration/presentation-configuration.component";
import { TableColumnsConfigurationComponent } from "./components/widgets/table/columns-editor/table-columns-configuration.component";
import { TableFiltersEditorComponent } from "./components/widgets/table/filters-editor/table-filters-editor.component";
import { TimeseriesSeriesCollectionConfigurationComponent } from "./components/widgets/timeseries/timeseries-series-collection-configuration/timeseries-series-collection-configuration.component";
import { TimeseriesTileDescriptionConfigurationComponent } from "./components/widgets/timeseries/timeseries-tile-description-configuration/timeseries-tile-description-configuration.component";
import { TimeseriesTileIndicatorDataConfigurationComponent } from "./components/widgets/timeseries/timeseries-tile-indicator-data-configuration/timeseries-tile-indicator-data-configuration.component";
import { DashwizStepComponent } from "./components/wizard/dashwiz-step/dashwiz-step.component";
import { DashwizButtonsComponent } from "./components/wizard/dashwiz/dashwiz-buttons.component";
import { DashwizComponent } from "./components/wizard/dashwiz/dashwiz.component";
import { AddDataPipe } from "./pipe/add-data.pipe";
import { PizzagnaRootPipe } from "./pipe/pizzagna-root.pipe";
import { WidgetConfiguratorSectionHeaderPipe } from "./pipe/widget-configurator-section-header.pipe";
import { WidgetEditorAccordionFormStatePipe } from "./pipe/widget-editor-accordion-form-state.pipe";
import { FormHeaderIconPipePipe } from "./pipe/widget-editor-accordion-header-icon.pipe";
import { ConfiguratorService } from "./services/configurator.service";
import { KpiWidgetColorService } from "./services/kpi-widget-color.service";
import { WidgetClonerService } from "./services/widget-cloner.service";
import { WidgetEditorService } from "./services/widget-editor.service";
/* tslint:enable:max-line-length */

const entryComponents: IComponentWithLateLoadKey[] = [
    ConfiguratorComponent,
    FormStackComponent,
    DashwizButtonsComponent,
    DataSourceConfigurationComponent,
    DataSourceConfigurationV2Component,
    KpiTilesConfigurationComponent,
    EmbeddedContentConfigurationComponent,
    InfoMessageConfigurationComponent,
    ProportionalChartOptionsEditorComponent,
    TableFiltersEditorComponent,
    TimeseriesMetadataConfigurationComponent,
    TimeseriesSeriesCollectionConfigurationComponent,
    TableColumnsConfigurationComponent,
    DonutContentPercentageFormatterComponent,
    DonutContentPercentageConfigurationComponent,
    DonutContentSumFormatterComponent,
    DonutContentRawFormatterComponent,
    IconFormatterComponent,
    LinkConfiguratorComponent,
    ValueSelectorComponent,
    LinkFormatterComponent,
    PreviewPlaceholderComponent,
    StatusWithIconFormatterComponent,
    RawFormatterComponent,
    KpiDescriptionConfigurationComponent,
    ThresholdsConfigurationComponent,
    TitleAndDescriptionConfigurationComponent,
    WidgetConfiguratorSectionComponent,
    WidgetEditorComponent,
    WidgetClonerComponent,
    DescriptionConfigurationComponent,
    PresentationConfigurationComponent,
    TimeseriesTileDescriptionConfigurationComponent,
    TimeseriesTileIndicatorDataConfigurationComponent,
    RefresherConfigurationComponent,
    BackgroundColorRulesConfigurationComponent,
];

const exportedDeclarations = [
    ...entryComponents,
    DashwizButtonsComponent,
    DashwizComponent,
    DashwizStepComponent,
    WidgetEditorAccordionComponent,
    WidgetConfiguratorSectionComponent,
    DataSourceConfigurationComponent,
    DataSourceConfigurationV2Component,
    ItemsDynamicComponent,
    ColorPickerComponent,
    ConfiguratorComponent,
    ConfiguratorHeadingComponent,
    WidgetConfiguratorSectionComponent,
    WidgetEditorComponent,
    WidgetClonerComponent,
    RefreshRateConfiguratorComponent,
    AddDataPipe,
    PizzagnaRootPipe,
    WidgetEditorAccordionFormStatePipe,
    WidgetConfiguratorSectionHeaderPipe,
    FormHeaderIconPipePipe,
];

@NgModule({
    imports: [
        ScrollingModule,
        NuiDashboardsCommonModule,
        ReactiveFormsModule,
        GridsterModule,
        DragDropModule,
        PortalModule,
        NuiBusyModule,
        NuiPizzagnaModule,
        NuiIconModule,
        NuiMenuModule,
        NuiPopupModule,
        NuiDialogModule,
        NuiSpinnerModule,
        NuiTextboxModule,
        NuiFormFieldModule,
        NuiButtonModule,
        NuiSelectV2Module,
        NuiRadioModule,
        NuiCheckboxModule,
        NuiValidationMessageModule,
        NuiExpanderModule,
        NuiPanelModule,
        NuiDividerModule,
        NuiSwitchModule,
        NuiMessageModule,
        NuiWizardModule,
        NuiSorterModule,
        NuiSearchModule,
        NuiRepeatModule,
        NuiImageModule,
    ],
    declarations: [
        ...exportedDeclarations,
    ],
    providers: [
        ConfiguratorService,
        WidgetConfiguratorSectionCoordinatorService,
        WidgetEditorService,
        WidgetClonerService,
        KpiWidgetColorService,
        TimeseriesChartPresetService,
        TimeseriesScalesService,
    ],
    exports: exportedDeclarations,
    entryComponents: entryComponents,
})
export class NuiDashboardConfiguratorModule {

    constructor(componentRegistry: ComponentRegistryService) {
        for (const ec of entryComponents.filter((c: IComponentWithLateLoadKey) => c.lateLoadKey)) {
            componentRegistry.registerByLateLoadKey(ec);
        }
    }

}
