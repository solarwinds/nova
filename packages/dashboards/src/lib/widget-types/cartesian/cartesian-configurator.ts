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

/* eslint-disable max-len */
import { FormStackComponent } from "../../configurator/components/form-stack/form-stack.component";
import { WidgetConfiguratorSectionComponent } from "../../configurator/components/widget-configurator-section/widget-configurator-section.component";
import { DataSourceConfigurationComponent } from "../../configurator/components/widgets/configurator-items/data-source-configuration/data-source-configuration.component";
import { DataSourceErrorComponent } from "../../configurator/components/widgets/configurator-items/data-source-error/data-source-error.component";
import { TitleAndDescriptionConfigurationComponent } from "../../configurator/components/widgets/configurator-items/title-and-description-configuration/title-and-description-configuration.component";
import {
    DEFAULT_PIZZAGNA_ROOT,
    NOVA_GENERIC_CONVERTER,
    NOVA_PROPORTIONAL_CONTENT_FORMATTERS_REGISTRY,
    NOVA_TITLE_AND_DESCRIPTION_CONVERTER,
} from "../../services/types";
import { PizzagnaLayer, WellKnownProviders } from "../../types";
import { REFRESHER_CONFIGURATOR } from "../common/configurator/components";
/* eslint-enable max-len */

export const cartesianWidgetConfigurator = {
    [PizzagnaLayer.Structure]: {
        [DEFAULT_PIZZAGNA_ROOT]: {
            id: DEFAULT_PIZZAGNA_ROOT, // base layout of the configurator - all form components referenced herein will be stacked in a column
            componentType: FormStackComponent.lateLoadKey,
            properties: {
                elementClass: "flex-grow-1 overflow-auto nui-scroll-shadows", // references to other components laid out in this form
                nodes: ["presentation", "dataAndCalculations"],
            },
            providers: {
                [WellKnownProviders.FormattersRegistry]: {
                    providerId: NOVA_PROPORTIONAL_CONTENT_FORMATTERS_REGISTRY,
                },
            },
        }, // /presentation
        presentation: {
            id: "presentation",
            componentType: WidgetConfiguratorSectionComponent.lateLoadKey,
            properties: {
                headerText: "Presentation",
                nodes: ["titleAndDescription"],
            },
        }, // /presentation/titleAndDescription
        titleAndDescription: {
            id: "titleAndDescription",
            componentType:
                TitleAndDescriptionConfigurationComponent.lateLoadKey,
            providers: {
                [WellKnownProviders.Converter]: {
                    providerId: NOVA_TITLE_AND_DESCRIPTION_CONVERTER,
                },
            },
        }, // will be replaced with new chart options
        // /presentation/chartOptionsEditor
        // chartOptionsEditor: {
        //     id: "chartOptionsEditor",
        //     componentType: ProportionalChartOptionsEditorComponent.lateLoadKey,
        //     properties: {
        //         chartOptions: {
        //             chartTypes: [
        //                 "VerticalBarChart",
        //                 "HorizontalBarChart",
        //             ],
        //             legendPlacementOptions: [
        //                 {
        //                     id: LegendPlacement.None,
        //                     label: $localize`None`,
        //                 },
        //                 {
        //                     id: LegendPlacement.Right,
        //                     label: $localize`Right`,
        //                 },
        //                 {
        //                     id: LegendPlacement.Bottom,
        //                     label: $localize`Bottom`,
        //                 },
        //             ],
        //             contentFormatters: [
        //                 {
        //                     componentType:
        //                     DonutContentRawFormatterComponent.lateLoadKey,
        //                     label: $localize`Raw`,
        //                 },
        //                 {
        //                     componentType:
        //                     DonutContentSumFormatterComponent.lateLoadKey,
        //                     label: $localize`Sum`,
        //                 },
        //                 {
        //                     componentType:
        //                     DonutContentPercentageFormatterComponent.lateLoadKey,
        //                     label: $localize`Percentage`,
        //                     configurationComponent:
        //                         "DonutContentPercentageConfigurationComponent",
        //                 },
        //             ] as IFormatterDefinition[],
        //             legendFormatters: [
        //                 {
        //                     componentType:
        //                     StatusWithIconFormatterComponent.lateLoadKey,
        //                     label: $localize`Status With Icon`,
        //                 },
        //                 {
        //                     componentType: LinkFormatterComponent.lateLoadKey,
        //                     label: $localize`Link`,
        //                 },
        //             ] as IFormatterDefinition[],
        //         },
        //     },
        //     providers: {
        //         // converter transforms the chart options data between the widget and the form
        //         [WellKnownProviders.Converter]: {
        //             providerId:
        //             NOVA_PROPORTIONAL_WIDGET_CHART_OPTIONS_CONVERTER,
        //         },
        //     },
        // },
        refresher: REFRESHER_CONFIGURATOR, // /dataAndCalculations
        dataAndCalculations: {
            id: "dataAndCalculations",
            componentType: WidgetConfiguratorSectionComponent.lateLoadKey,
            properties: {
                headerText: $localize`Data and Calculations`,
                nodes: ["dataSource"],
            },
        }, // /dataAndCalculations/dataSource
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
                                previewPath: "chart.providers.dataSource", // TODO: Remove 'properties' key in v10 - NUI-5831
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
            },
        },
    },
};
