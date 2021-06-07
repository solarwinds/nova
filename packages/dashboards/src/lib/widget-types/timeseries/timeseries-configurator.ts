/* eslint-disable max-len */
import { LegendPlacement } from "../../components/types";
import { FormStackComponent } from "../../configurator/components/form-stack/form-stack.component";
import { WidgetConfiguratorSectionComponent } from "../../configurator/components/widget-configurator-section/widget-configurator-section.component";
import { DataSourceConfigurationComponent } from "../../configurator/components/widgets/configurator-items/data-source-configuration/data-source-configuration.component";
import { TimeseriesMetadataConfigurationComponent } from "../../configurator/components/widgets/configurator-items/timeseries-metadata-configuration/timeseries-metadata-configuration.component";
import { TitleAndDescriptionConfigurationComponent } from "../../configurator/components/widgets/configurator-items/title-and-description-configuration/title-and-description-configuration.component";
import { TimeseriesSeriesCollectionConfigurationComponent } from "../../configurator/components/widgets/timeseries/timeseries-series-collection-configuration/timeseries-series-collection-configuration.component";
import { TimeseriesTileDescriptionConfigurationComponent } from "../../configurator/components/widgets/timeseries/timeseries-tile-description-configuration/timeseries-tile-description-configuration.component";
import { TimeseriesTileIndicatorDataConfigurationComponent } from "../../configurator/components/widgets/timeseries/timeseries-tile-indicator-data-configuration/timeseries-tile-indicator-data-configuration.component";
import { IConverterFormPartsProperties } from "../../configurator/services/converters/types";
import {
    DEFAULT_PIZZAGNA_ROOT,
    NOVA_GENERIC_ARRAY_CONVERTER,
    NOVA_GENERIC_CONVERTER,
    NOVA_TIMESERIES_METADATA_CONVERTER,
    NOVA_TIMESERIES_SERIES_CONVERTER,
    NOVA_TIMESERIES_TILE_INDICATOR_DATA_CONVERTER,
    NOVA_TITLE_AND_DESCRIPTION_CONVERTER,
} from "../../services/types";
import { IPizzagna, IProviderConfiguration, PizzagnaLayer, WellKnownProviders } from "../../types";
import { REFRESHER_CONFIGURATOR } from "../common/configurator/components";
import { DataSourceErrorComponent } from "../../configurator/components/widgets/configurator-items/data-source-error-handling/data-source-error.component";
/* eslint-enable max-len */

export const timeseriesConfigurator: IPizzagna = {
    [PizzagnaLayer.Structure]: {
        [DEFAULT_PIZZAGNA_ROOT]: {
            id: DEFAULT_PIZZAGNA_ROOT,
            // base layout of the configurator - all form components referenced herein will be stacked in a column
            componentType: FormStackComponent.lateLoadKey,
            properties: {
                elementClass: "flex-grow-1 overflow-auto nui-scroll-shadows",
                // references to other components laid out in this form
                nodes: [
                    "presentation",
                    "dataAndCalculations",
                    "series",
                ],
            },
        },
        // /presentation
        presentation: {
            id: "presentation",
            componentType: WidgetConfiguratorSectionComponent.lateLoadKey,
            properties: {
                headerText: $localize`Presentation`,
                nodes: [
                    "titleAndDescription",
                    "timeseriesMetadata",
                ],
            },
        },
        // /presentation/titleAndDescription
        titleAndDescription: {
            id: "titleAndDescription",
            componentType: TitleAndDescriptionConfigurationComponent.lateLoadKey,
            providers: {
                [WellKnownProviders.Converter]: {
                    providerId: NOVA_TITLE_AND_DESCRIPTION_CONVERTER,
                } as IProviderConfiguration,
            },
        },
        // /presentation/timeseriesMetadata
        timeseriesMetadata: {
            id: "timeseriesMetadata",
            componentType: TimeseriesMetadataConfigurationComponent.lateLoadKey,
            properties: {
                legendPlacements: [
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
                // converter transforms the timeseries metadata configuration between the widget and the form
                [WellKnownProviders.Converter]: {
                    providerId: NOVA_TIMESERIES_METADATA_CONVERTER,
                } as IProviderConfiguration,
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
                errorHandlingComponent: DataSourceErrorComponent.lateLoadKey,
            },
            providers: {
                // converter transforms the data source metadata between the widget and the form
                [WellKnownProviders.Converter]: {
                    providerId: NOVA_GENERIC_CONVERTER,
                    properties: {
                        formParts: [
                            {
                                // this component updates 'providerId' of 'dataSource'
                                previewPath: "/.providers.dataSource",
                                // TODO: Remove 'properties' key in v10 - NUI-5831
                                keys: ["providerId", "properties"],
                            },
                            {
                                // this component updates 'properties' of 'dataSource' via an adapter
                                previewPath: "chart.providers.adapter.properties.dataSource",
                                keys: ["properties"],
                            },
                        ] as IConverterFormPartsProperties[],
                    },
                } as IProviderConfiguration,
            },
        },
        // /series
        series: {
            id: "series",
            componentType: TimeseriesSeriesCollectionConfigurationComponent.lateLoadKey,
            providers: {
                // converter transforms the data between the widget and the form
                [WellKnownProviders.Converter]: {
                    providerId: NOVA_TIMESERIES_SERIES_CONVERTER,
                } as IProviderConfiguration,
            },
            properties: {
                // these components serve as a template for every configured timeseries
                template: [
                    {
                        // series description (label) configuration section
                        id: "description",
                        componentType: TimeseriesTileDescriptionConfigurationComponent.lateLoadKey,
                        providers: {
                            // converter transforms the data between the widget and the form
                            [WellKnownProviders.Converter]: {
                                providerId: NOVA_GENERIC_ARRAY_CONVERTER,
                                properties: {
                                    formParts: [
                                        {
                                            // this component updates 'label' of 'series' via an adapter
                                            previewPath: "chart.providers.adapter.properties.series",
                                            keys: ["label"],
                                        },
                                    ] as IConverterFormPartsProperties[],
                                },
                            } as IProviderConfiguration,
                        },
                    },
                    {
                        // indicator data configuration section
                        id: "indicatorData",
                        componentType: TimeseriesTileIndicatorDataConfigurationComponent.lateLoadKey,
                        providers: {
                            // converter transforms the data such as the selected series between the widget and the form
                            [WellKnownProviders.Converter]: {
                                providerId: NOVA_TIMESERIES_TILE_INDICATOR_DATA_CONVERTER,
                            } as IProviderConfiguration,
                        },
                    },
                ],
            },
        },
    },
};
