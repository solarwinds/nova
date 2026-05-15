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

import { select } from "d3-selection";
import { Subject } from "rxjs";

import {
    DATA_POINT_NOT_FOUND,
    HIGHLIGHT_SERIES_EVENT,
} from "../../../constants";
import { BandScale } from "../../../core/common/scales/band-scale";
import { LinearScale } from "../../../core/common/scales/linear-scale";
import {
    D3Selection,
    IDataSeries,
    IRenderContainers,
    IRendererEventPayload,
} from "../../../core/common/types";
import { flushAllD3Transitions } from "../../../spec-helpers/flush-transitions";
import { IRenderSeries, RenderLayerName } from "../../types";
import { HorizontalBarAccessors } from "../accessors/horizontal-bar-accessors";
import { BarRenderer } from "../bar-renderer";
import { BarSeriesHighlightStrategy } from "./bar-series-highlight-strategy";

describe("BarSeriesHighlightStrategy >", () => {
    let svg: D3Selection<SVGSVGElement> | any;
    let renderSeries: IRenderSeries<HorizontalBarAccessors>;
    let bandScale: BandScale;
    let linearScale: LinearScale;
    let dataSeries: IDataSeries<HorizontalBarAccessors>;
    let renderer: BarRenderer;
    let rendererSubject: Subject<IRendererEventPayload>;
    const containers: IRenderContainers = {};

    beforeEach(() => {
        svg = select(document.createElement("div")).append("svg");
        containers[RenderLayerName.data] = svg.append("g");
        bandScale = new BandScale();
        linearScale = new LinearScale();
        bandScale.domain(["Other"]);
        bandScale.range([0, 100]);
        linearScale.domain([0, 10]);
        linearScale.range([0, 100]);

        dataSeries = {
            id: "other",
            name: "Other",
            data: [5],
            accessors: new HorizontalBarAccessors(),
        };
        renderSeries = {
            dataSeries,
            containers,
            scales: { x: linearScale, y: bandScale },
        };
        renderer = new BarRenderer({
            highlightStrategy: new BarSeriesHighlightStrategy("y"),
        });
        rendererSubject = new Subject<IRendererEventPayload>();
    });

    it("should emit a highlight-series event when a bar is hovered", () => {
        const nextSpy = spyOn(rendererSubject, "next");

        renderer.draw(renderSeries as any, rendererSubject);
        flushAllD3Transitions();

        svg.select("rect.bar").dispatch("mouseenter");

        expect(nextSpy).toHaveBeenCalledWith({
            eventName: HIGHLIGHT_SERIES_EVENT,
            data: jasmine.objectContaining({
                seriesId: "other",
                index: 0,
                data: 5,
            }),
        });
    });

    it("should emit a reset highlight-series event when the pointer leaves a bar", () => {
        const nextSpy = spyOn(rendererSubject, "next");

        renderer.draw(renderSeries as any, rendererSubject);
        flushAllD3Transitions();

        svg.select("rect.bar").dispatch("mouseleave");

        expect(nextSpy).toHaveBeenCalledWith({
            eventName: HIGHLIGHT_SERIES_EVENT,
            data: jasmine.objectContaining({
                seriesId: "other",
                index: DATA_POINT_NOT_FOUND,
            }),
        });
    });
});
