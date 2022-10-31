// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import isUndefined from "lodash/isUndefined";

import { Grid } from "./grid";
import { IDimensions, IGrid } from "./types";

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
            dimensionConfig.outerWidth(dimensions.width);
        }
        if (!isUndefined(dimensions.height)) {
            dimensionConfig.outerHeight(dimensions.height);
        }

        // TODO: Chart's update: this.grid.scales = collectScales(seriesSet) may not yet happened
        if (this.scales) {
            const radiusScale = this.scales["r"];
            if (radiusScale) {
                radiusScale.list[0].range([
                    0,
                    Math.min(
                        dimensionConfig.width(),
                        dimensionConfig.height()
                    ) / 2,
                ]);
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
            width: d.outerWidth(),
            height: d.outerHeight(),
            transform: `translate(${-d.outerWidth() / 2}, ${
                -d.outerHeight() / 2
            })`,
        };
        this.renderingAreaClipPath.attrs(attrs);
        this.renderingArea.attrs(attrs);
    };

    private recenter() {
        this.container.attrs({
            transform: `translate(${this.config().dimension.outerWidth() / 2},${
                this.config().dimension.outerHeight() / 2
            })`,
        });
    }
}
