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
        "configurator": {
            [WellKnownPathKey.Root]: DEFAULT_PIZZAGNA_ROOT,
        },
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
