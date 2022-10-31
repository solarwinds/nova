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
import { tableConfigurator } from "./table-configurator";
import { tableWidget } from "./table-widget";

export const table: IWidgetTypeDefinition = {
    paths: {
        widget: {
            [WellKnownPathKey.Root]: DEFAULT_PIZZAGNA_ROOT,
        },
        configurator: {
            [WellKnownPathKey.Root]: DEFAULT_PIZZAGNA_ROOT,
            [WellKnownPathKey.DataSourceConfigComponentType]:
                "dataSource.componentType",
            [WellKnownPathKey.DataSourceProviders]:
                "dataSource.properties.dataSourceProviders",
            [WellKnownPathKey.Formatters]:
                "columns.properties.template[1].properties.formatters",
        },
    },
    widget: tableWidget,
    configurator: tableConfigurator,
};
