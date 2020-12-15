import { CHART_PALETTE_CS3, CHART_PALETTE_CS_S_EXTENDED } from "@solarwinds/nova-charts";
import zipObject from "lodash/zipObject";

export const CHART_PALETTE_CS3_ALTERNATIVE_NAMES = [
    $localize `Blue`,
    $localize `Blue Light`,
    $localize `Blue Dark`,
    $localize `Pink`,
    $localize `Pink Light`,
    $localize `Pink Dark`,
    $localize `Sea Green`,
    $localize `Sea Green Light`,
    $localize `Sea Green Dark`,
    $localize `Violet`,
    $localize `Violet Light`,
    $localize `Violet Dark`,
    $localize `Lime Green`,
    $localize `Lime Green Light`,
    $localize `Lime Green Dark`,
    $localize `Orange`,
    $localize `Orange Light`,
    $localize `Orange Dark`,
    $localize `Ultramarine`,
    $localize `Ultramarine Light`,
    $localize `Ultramarine Dark`,
    $localize `Bordeaux`,
    $localize `Bordeaux Light`,
    $localize `Bordeaux Dark`,
    $localize `Ochroid`,
    $localize `Ochroid Light`,
    $localize `Ochroid Dark`,
    $localize `Anthracite`,
    $localize `Anthracite Light`,
    $localize `Anthracite Dark`,
];

export const CHART_PALETTE_CS_S_EXTENDED_ALTERNATIVE_NAMES = [
    $localize `Down`,
    $localize `Down Light`,
    $localize `Critical`,
    $localize `Critical Light`,
    $localize `Warning`,
    $localize `Warning Light`,
    $localize `Unknown`,
    $localize `Unknown Light`,
    $localize `Ok`,
    $localize `Ok Light`,
    $localize `Info`,
    $localize `Info Light`,
];

export const chartPaletteColorMap: Record<string, string> = zipObject([...CHART_PALETTE_CS3, ...CHART_PALETTE_CS_S_EXTENDED],
                                                    [...CHART_PALETTE_CS3_ALTERNATIVE_NAMES, ...CHART_PALETTE_CS_S_EXTENDED_ALTERNATIVE_NAMES]);

export const DEFAULT_KPI_TILE_COLOR = "var(--nui-color-bg-secondary)";
export const DEFAULT_KPI_BACKGROUND_COLORS = [...CHART_PALETTE_CS3, ...CHART_PALETTE_CS_S_EXTENDED].map(color =>
    ({
        color,
        label: chartPaletteColorMap[color],
    }));
