import {
    IProviderConfiguration,
    IWidget,
    NOVA_KPI_DATASOURCE_ADAPTER,
    PizzagnaLayer,
    WellKnownProviders
} from "@nova-ui/dashboards";
import { GridsterItem } from "angular-gridster2";

import { AcmeKpiDataSource } from "./datasources";

const getKpiWidgetCfg = (id: string) => ({
    id: `${id}`,
    type: "kpi",
    pizzagna: {
        [PizzagnaLayer.Configuration]: {
            "header": {
                "properties": {
                    "title": "KPI Widget!",
                    "subtitle": "A bunch of number boxes",
                    "collapsible": true,
                },
            },
            "tiles": {
                providers: { },
                "properties": {
                    "nodes": [
                        "kpi1",
                    ],
                },
            },
            "kpi1": {
                "id": "kpi1",
                "providers": {
                    [WellKnownProviders.DataSource]: {
                        "providerId": AcmeKpiDataSource.providerId,
                    } as IProviderConfiguration,
                    [WellKnownProviders.Adapter]: {
                        "providerId": NOVA_KPI_DATASOURCE_ADAPTER,
                        "properties": {
                            "componentId": "kpi1",
                            "propertyPath": "widgetData",
                        },
                    } as IProviderConfiguration,
                },
            },
        },
    },
});

function generateKpiWidgets(quantity: number): [IWidget[], Record<string, GridsterItem>] {
    const _widgets: IWidget[] = [];
    const _positions: Record<string, GridsterItem> = {};

    const initPosition = {
        "cols": 8,
        "rows": 6,
        "y": 0,
        "x": 0,
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
