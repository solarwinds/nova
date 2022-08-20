import { DEFAULT_PIZZAGNA_ROOT } from "../../services/types";
import { WellKnownPathKey } from "../../types";
import { IWidgetTypeDefinition } from "../../components/widget/types";

import { proportionalConfigurator } from "./proportional-configurator";
import { proportionalWidget } from "./proportional-widget";

/***********************************************************************************************************
 * Proportional widget definition starts here
 ***********************************************************************************************************/
export const proportional: IWidgetTypeDefinition = {
    /***************************************************************************************************
     *  Paths to important settings in this type definition
     ***************************************************************************************************/
    paths: {
        widget: {
            [WellKnownPathKey.Root]: DEFAULT_PIZZAGNA_ROOT,
        },
        configurator: {
            [WellKnownPathKey.Root]: DEFAULT_PIZZAGNA_ROOT,
            // this points at the component type you need to change if you want to change the component for data source configuration
            [WellKnownPathKey.DataSourceConfigComponentType]:
                "dataSource.componentType",
            // for the default data source configuration component, this changes the list of data sources to pick from
            [WellKnownPathKey.DataSourceProviders]:
                "dataSource.properties.dataSourceProviders",
            // this is where donut content chart formatters are defined
            [WellKnownPathKey.Formatters]:
                "chartOptionsEditor.properties.chartOptions.contentFormatters",
        },
    },
    /***************************************************************************************************
     *  Widget section describes the structural part of the proportional widget
     ***************************************************************************************************/
    widget: proportionalWidget,
    /***************************************************************************************************
     *  Configuration section describes the form that is used to configure the widget
     ***************************************************************************************************/
    configurator: proportionalConfigurator,
};
