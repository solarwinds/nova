import { IChartMarker, IChartPalette, IValueProvider } from "../types";

import { ChartPalette } from "./chart-palette";
import { CHART_MARKERS, CHART_PALETTE_CS1 } from "./palettes";
import { SequentialChartMarkerProvider } from "./sequential-chart-marker-provider";
import { SequentialColorProvider } from "./sequential-color-provider";

export function defaultColorProvider(): IValueProvider<string> {
    return new SequentialColorProvider(CHART_PALETTE_CS1);
}

export function defaultPalette(): IChartPalette {
    return new ChartPalette(defaultColorProvider());
}

export function defaultMarkerProvider(): IValueProvider<IChartMarker> {
    return new SequentialChartMarkerProvider(CHART_MARKERS);
}
