import {
    IAllAround,
    IBorderConfig,
    IDimensionConfig,
    IGridConfig,
} from "../types";
import { DimensionConfig } from "./dimension-config";

/** See {@link IGridConfig} */
export class GridConfig implements IGridConfig {
    // We should avoid this kind of option in future versions of GridConfig
    // because ideally all plugins should be added manually (NUI-3304).
    /** See {@link IGridConfig#interactive} */
    public interactive: boolean = true;

    /** See {@link IGridConfig#dimension} */
    public dimension: IDimensionConfig = new DimensionConfig();
    /** See {@link IGridConfig#borders} */
    public borders: IAllAround<IBorderConfig> = {
        // TODO: Review this
        // @ts-ignore
        top: undefined,
        // @ts-ignore
        bottom: undefined,
        // @ts-ignore
        left: undefined,
        // @ts-ignore
        right: undefined,
    };
    /** See {@link IGridConfig#cursor} */
    public cursor = "crosshair";
    /** See {@link IGridConfig#disableRenderAreaHeightCorrection} */
    public disableRenderAreaHeightCorrection = false;
    /** See {@link IGridConfig#disableRenderAreaWidthCorrection} */
    public disableRenderAreaWidthCorrection = false;
}
