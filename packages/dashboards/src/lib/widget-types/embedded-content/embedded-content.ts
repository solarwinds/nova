import { DEFAULT_PIZZAGNA_ROOT } from "../../services/types";
import { WellKnownPathKey } from "../../types";
import { IWidgetTypeDefinition } from "../../components/widget/types";

import { embeddedContentConfigurator } from "./embedded-content-configurator";
import { embeddedContentWidget } from "./embedded-content-widget";

/***********************************************************************************************************
 * EmbeddedContent widget definition starts here
 ***********************************************************************************************************/
export const embeddedContent: IWidgetTypeDefinition = {
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
     *  Widget section describes the structural part of the widget
     ***************************************************************************************************/
    "widget": embeddedContentWidget,
    /***************************************************************************************************
     *  Configurator section describes the form that is used to configure the widget
     ***************************************************************************************************/
    "configurator": embeddedContentConfigurator,
};
