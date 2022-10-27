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

import { GridsterItem } from "angular-gridster2";

import {
    IProviderConfiguration,
    IWidget,
    NOVA_KPI_DATASOURCE_ADAPTER,
    PizzagnaLayer,
    WellKnownProviders,
} from "@nova-ui/dashboards";

import { AcmeKpiDataSource } from "./datasources";

const getKpiWidgetCfg = (id: string) => ({
    id: `${id}`,
    type: "kpi",
    pizzagna: {
        [PizzagnaLayer.Configuration]: {
            header: {
                properties: {
                    title: "KPI Widget!",
                    subtitle: "A bunch of number boxes",
                    collapsible: true,
                },
            },
            tiles: {
                providers: {},
                properties: {
                    nodes: ["kpi1"],
                },
            },
            kpi1: {
                id: "kpi1",
                providers: {
                    [WellKnownProviders.DataSource]: {
                        providerId: AcmeKpiDataSource.providerId,
                    } as IProviderConfiguration,
                    [WellKnownProviders.Adapter]: {
                        providerId: NOVA_KPI_DATASOURCE_ADAPTER,
                        properties: {
                            componentId: "kpi1",
                            propertyPath: "widgetData",
                        },
                    } as IProviderConfiguration,
                },
            },
        },
    },
});

function generateKpiWidgets(
    quantity: number
): [IWidget[], Record<string, GridsterItem>] {
    const _widgets: IWidget[] = [];
    const _positions: Record<string, GridsterItem> = {};

    const initPosition = {
        cols: 8,
        rows: 6,
        y: 0,
        x: 0,
    };

    for (let i = 0; i <= quantity; i++) {
        const id = `widget${i.toString()}`;
        const widget = getKpiWidgetCfg(id);

        const prevWidgetPosition = _positions[`widget${(i - 1).toString()}`];
        const widgetPosition = prevWidgetPosition
            ? {
                  ...prevWidgetPosition,
                  y: prevWidgetPosition.y + 6,
              }
            : initPosition;

        _widgets.push(widget);
        _positions[id] = widgetPosition;
    }

    return [_widgets, _positions];
}

export const [widgets, positions] = generateKpiWidgets(15);
