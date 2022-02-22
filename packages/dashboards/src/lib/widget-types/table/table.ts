import { DEFAULT_PIZZAGNA_ROOT } from "../../services/types";
import { WellKnownPathKey } from "../../types";
import { IWidgetTypeDefinition } from "../../components/widget/types";

import { tableConfigurator } from "./table-configurator";
import { tableWidget } from "./table-widget";

export const table: IWidgetTypeDefinition = {
    "paths": {
        "widget": {
            [WellKnownPathKey.Root]: DEFAULT_PIZZAGNA_ROOT,
        },
        "configurator": {
            [WellKnownPathKey.Root]: DEFAULT_PIZZAGNA_ROOT,
            [WellKnownPathKey.DataSourceConfigComponentType]: "dataSource.componentType",
            [WellKnownPathKey.DataSourceProviders]: "dataSource.properties.dataSourceProviders",
            [WellKnownPathKey.Formatters]: "columns.properties.template[1].properties.formatters",
        },
    },
    widget: tableWidget,
    configurator: tableConfigurator,
};
