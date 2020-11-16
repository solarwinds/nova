import { DEFAULT_PIZZAGNA_ROOT } from "../../services/types";
import { IWidgetTypeDefinition, WellKnownPathKey } from "../../types";

import { timeseriesConfigurator } from "./timeseries-configurator";
import { timeseriesWidget } from "./timeseries-widget";

/***********************************************************************************************************
 * Timeseries widget definition starts here
 ***********************************************************************************************************/
export const timeseries: IWidgetTypeDefinition = {
    /***************************************************************************************************
     *  Paths to important settings in this type definition
     ***************************************************************************************************/
    "paths": {
        "widget": {
            [WellKnownPathKey.Root]: DEFAULT_PIZZAGNA_ROOT,
        },
        "configurator": {
            [WellKnownPathKey.Root]: DEFAULT_PIZZAGNA_ROOT,
            // this points at the component type you need to change if you want to change the component for data source configuration
            [WellKnownPathKey.DataSourceConfigComponentType]: "dataSource.componentType",
            // for the default data source configuration component, this changes the list of data sources to pick from
            [WellKnownPathKey.DataSourceProviders]: "dataSource.properties.dataSourceProviders",
        },
    },
    /***************************************************************************************************
     *  Widget section describes the structural part of the Timeseries widget
     ***************************************************************************************************/
    "widget": timeseriesWidget,
    /***************************************************************************************************
     *  Configurator section describes the form that is used to configure the widget
     ***************************************************************************************************/
    "configurator": timeseriesConfigurator,
};
