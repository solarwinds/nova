import { DEFAULT_PIZZAGNA_ROOT } from "../../services/types";
import { IWidgetTypeDefinition, WellKnownPathKey } from "../../types";

import { drilldownConfigurator } from "./drilldown-configurator";
import { drilldownWidget } from "./drilldown-widget";

/***********************************************************************************************************
 * Drilldown widget definition starts here
 ***********************************************************************************************************/
export const drilldown: IWidgetTypeDefinition = {
    /***************************************************************************************************
     *  Paths to important settings in this type definition
     ***************************************************************************************************/
    "paths": {
        "widget": {
            [WellKnownPathKey.Root]: DEFAULT_PIZZAGNA_ROOT,
        },
        // "configurator": {
        //     [WellKnownPathKey.Root]: DEFAULT_PIZZAGNA_ROOT,
        //     // this points at the component type you need to change if you want to change the component for data source configuration
        //     [WellKnownPathKey.DataSourceConfigComponentType]: `${dataSourceConfiguratorTemplatePath}.componentType`,
        //     // this points at the component type you need to change if you want to change the component for tile description configuration
        //     [WellKnownPathKey.TileDescriptionConfigComponentType]: `${tileDescriptionConfiguratorTemplatePath}.componentType`,
        //     // for the default data source configuration component, this changes the list of data sources to pick from
        //     [WellKnownPathKey.DataSourceProviders]: `${dataSourceConfiguratorTemplatePath}.properties.dataSourceProviders`,
        // },
    },
    /***************************************************************************************************
     *  Widget section describes the structural part of the KPI widget
     ***************************************************************************************************/
    "widget": drilldownWidget,
    /***************************************************************************************************
     *  Configurator section describes the form that is used to configure the widget
     ***************************************************************************************************/
    "configurator": drilldownConfigurator,
};
