/* eslint-disable max-len */
import { IBroadcasterConfig } from "../../components/providers/types";
import { IFormatterDefinition } from "../../components/types";
import { LegendPlacement } from "../../widget-types/common/widget/legend";
import { FormStackComponent } from "../../configurator/components/form-stack/form-stack.component";
import { DonutContentPercentageFormatterComponent } from "../../configurator/components/formatters/donut-content-percentage-formatter/donut-content-percentage-formatter.component";
import { DonutContentRawFormatterComponent } from "../../configurator/components/formatters/donut-content-raw-formatter/donut-content-raw-formatter.component";
import { DonutContentSumFormatterComponent } from "../../configurator/components/formatters/donut-content-sum-formatter/donut-content-sum-formatter.component";
import { LinkFormatterComponent } from "../../configurator/components/formatters/link-formatter/link-formatter.component";
import { PercentageFormatterComponent } from "../../configurator/components/formatters/percentage-formatter/percentage-formatter.component";
import { RawFormatterComponent } from "../../configurator/components/formatters/raw-formatter/raw-formatter.component";
import { SiUnitsFormatterComponent } from "../../configurator/components/formatters/si-units-formatter/si-units-formatter.component";
import { StatusWithIconFormatterComponent } from "../../configurator/components/formatters/status-with-icon-formatter/status-with-icon-formatter.component";
import { WidgetConfiguratorSectionComponent } from "../../configurator/components/widget-configurator-section/widget-configurator-section.component";
import { DataSourceConfigurationComponent } from "../../configurator/components/widgets/configurator-items/data-source-configuration/data-source-configuration.component";
import { TitleAndDescriptionConfigurationComponent } from "../../configurator/components/widgets/configurator-items/title-and-description-configuration/title-and-description-configuration.component";
import { AggregatorMetricSelectorConfigurationComponent } from "../../configurator/components/widgets/proportional/aggregators-configurators/aggregator-configurator/aggregator-configurator.component";
import { FieldMapperAggregatorConfiguratorComponent } from "../../configurator/components/widgets/proportional/aggregators-configurators/field-mapper-aggregator-configurator/field-mapper-aggregator-configurator.component";
import { ProportionalChartOptionsEditorComponent } from "../../configurator/components/widgets/proportional/chart-options-editor/proportional-chart-options-editor.component";
import { fieldMapper } from "../../functions/proportional-aggregators/field-mapper";
import {
    IPercentageAggregatorProperties,
    percentageAggregator,
} from "../../functions/proportional-aggregators/percentage-aggregator";
import { sumAggregator } from "../../functions/proportional-aggregators/sum-aggregator";
import { IProportionalDonutContentAggregatorDefinition } from "../../functions/proportional-aggregators/types";
import {
    DEFAULT_PIZZAGNA_ROOT,
    NOVA_GENERIC_CONVERTER,
    NOVA_PIZZAGNA_BROADCASTER,
    NOVA_PROPORTIONAL_CONTENT_FORMATTERS_REGISTRY,
    NOVA_PROPORTIONAL_WIDGET_CHART_OPTIONS_CONVERTER,
    NOVA_TITLE_AND_DESCRIPTION_CONVERTER,
} from "../../services/types";
import { PizzagnaLayer, WellKnownProviders } from "../../types";
import { REFRESHER_CONFIGURATOR } from "../common/configurator/components";
import { DataSourceErrorComponent } from "../../configurator/components/widgets/configurator-items/data-source-error/data-source-error.component";
/* eslint-enable max-len */

export const DEFAULT_LEGEND_FORMATTERS: IFormatterDefinition[] = [
    {
        componentType: "",
        label: $localize`Raw Formatter`,
        dataTypes: {
            // @ts-ignore
            value: null,
        },
    },
    {
        componentType: StatusWithIconFormatterComponent.lateLoadKey,
        label: $localize`Status With Icon`,
        dataTypes: {
            // @ts-ignore
            value: null,
        },
    },
    {
        componentType: LinkFormatterComponent.lateLoadKey,
        label: $localize`Link`,
        dataTypes: {
            // @ts-ignore
            value: null,
        },
    },
];
export const DEFAULT_PROPORTIONAL_CONTENT_FORMATTERS: IFormatterDefinition[] = [
    {
        componentType: RawFormatterComponent.lateLoadKey,
        label: $localize`Raw Formatter`,
        dataTypes: {
            // @ts-ignore
            value: null,
        },
        properties: {
            elementClass: "nui-text-page",
        },
    },
    {
        componentType: SiUnitsFormatterComponent.lateLoadKey,
        label: $localize`Si Units Formatter`,
        dataTypes: {
            // @ts-ignore
            value: null,
        },
        properties: {
            elementClass: "nui-text-page",
        },
    },
    {
        componentType: PercentageFormatterComponent.lateLoadKey,
        label: $localize`Percentage Formatter`,
        dataTypes: {
            // @ts-ignore
            value: null,
        },
        properties: {
            elementClass: "nui-text-page",
        },
    },
];

export const DEFAULT_PROPORTIONAL_CONTENT_AGGREGATORS: IProportionalDonutContentAggregatorDefinition[] =
    [
        {
            aggregatorType: sumAggregator.aggregatorType,
            label: "Sum Aggregator",
            fn: sumAggregator,
            configurationComponent:
                AggregatorMetricSelectorConfigurationComponent.lateLoadKey,
        },
        {
            aggregatorType: percentageAggregator.aggregatorType,
            label: "Percentage Aggregator",
            fn: percentageAggregator,
            properties: {
                base100: true,
            } as IPercentageAggregatorProperties,
            configurationComponent:
                AggregatorMetricSelectorConfigurationComponent.lateLoadKey,
        },
        {
            aggregatorType: fieldMapper.aggregatorType,
            label: "Field Mapper Aggregator",
            fn: fieldMapper,
            configurationComponent:
                FieldMapperAggregatorConfiguratorComponent.lateLoadKey,
        },
    ];

