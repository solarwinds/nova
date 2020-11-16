import { Numeric } from "d3-array";

/**
 * Used for simplified threshold zone definition. It is expected the <code>start</code> to be <code>&lt; end</code>.
 */
export interface ISimpleThresholdZone {
    status: string;
    start?: number;
    end?: number;
}

export interface ZoneCross {
    status: string;
    start?: Numeric;
    end?: Numeric;
}

/**
 * Used for specifying the start or end boundary of a zone
 */
export enum ZoneBoundary {
    Start = "start",
    End = "end",
}
