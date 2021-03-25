/* eslint-disable max-len */
import { FormStackComponent } from "../../configurator/components/form-stack/form-stack.component";
import { WidgetConfiguratorSectionComponent } from "../../configurator/components/widget-configurator-section/widget-configurator-section.component";
import { DataSourceConfigurationComponent } from "../../configurator/components/widgets/configurator-items/data-source-configuration/data-source-configuration.component";
import { TitleAndDescriptionConfigurationComponent } from "../../configurator/components/widgets/configurator-items/title-and-description-configuration/title-and-description-configuration.component";
import { EntityFormattingConfigurationComponent } from "../../configurator/components/widgets/drilldown/entity-formatting-configuration/entity-formatting-configuration.component";
import { GroupingConfigurationComponent } from "../../configurator/components/widgets/drilldown/grouping-configuration/grouping-configuration.component";
import { IConverterFormPartsProperties } from "../../configurator/services/converters/types";
import { DEFAULT_PIZZAGNA_ROOT, NOVA_GENERIC_CONVERTER, NOVA_TITLE_AND_DESCRIPTION_CONVERTER } from "../../services/types";
import { IProviderConfiguration, PizzagnaLayer, WellKnownProviders } from "../../types";
/* eslint-enable max-len */

export const drilldownConfigurator = {
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
                ],
            },
        },
        // /presentation
        presentation: {
            id: "presentation",
            componentType: WidgetConfiguratorSectionComponent.lateLoadKey,
            properties: {
                headerText: $localize`Presentation`,
                nodes: ["titleAndDescription"],
            },
        },
        // /presentation/titleAndDescription
        titleAndDescription: {
            id: "titleAndDescription",
            componentType: TitleAndDescriptionConfigurationComponent.lateLoadKey,
            providers: {
                converter: {
                    providerId: NOVA_TITLE_AND_DESCRIPTION_CONVERTER,
                },
            },
        },
        // /dataAndCalculations
        dataAndCalculations: {
            id: "dataAndCalculations",
            componentType: WidgetConfiguratorSectionComponent.lateLoadKey,
            properties: {
                headerText: $localize`Data and calculations`,
                nodes: ["dataSource", "grouping", "entityFormatting"],
            },
        },
        dataSource: {
            id: "dataSource",
            componentType: DataSourceConfigurationComponent.lateLoadKey,
            properties: {
                // for the DataSourceConfigurationComponent, this defines the list of data sources to pick from
                dataSourceProviders: [] as string[],
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
                                keys: ["providerId"],
                            },
                        ] as IConverterFormPartsProperties[],
                    },
                } as IProviderConfiguration,
            },
        },
        // /dataAndCalculations/grouping
        grouping: {
            id: "grouping",
            componentType: GroupingConfigurationComponent.lateLoadKey,
            properties: {
                // all available groups
                groups: [],
                // grouping for the list widget
                groupBy: [],
            },
            providers: {
                [WellKnownProviders.Converter]: {
                    providerId: NOVA_GENERIC_CONVERTER,
                    properties: {
                        formParts: [
                            {
                                previewPath: `listWidget.providers.${WellKnownProviders.Adapter}.properties`,
                                keys: ["groupBy", "drillstate", "groups"],
                            },
                        ] as IConverterFormPartsProperties[],
                    },
                } as IProviderConfiguration,
            },
        },
        // /dataAndCalculations/entityFormatting
        entityFormatting: {
            id: "entityFormatting",
            componentType: EntityFormattingConfigurationComponent.lateLoadKey,
            properties: {
                // TODO: Should be taken dynamically from DataSource. See NUI-5583
                mappingKeys: ["icon_status", "capital", "name", "icon", "url"],
                dataFieldIds: {
                    icon: "icon",
                    status: "icon_status",
                    detailedUrl: "capital",
                    label: "name",
                    url: "url",
                },
            },
            providers: {
                [WellKnownProviders.Converter]: {
                    providerId: NOVA_GENERIC_CONVERTER,
                    properties: {
                        formParts: [
                            {
                                previewPath: `listWidget.providers.${WellKnownProviders.Adapter}.properties.componentsConfig.leaf.properties`,
                                keys: ["dataFieldIds"],
                            },
                        ] as IConverterFormPartsProperties[],
                    },
                } as IProviderConfiguration,
            },
        },
    },
};
