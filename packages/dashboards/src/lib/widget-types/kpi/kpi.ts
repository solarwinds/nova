import { IWidgetTypeDefinition } from "../../components/widget/types";
import { DEFAULT_PIZZAGNA_ROOT } from "../../services/types";
import { WellKnownPathKey } from "../../types";
import { kpiConfigurator } from "./kpi-configurator";
import { kpiWidget } from "./kpi-widget";

const tileDescriptionConfiguratorTemplatePath = `tiles.properties.template[0]`;
const dataSourceConfiguratorTemplatePath = `tiles.properties.template[1]`;
const backgroundColorRulesConfiguratorTemplatePath = `tiles.properties.template[3]`;

/***********************************************************************************************************
 * KPI widget definition starts here
 ***********************************************************************************************************/
export const kpi: IWidgetTypeDefinition = {
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
            [WellKnownPathKey.DataSourceConfigComponentType]: `${dataSourceConfiguratorTemplatePath}.componentType`,
            // this points at the component type you need to change if you want to change the component for tile description configuration
            [WellKnownPathKey.TileDescriptionConfigComponentType]: `${tileDescriptionConfiguratorTemplatePath}.componentType`,
            // for the default data source configuration component, this changes the list of data sources to pick from
            [WellKnownPathKey.DataSourceProviders]: `${dataSourceConfiguratorTemplatePath}.properties.dataSourceProviders`,
            // this points to the Tile's description background color picker
            [WellKnownPathKey.TileDescriptionBackgroundColors]: `${tileDescriptionConfiguratorTemplatePath}.properties.backgroundColors`,
            // this points to the Background Color Rules background color picker
            [WellKnownPathKey.TileBackgroundColorRulesBackgroundColors]: `${backgroundColorRulesConfiguratorTemplatePath}.properties.backgroundColors`,
        },
    },
    /***************************************************************************************************
     *  Widget section describes the structural part of the KPI widget
     ***************************************************************************************************/
    widget: kpiWidget,
    /***************************************************************************************************
     *  Configurator section describes the form that is used to configure the widget
     ***************************************************************************************************/
    configurator: kpiConfigurator,
};
