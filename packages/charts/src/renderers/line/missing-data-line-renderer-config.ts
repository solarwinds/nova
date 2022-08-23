import { ILineRendererConfig } from "../types";
import { LineRenderer } from "./line-renderer";

/** Standard line renderer config for visualizing missing data */
export class MissingDataLineRendererConfig implements ILineRendererConfig {
    public strokeWidth = 1;
    public interactive = false;
    public strokeStyle = LineRenderer.getStrokeStyleDashed(1);
    public useEnhancedLineCaps = true;
}
