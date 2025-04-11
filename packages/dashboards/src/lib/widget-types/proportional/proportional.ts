// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import { proportionalConfigurator } from "./proportional-configurator";
import { proportionalWidget } from "./proportional-widget";
import { IWidgetTypeDefinition } from "../../components/widget/types";
import { DEFAULT_PIZZAGNA_ROOT } from "../../services/types";
import { WellKnownPathKey } from "../../types";

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