export const proportionalConfigurator = {
    [PizzagnaLayer.Structure]: {
        [DEFAULT_PIZZAGNA_ROOT]: {
            id: DEFAULT_PIZZAGNA_ROOT,
            // base layout of the configurator - all form components referenced herein will be stacked in a column
            componentType: FormStackComponent.lateLoadKey,
            properties: {
                elementClass: "flex-grow-1 overflow-auto nui-scroll-shadows",
                // references to other components laid out in this form
                nodes: ["presentation", "dataAndCalculations"],
            },
            providers: {
                [WellKnownProviders.FormattersRegistry]: {
                    providerId: NOVA_PROPORTIONAL_CONTENT_FORMATTERS_REGISTRY,
                },
            },
        },
        // /presentation
        presentation: {
            id: "presentation",
            componentType: WidgetConfiguratorSectionComponent.lateLoadKey,
            properties: {
                headerText: "Presentation",
                nodes: ["titleAndDescription", "chartOptionsEditor"],
            },
        },
        // /presentation/titleAndDescription
        titleAndDescription: {
            id: "titleAndDescription",
            componentType:
                TitleAndDescriptionConfigurationComponent.lateLoadKey,
            providers: {
                [WellKnownProviders.Converter]: {
                    providerId: NOVA_TITLE_AND_DESCRIPTION_CONVERTER,
                },
            },
        },
        // /presentation/chartOptionsEditor
        chartOptionsEditor: {
            id: "chartOptionsEditor",
            componentType: ProportionalChartOptionsEditorComponent.lateLoadKey,
            properties: {
                chartOptions: {
                    chartTypes: [
                        "PieChart",
                        "DonutChart",
                        "VerticalBarChart",
                        "HorizontalBarChart",
                    ],
                    legendPlacementOptions: [
                        {
                            id: LegendPlacement.None,
                            label: $localize`None`,
                        },
                        {
                            id: LegendPlacement.Right,
                            label: $localize`Right`,
                        },
                        {
                            id: LegendPlacement.Bottom,
                            label: $localize`Bottom`,
                        },
                    ],
                    contentFormatters: [
                        {
                            componentType:
                                DonutContentRawFormatterComponent.lateLoadKey,
                            label: $localize`Raw`,
                        },
                        {
                            componentType:
                                DonutContentSumFormatterComponent.lateLoadKey,
                            label: $localize`Sum`,
                        },
                        {
                            componentType:
                                DonutContentPercentageFormatterComponent.lateLoadKey,
                            label: $localize`Percentage`,
                            configurationComponent:
                                "DonutContentPercentageConfigurationComponent",
                        },
                    ] as IFormatterDefinition[],
                    legendFormatters: [
                        {
                            componentType:
                                StatusWithIconFormatterComponent.lateLoadKey,
                            label: $localize`Status With Icon`,
                        },
                        {
                            componentType: LinkFormatterComponent.lateLoadKey,
                            label: $localize`Link`,
                        },
                    ] as IFormatterDefinition[],
                },
            },
            providers: {
                // converter transforms the chart options data between the widget and the form
                [WellKnownProviders.Converter]: {
                    providerId:
                        NOVA_PROPORTIONAL_WIDGET_CHART_OPTIONS_CONVERTER,
                },
            },
        },
        refresher: REFRESHER_CONFIGURATOR,
        // /dataAndCalculations
        dataAndCalculations: {
            id: "dataAndCalculations",
            componentType: WidgetConfiguratorSectionComponent.lateLoadKey,
            properties: {
                headerText: $localize`Data and Calculations`,
                nodes: ["dataSource"],
            },
        },
        // /dataAndCalculations/dataSource
        dataSource: {
            id: "dataSource",
            componentType: DataSourceConfigurationComponent.lateLoadKey,
            properties: {
                // for the DataSourceConfigurationComponent, this defines the list of data sources to pick from
                dataSourceProviders: [] as string[],
                errorComponent: DataSourceErrorComponent.lateLoadKey,
            },
            providers: {
                // converter transforms the data source metadata between the widget and the form
                [WellKnownProviders.Converter]: {
                    providerId: NOVA_GENERIC_CONVERTER,
                    properties: {
                        formParts: [
                            {
                                // this component updates the 'providerId' of the 'dataSource'
                                previewPath: "chart.providers.dataSource",
                                // TODO: Remove 'properties' key in v10 - NUI-5831
                                keys: ["providerId", "properties"],
                            },
                            {
                                // this component updates the 'properties' of the 'dataSource' via an adapter
                                previewPath:
                                    "chart.providers.adapter.properties.dataSource",
                                keys: ["properties"],
                            },
                        ],
                    },
                },
                [WellKnownProviders.Broadcaster]: {
                    providerId: NOVA_PIZZAGNA_BROADCASTER,
                    properties: {
                        configs: [
                            {
                                trackOn: "component",
                                key: "dsOutput",
                                paths: [
                                    "data.chartOptionsEditor.properties.dsOutput",
                                ],
                            },
                        ] as IBroadcasterConfig[],
                    },
                },
            },
        },
    },
};
