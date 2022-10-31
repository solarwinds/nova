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

import { IWidgetTypeDefinition } from "../../components/widget/types";
import { DEFAULT_PIZZAGNA_ROOT } from "../../services/types";
import { WellKnownPathKey } from "../../types";
import { drilldownConfigurator } from "./drilldown-configurator";
import { drilldownWidget } from "./drilldown-widget";

/***********************************************************************************************************
 * Drilldown widget definition starts here
 ***********************************************************************************************************/
export const drilldown: IWidgetTypeDefinition = {
    /***************************************************************************************************
     *  Paths to important settings in this type definition
     ***************************************************************************************************/
    paths: {
        widget: {
            [WellKnownPathKey.Root]: DEFAULT_PIZZAGNA_ROOT,
        },
        configurator: {
            [WellKnownPathKey.Root]: DEFAULT_PIZZAGNA_ROOT,
            // for the default data source configuration component, this changes the list of data sources to pick from
            [WellKnownPathKey.DataSourceProviders]:
                "dataSource.properties.dataSourceProviders",
        },
    },
    /***************************************************************************************************
     *  Widget section describes the structural part of the KPI widget
     ***************************************************************************************************/
    widget: drilldownWidget,
    /***************************************************************************************************
     *  Configurator section describes the form that is used to configure the widget
     ***************************************************************************************************/
    configurator: drilldownConfigurator,
};
