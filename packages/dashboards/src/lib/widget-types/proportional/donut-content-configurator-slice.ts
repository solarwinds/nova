/* eslint-disable max-len */
import { IBroadcasterConfig } from "../../components/providers/types";
import { LegendPlacement } from "../../widget-types/common/widget/legend"
import { WidgetConfiguratorSectionComponent } from "../../configurator/components/widget-configurator-section/widget-configurator-section.component";
import { ProportionalChartOptionsEditorV2Component } from "../../configurator/components/widgets/proportional/chart-options-editor-v2/proportional-chart-options-editor-v2.component";
import { DonutContentConfigurationComponent } from "../../configurator/components/widgets/proportional/donut-content-configuration/donut-content-configuration.component";
import { NOVA_GENERIC_CONVERTER, NOVA_PIZZAGNA_BROADCASTER } from "../../services/types";
import { WellKnownProviders } from "../../types";

export const DONUT_CONTENT_CONFIGURATION_SLICE = {
    presentation: {
        id: "presentation",
        componentType: WidgetConfiguratorSectionComponent.lateLoadKey,
        properties: {
            headerText: "Presentation",
            nodes: [
                "titleAndDescription",
                "chartOptionsEditor",
                "donutContentConfiguration",
            ],
        },
    },
    chartOptionsEditor: {
        id: "chartOptionsEditor",
        componentType: ProportionalChartOptionsEditorV2Component.lateLoadKey,
        properties: {
            chartTypes: [
                {
                    id: "PieChart",
                    label: $localize`Pie`,
                },
                {
                    id: "DonutChart",
                    label: $localize`Donut`,
                },
                {
                    id: "VerticalBarChart",
                    label: $localize`Vertical Bar`,
                },
                {
                    id: "HorizontalBarChart",
                    label: $localize`Horizontal Bar`,
                },
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
        },
        providers: {
            // converter transforms the chart options data between the widget and the form
            [WellKnownProviders.Converter]: {
                providerId: NOVA_GENERIC_CONVERTER,
                properties: {
                    formParts: [
                        {
                            previewPath: "chart.properties.configuration.chartOptions",
                            keys: ["type", "legendPlacement", "legendFormatter"],
                        },
                        // {
                        //     previewPath: "chart.properties.configuration",
                        //     keys: ["legendFormatter"],
                        // },
                    ],
                },
            },
            [WellKnownProviders.Broadcaster]: {
                providerId: NOVA_PIZZAGNA_BROADCASTER,
                properties: {
                    configs: [
                        {
                            trackOn: "component",
                            key: "chartTypeChanged$",
                            paths: ["data.donutContentConfiguration.properties.chartType"],
                        },
                    ] as IBroadcasterConfig[],
                },
            },
        },
    },
    // /presentation/donutContentConfiguration
    donutContentConfiguration: {
        id: "donutContentConfiguration",
        componentType: DonutContentConfigurationComponent.lateLoadKey,
        providers: {
            // converter transforms the chart options data between the widget and the form
            [WellKnownProviders.Converter]: {
                providerId: NOVA_GENERIC_CONVERTER,
                properties: {
                    formParts: [
                        {
                            previewPath: "chart.properties.configuration.chartOptions.donutContentConfig",
                            keys: ["formatter", "aggregator"],
                        },
                    ],
                },
            },
        },
    },
};
