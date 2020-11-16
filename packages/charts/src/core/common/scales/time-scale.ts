import { AxisScale } from "d3-axis";
import { scaleTime } from "d3-scale";

import { datetimeFormatter } from "./formatters/datetime-formatter";
import { Scale } from "./scale";

/**
 * Nova wrapper around [D3's scaleTime](https://d3indepth.com/scales/#scaletime)
 */
export class TimeScale extends Scale<Date> {

    constructor(id?: string) {
        super(id);

        this.formatters.tick = datetimeFormatter;
    }

    protected createD3Scale(): AxisScale<Date> {
        return scaleTime();
    }

    public convert(value: Date): number {
        return this._d3Scale(value);
    }

    public invert(coordinate: number): Date | undefined {
        const date = this._d3Scale.invert(coordinate);
        const result: Date | undefined = isNaN(date.getTime()) ? undefined : date;
        return result;
    }

    public isContinuous(): boolean {
        return true;
    }

    public isDomainValid(): boolean {
        return -1 === this.domain().findIndex((value) => isNaN(value.getTime()));
    }
}
