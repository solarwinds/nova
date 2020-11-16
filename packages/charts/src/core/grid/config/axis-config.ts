import { defaultTextOverflowHandler } from "../default-text-overflow-handler";
import { IAxisConfig, ITickLabelConfig } from "../types";

/** See {@link IAxisConfig} */
export class AxisConfig implements IAxisConfig {
    /** See {@link IAxisConfig#visible} */
    public visible: boolean = true;

    /** See {@link IAxisConfig#gridTicks} */
    public gridTicks: boolean = false;

    /** See {@link IAxisConfig#tickSize} */
    public tickSize: number = 5;

    /** See {@link IAxisConfig#tickLabel} */
    public tickLabel: ITickLabelConfig = {
        horizontalPadding: 0,
        overflowHandler: defaultTextOverflowHandler,
    };

    /** See {@link IAxisConfig#fit} */
    public fit: boolean = false;

    private _approximateTicks: number = 5;

    /** See {@link IAxisConfig#approximateTicks} */
    get approximateTicks(): any {
        return this._approximateTicks;
    }

    /** See {@link IAxisConfig#approximateTicks} */
    set approximateTicks(ticks: any) {
        this._approximateTicks = parseInt(ticks, 10);
    }

    public padding: number = 0;
}
