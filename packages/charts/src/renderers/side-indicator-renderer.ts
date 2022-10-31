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

import defaultsDeep from "lodash/defaultsDeep";
import { Subject } from "rxjs";

import { STANDARD_RENDER_LAYERS } from "../constants";
import { Scales } from "../core/common/scales/types";
import {
    DataAccessor,
    IDataAccessors,
    IDataSeries,
    ILasagnaLayer,
    IRendererConfig,
    IRendererEventPayload,
    ISeriesAccessors,
    SeriesAccessor,
} from "../core/common/types";
import { GRAYSCALE_FILTER } from "../core/types";
import { IRenderSeries, RenderLayerName } from "./types";
import { XYRenderer } from "./xy-renderer";

/** Interface for side indicator data accessors */
export interface ISideIndicatorDataAccessors extends IDataAccessors {
    /** Accessor indicating whether the side indicator should be active */
    active: DataAccessor;
}

/** Interface for side indicator series accessors */
export interface ISideIndicatorSeriesAccessors extends ISeriesAccessors {
    /** Indicates the start value of the side indicator */
    start: SeriesAccessor;
    /** Indicates the end value of the side indicator */
    end: SeriesAccessor;
    /** Indicates the active color of the side indicator */
    activeColor: SeriesAccessor;
    /** Optional accessor indicating the inactive color of the side indicator. A grayscale filter is applied to the active color by default */
    inactiveColor?: SeriesAccessor;
}

/** Interface for side indicator accessors */
export interface ISideIndicatorAccessors {
    /** Accessors for the side indicator data */
    data: ISideIndicatorDataAccessors;
    /** Accessors for the side indicator series */
    series: ISideIndicatorSeriesAccessors;
}

/** Standard definition for side indicator series and data accessors */
export class SideIndicatorAccessors implements ISideIndicatorAccessors {
    public data: ISideIndicatorDataAccessors;
    public series: ISideIndicatorSeriesAccessors;

    constructor() {
        this.data = {
            active: (d: any) => d.active,
        };
        this.series = {
            start: () => null,
            end: () => null,
            activeColor: () => "magenta",
        };
    }
}

/**
 * Renderer for drawing threshold side indicators
 */
export class SideIndicatorRenderer extends XYRenderer<ISideIndicatorAccessors> {
    /** @deprecated As of Nova v9, use RenderLayerName.unclippedData enum value instead. Removal: NUI-5753 */
    public static SIDE_INDICATORS_LAYER = "side-indicators";

    private DEFAULT_CONFIG: IRendererConfig = {};

    /**
     * Creates an instance of SideIndicatorRenderer.
     * @param {IRendererConfig} [config={}] Renderer configuration object
     */
    constructor(config: IRendererConfig = {}) {
        super(config);
        // setting default values to the properties that were not set by user
        this.config = defaultsDeep(this.config, this.DEFAULT_CONFIG);
    }

    /** See {@link Renderer#draw} */
    public draw(
        renderSeries: IRenderSeries<ISideIndicatorAccessors>,
        rendererSubject: Subject<IRendererEventPayload>
    ): void {
        const target = renderSeries.containers[RenderLayerName.unclippedData];
        const dataSeries = renderSeries.dataSeries;
        const scales = renderSeries.scales;
        const accessors = renderSeries.dataSeries.accessors;

        let rect = target.select<SVGRectElement>("rect");
        const isActive =
            dataSeries.data.length > 0
                ? accessors.data.active(
                      dataSeries.data[0],
                      0,
                      renderSeries.dataSeries.data,
                      renderSeries.dataSeries
                  )
                : false;
        const colorAccessor =
            !isActive && accessors.series.inactiveColor
                ? accessors.series.inactiveColor
                : accessors.series.activeColor;
        if (rect.empty()) {
            rect = target.append("rect").attrs({
                fill: colorAccessor(dataSeries.id, dataSeries),
            });

            if (!isActive && !accessors.series.inactiveColor) {
                rect.style("filter", GRAYSCALE_FILTER);
            }
        }

        const start = accessors.series.start(dataSeries.id, dataSeries);
        const end = accessors.series.end(dataSeries.id, dataSeries);
        const top = end == null ? 0 : scales.y.convert(end);
        const bottom =
            start == null
                ? scales.y.range()[0]
                : Math.min(scales.y.range()[0], scales.y.convert(start));
        const height = bottom - top;
        const width = 2;
        rect.attrs({
            x: -width,
            y: top,
            height: height < 0 ? 0 : height,
            width: width,
        });
    }

    /** See {@link Renderer#getDataPointIndex} */
    public getDataPointIndex(
        series: IDataSeries<ISideIndicatorAccessors>,
        values: { [p: string]: any },
        scales: Scales
    ) {
        return -1;
    }

    /** See {@link Renderer#getRequiredLayers} */
    public getRequiredLayers(): ILasagnaLayer[] {
        return [STANDARD_RENDER_LAYERS[RenderLayerName.unclippedData]];
    }
}
