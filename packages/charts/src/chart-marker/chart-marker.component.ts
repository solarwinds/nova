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

import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnChanges,
    OnDestroy,
    SimpleChanges,
    ViewChild,
} from "@angular/core";
import isFunction from "lodash/isFunction";
import { BehaviorSubject } from "rxjs";

import { IChartMarker } from "../core/common/types";

/** @ignore */
const SVG_PADDING = 3;

@Component({
    selector: "nui-chart-marker",
    templateUrl: "./chart-marker.component.html",
    styleUrls: ["./chart-marker.component.less"],
    standalone: false
})
export class ChartMarkerComponent
    implements OnDestroy, AfterViewInit, OnChanges
{
    @Input() marker: IChartMarker;
    @Input() drawLine: boolean;
    @Input() color: string;
    @Input() maxSize = 20;

    @ViewChild("svgContent") public svgContent: ElementRef<SVGElement>;

    public viewBox: string;
    public height: string = "10px"; // size needs to be defined by default to prevent initial svg element from being huge
    public width: string = "10px"; // same here

    private svg = new BehaviorSubject<string>("");

    constructor(private changeDetector: ChangeDetectorRef) {}

    public ngAfterViewInit(): void {
        this.svg.subscribe((svg: string) => {
            this.renderMarkerSvg(svg);
        });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes["marker"] || changes["color"]) {
            if (changes["color"]) {
                this.marker.setColor(this.color);
            }
            if (
                this.marker &&
                this.marker.getSvg &&
                isFunction(this.marker.getSvg)
            ) {
                this.svg.next(this.marker.getSvg());
            }
        }
    }

    public ngOnDestroy(): void {
        this.svg.complete();
    }

    private renderMarkerSvg(svg: string) {
        const svgContainerElement: any = this.svgContent.nativeElement;
        const line = `<line x1="-10" y1="0" x2="10" y2="0" style="stroke:${this.color};stroke-width:2" />`;
        svgContainerElement.innerHTML = "";

        if (this.drawLine) {
            svgContainerElement.insertAdjacentHTML("beforeend", line);
        }
        svgContainerElement.insertAdjacentHTML("beforeend", svg);

        setTimeout(() => {
            const clientRect = svgContainerElement.getBBox();
            this.viewBox =
                `${clientRect.x - SVG_PADDING} ${clientRect.y - SVG_PADDING} ` +
                `${clientRect.width + 2 * SVG_PADDING} ${
                    clientRect.height + 2 * SVG_PADDING
                }`;
            this.width =
                Math.min(clientRect.width + 2 * SVG_PADDING, this.maxSize) +
                "px";
            this.height =
                Math.min(clientRect.height + 2 * SVG_PADDING, this.maxSize) +
                "px";

            this.changeDetector.markForCheck();
        });
    }
}
