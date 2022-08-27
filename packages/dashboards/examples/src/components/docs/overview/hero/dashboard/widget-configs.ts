import { GridsterItem } from "angular-gridster2";

import { IWidget } from "@nova-ui/dashboards";

import { kpiConfig } from "../widget-configs/kpi";
import { proportionalConfig } from "../widget-configs/proportional";
import { tableConfig } from "../widget-configs/table";
import { timeseriesConfig } from "../widget-configs/timeseries";

export const positions: Record<string, GridsterItem> = {
    [tableConfig.id]: {
        cols: 7,
        rows: 7,
        y: 0,
        x: 0,
    },
    [proportionalConfig.id]: {
        cols: 5,
        rows: 7,
        y: 0,
        x: 7,
    },
    [kpiConfig.id]: {
        cols: 6,
        rows: 7,
        y: 7,
        x: 0,
    },
    [timeseriesConfig.id]: {
        cols: 6,
        rows: 7,
        y: 7,
        x: 6,
    },
};

export const widgets: IWidget[] = [
    {
        ...tableConfig,
    },
    {
        ...proportionalConfig,
    },
    {
        ...kpiConfig,
    },
    {
        ...timeseriesConfig,
    },
];
