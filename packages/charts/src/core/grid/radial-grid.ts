import isUndefined from "lodash/isUndefined";
import { Grid } from "./grid";
import {
    IDimensions,
    IGrid,
} from "./types";

/** @ignore */
export class RadialGrid extends Grid implements IGrid {

    public build(): IGrid {
        super.build();
        this.recenter();

        return this;
    }

    public updateDimensions(dimensions: IDimensions): IGrid {
        const dimensionConfig = this.config().dimension;
        if (!isUndefined(dimensions.width)) {
            dimensionConfig.outerWidth(dimensions.width)
        }
        if (!isUndefined(dimensions.height)) {
            dimensionConfig.outerHeight(dimensions.height)
        }

        // TODO: Chart's update: this.grid.scales = collectScales(seriesSet) may not yet happened
        if (this.scales) {
            const radiusScale = this.scales["r"];
            if (radiusScale) {
                radiusScale.list[0].range([0, Math.min(dimensionConfig.width(), dimensionConfig.height()) / 2]);
            }
        }

        this.adjustRenderingArea();
        this.updateRanges();
        // This setTimeout is for the safari browser which has problems rendering radial charts during animations
        // e.g. inside an expander that opens with an animation
        setTimeout(() => {
            this.recenter();
        });

        return this;
    }

    protected adjustRenderingArea = () => {
        const d = this.config().dimension;
        const attrs = {
            "width": d.outerWidth(),
            "height": d.outerHeight(),
            "transform": `translate(${-d.outerWidth() / 2}, ${-d.outerHeight() / 2})`,
        };
        this.renderingAreaClipPath.attrs(attrs);
        this.renderingArea.attrs(attrs);
    }

    private recenter() {
        this.container.attrs({
            "transform": `translate(${this.config().dimension.outerWidth() / 2},${this.config().dimension.outerHeight() / 2})`,
        });
    }
}
