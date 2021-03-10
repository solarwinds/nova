// tslint:disable:max-line-length
import { IFormatterDefinition } from "../../components/types";
import { FormStackComponent } from "../../configurator/components/form-stack/form-stack.component";
import { IconFormatterComponent } from "../../configurator/components/formatters/icon-formatter/icon-formatter.component";
import { LinkFormatterComponent } from "../../configurator/components/formatters/link-formatter/link-formatter.component";
import { RawFormatterComponent } from "../../configurator/components/formatters/raw-formatter/raw-formatter.component";
import { WidgetConfiguratorSectionComponent } from "../../configurator/components/widget-configurator-section/widget-configurator-section.component";
import { DataSourceConfigurationComponent } from "../../configurator/components/widgets/configurator-items/data-source-configuration/data-source-configuration.component";
import { TitleAndDescriptionConfigurationComponent } from "../../configurator/components/widgets/configurator-items/title-and-description-configuration/title-and-description-configuration.component";
import { TableColumnsConfigurationV2Component } from "../../configurator/components/widgets/table/columns-editor-v2/table-columns-configuration-v2.component";
import { TableFiltersEditorComponent } from "../../configurator/components/widgets/table/filters-editor/table-filters-editor.component";
import {
    DEFAULT_PIZZAGNA_ROOT,
    NOVA_CONFIGURATOR_DATA_SOURCE_MANAGER,
    NOVA_GENERIC_CONVERTER,
    NOVA_TABLE_COLUMNS_CONVERTER,
    NOVA_TABLE_FILTERS_CONVERTER,
    NOVA_TABLE_FORMATTERS_REGISTRY,
    NOVA_TITLE_AND_DESCRIPTION_CONVERTER,
} from "../../services/types";
import { IPizzagna, PizzagnaLayer, WellKnownProviders } from "../../types";
import { REFRESHER_CONFIGURATOR } from "../common/configurator/components";
// tslint:enable:max-line-length

export const DEFAULT_TABLE_FORMATTERS: IFormatterDefinition[] = [
    {
        componentType: RawFormatterComponent.lateLoadKey,
        label: $localize`No Formatter`,
        dataTypes: {
            // @ts-ignore
            value: null,
        },
    },
    {
        componentType: LinkFormatterComponent.lateLoadKey,
        label: $localize`Link`,
        configurationComponent: "LinkConfiguratorComponent",
        dataTypes: {
            value: "label",
            link: "link",
        },
    },
    {
        componentType: IconFormatterComponent.lateLoadKey,
        label: $localize`Icon`,
        dataTypes: {
            value: "string",
        },
    },
];

export const tableConfigurator: IPizzagna = {
    [PizzagnaLayer.Structure]: {
        [DEFAULT_PIZZAGNA_ROOT]: {
            // base layout of the configurator - all form components referenced herein will be stacked in a column
            id: DEFAULT_PIZZAGNA_ROOT,
            componentType: FormStackComponent.lateLoadKey,
            properties: {
                elementClass: "flex-grow-1 overflow-auto nui-scroll-shadows",
                // references to other components laid out in this form
                nodes: ["presentation", "dataAndCalculations", "columns"],
            },
            providers: {
                [WellKnownProviders.FormattersRegistry]: {
                    providerId: NOVA_TABLE_FORMATTERS_REGISTRY,
                },
                [WellKnownProviders.DataSourceManager]: {
                    providerId: NOVA_CONFIGURATOR_DATA_SOURCE_MANAGER,
                },
            },
        },
        // /presentation
        presentation: {
            id: "presentation",
            componentType: WidgetConfiguratorSectionComponent.lateLoadKey,
            properties: {
                headerText: $localize`Presentation`,
                // references to other components laid out in this form
                nodes: ["titleAndDescription", "filters"],
            },
        },
        // /presentation/titleAndDescription
        titleAndDescription: {
            id: "titleAndDescription",
            componentType: TitleAndDescriptionConfigurationComponent.lateLoadKey,
            providers: {
                [WellKnownProviders.Converter]: {
                    providerId: NOVA_TITLE_AND_DESCRIPTION_CONVERTER,
                },
            },
        },
        // /presentation/filters - configuration of built-in filters like search, sorting and pagination
        filters: {
            id: "filters",
            componentType: TableFiltersEditorComponent.lateLoadKey,
            providers: {
                [WellKnownProviders.Converter]: {
                    providerId: NOVA_TABLE_FILTERS_CONVERTER,
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
                dataSourceProviders: [],
            },
            providers: {
                [WellKnownProviders.Converter]: {
                    providerId: NOVA_GENERIC_CONVERTER,
                    properties: {
                        formParts: [
                            {
                                previewPath: "table.providers.dataSource",
                                // TODO: Remove 'properties' key in v10 - NUI-5831
                                keys: ["providerId", "properties"],
                            },
                            {
                                previewPath: "table.providers.adapter.properties.dataSource",
                                keys: ["properties"],
                            },
                        ],
                    },
                },
            },
        },
        // A very important part of this configuration form is the 'columns' section. It manages the configuration of columns and formatters that are used
        // to display data in this table. Every column has multiple properties associated with it like: label, width, formatter and how to map incoming data
        // into the formatter.
        columns: {
            id: "columns",
            componentType: TableColumnsConfigurationV2Component.lateLoadKey,
            properties: {
                // Deprecated (see TableColumnsConfigurationV2Component.template)
                template: [
                    {},
                    {
                        properties: {
                            formatters: DEFAULT_TABLE_FORMATTERS,
                        },
                    },
                ],
            },
            providers: {
                [WellKnownProviders.Converter]: {
                    // this specialized converter does all the work with building the complex forms for every column of the table and mapping the data back
                    // to the widget configuration that builds the table component from the individual column configurations
                    providerId: NOVA_TABLE_COLUMNS_CONVERTER,
                },
            },
        },
    },
};
