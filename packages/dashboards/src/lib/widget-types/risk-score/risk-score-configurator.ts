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
import { IBroadcasterConfig } from "../../components/providers/types";
import { IFormatterDefinition } from "../../components/types";
import { FormStackComponent } from "../../configurator/components/form-stack/form-stack.component";
import { RawFormatterComponent } from "../../configurator/components/formatters/raw-formatter/raw-formatter.component";
import { WidgetConfiguratorSectionComponent } from "../../configurator/components/widget-configurator-section/widget-configurator-section.component";
import { DataSourceConfigurationComponent } from "../../configurator/components/widgets/configurator-items/data-source-configuration/data-source-configuration.component";
import { DataSourceErrorComponent } from "../../configurator/components/widgets/configurator-items/data-source-error/data-source-error.component";
import { RiskScoreTileDescriptionConfigurationComponent } from "../../configurator/components/widgets/configurator-items/risk-score-tile-description-configuration/risk-score-tile-description-configuration.component";
import { TitleAndDescriptionConfigurationComponent } from "../../configurator/components/widgets/configurator-items/title-and-description-configuration/title-and-description-configuration.component";
import { RiskScoreTilesConfigurationComponent } from "../../configurator/components/widgets/risk-score/risk-score-tiles-configuration/risk-score-tiles-configuration.component";
import { PresentationConfigurationComponent } from "../../configurator/components/widgets/table/columns-editor/column-configuration/presentation-configuration/presentation-configuration.component";
import {
    DEFAULT_PIZZAGNA_ROOT,
    NOVA_RISK_SCORE_FORMATTERS_REGISTRY,
    NOVA_KPI_SECTION_CONVERTER,
    NOVA_KPI_TILES_CONVERTER,
    NOVA_PIZZAGNA_BROADCASTER,
    NOVA_TITLE_AND_DESCRIPTION_CONVERTER,
} from "../../services/types";
import {
    IProviderConfiguration,
    PizzagnaLayer,
    WellKnownProviders,
} from "../../types";
import { REFRESHER_CONFIGURATOR } from "../common/configurator/components";

/* eslint-enable max-len */

export const DEFAULT_RISK_SCORE_FORMATTERS: IFormatterDefinition[] = [
    {
        componentType: RawFormatterComponent.lateLoadKey,
        label: $localize`Raw Formatter`,
        dataTypes: {
            // @ts-ignore
            value: null,
        },
    },
];

export const riskScoreConfigurator = {
    [PizzagnaLayer.Structure]: {
        [DEFAULT_PIZZAGNA_ROOT]: {
            id: DEFAULT_PIZZAGNA_ROOT,
            // base layout of the configurator - all form components referenced herein will be stacked in a column
            componentType: FormStackComponent.lateLoadKey,
            properties: {
                elementClass: "flex-grow-1 overflow-auto nui-scroll-shadows",
                // references to other components laid out in this form
                nodes: ["presentation", "tiles"],
            },
            providers: {
                [WellKnownProviders.FormattersRegistry]: {
                    providerId: NOVA_RISK_SCORE_FORMATTERS_REGISTRY,
                },
            },
        },
        // /presentation
        presentation: {
            id: "presentation",
            componentType: WidgetConfiguratorSectionComponent.lateLoadKey,
            properties: {
                headerText: $localize`Presentation`,
                nodes: ["titleAndDescription", "refresher"],
            },
        },
        // /presentation/titleAndDescription
        titleAndDescription: {
            id: "titleAndDescription",
            componentType:
                TitleAndDescriptionConfigurationComponent.lateLoadKey,
            providers: {
                converter: {
                    providerId: NOVA_TITLE_AND_DESCRIPTION_CONVERTER,
                },
            },
        },
        refresher: REFRESHER_CONFIGURATOR,
        // /tiles
        tiles: {
            id: "tiles",
            componentType: RiskScoreTilesConfigurationComponent.lateLoadKey,
            properties: {
                // these components serve as a template for every KPI tile created
                template: [
                    {
                        // Risk Score tile description (label) configuration section
                        id: "description",
                        componentType:
                            RiskScoreTileDescriptionConfigurationComponent.lateLoadKey,
                        properties: {},
                        providers: {
                            // converter transforms the data between the widget and the form
                            [WellKnownProviders.Converter]: {
                                providerId: NOVA_KPI_SECTION_CONVERTER,
                                properties: {
                                    formParts: [
                                        {
                                            previewPath:
                                                "properties.widgetData",
                                            keys: [
                                                "label",
                                                "minValue",
                                                "maxValue",
                                                "description",
                                            ],
                                        },
                                    ],
                                },
                            } as IProviderConfiguration,
                        },
                    },
                    {
                        // data source configuration section
                        id: "dataSource",
                        componentType:
                            DataSourceConfigurationComponent.lateLoadKey,
                        properties: {
                            // for the DataSourceConfigurationComponent, this defines the list of data sources to pick from
                            dataSourceProviders: [] as string[],
                            errorComponent:
                                DataSourceErrorComponent.lateLoadKey,
                        },
                        providers: {
                            // converter transforms the data source metadata between the widget and the form
                            [WellKnownProviders.Converter]: {
                                providerId: NOVA_KPI_SECTION_CONVERTER,
                                properties: {
                                    formParts: [
                                        {
                                            // this component updates 'providerId' of 'dataSource'
                                            previewPath: "providers.dataSource",
                                            // TODO: Remove 'properties' key in v10 - NUI-5831
                                            keys: ["providerId", "properties"],
                                        },
                                        {
                                            // this component updates 'properties' of 'dataSource' via an adapter
                                            previewPath:
                                                "providers.adapter.properties.dataSource",
                                            keys: ["properties"],
                                        },
                                    ],
                                },
                            } as IProviderConfiguration,
                            [WellKnownProviders.Broadcaster]: {
                                providerId: NOVA_PIZZAGNA_BROADCASTER,
                                properties: {
                                    configs: [
                                        {
                                            trackOn: "component",
                                            key: "dataFieldIds",
                                            paths: [
                                                "data.{parentComponentId}/formatting.properties.dataFieldIds",
                                            ],
                                        },
                                    ] as IBroadcasterConfig[],
                                },
                            },
                        },
                    },
                    {
                        id: "formatting",
                        componentType:
                            PresentationConfigurationComponent.lateLoadKey,
                        providers: {
                            [WellKnownProviders.Converter]: {
                                providerId: NOVA_KPI_SECTION_CONVERTER,
                                properties: {
                                    formParts: [
                                        {
                                            previewPath:
                                                "properties.configuration.formatters.Value",
                                            keys: ["formatter"],
                                        },
                                    ],
                                },
                            } as IProviderConfiguration,
                        },
                        properties: {
                            // Note: Now you should define your formatters in the KpiFormatterRegistry which can contain more formatter options
                            // formatters: DEFAULT_RISK_SCORE_FORMATTERS,

                            // Set default formatter to the configuration section as RawFormatterComponent.
                            // In case Risk Scrore doesn't use the formatters yet, it will be overridden with default formatter value on first save
                            formatter: {
                                componentType:
                                    RawFormatterComponent.lateLoadKey,
                                properties: {
                                    dataFieldIds: {
                                        value: "value",
                                    },
                                },
                            },
                        },
                    },
                ],
            },
            providers: {
                // converter transforms the data between the widget and the form
                [WellKnownProviders.Converter]: {
                    providerId: NOVA_KPI_TILES_CONVERTER,
                } as IProviderConfiguration,
            },
        },
    },
};
