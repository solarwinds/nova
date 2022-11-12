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
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnChanges,
    OnDestroy,
    QueryList,
    SimpleChanges,
    ViewChildren,
} from "@angular/core";
import {
    forceCollide,
    forceSimulation,
    Simulation,
    SimulationNodeDatum,
} from "d3-force";
import { select } from "d3-selection";
import each from "lodash/each";
import isEqual from "lodash/isEqual";
import isNil from "lodash/isNil";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { IPosition } from "../core/common/types";
import { ChartTooltipsPlugin } from "../core/plugins/tooltips/chart-tooltips-plugin";
import { ChartTooltipDirective } from "./chart-tooltip.directive";

interface ITooltipNode extends SimulationNodeDatum {
    seriesId: string;
    radius: number;
}

@Component({
    selector: "nui-chart-tooltips",
    templateUrl: "./chart-tooltips.component.html",
    styleUrls: ["./chart-tooltips.component.less"],
})
export class ChartTooltipsComponent implements OnChanges, OnDestroy {
    @Input() plugin: ChartTooltipsPlugin;

    @Input() template: ElementRef;

    @ViewChildren(ChartTooltipDirective)
    tooltips: QueryList<ChartTooltipDirective>;

    public openTooltips = new Subject<void>();
    public closeTooltips = new Subject<void>();

    private unsubscribe$ = new Subject<void>();
    private simulation: Simulation<ITooltipNode, undefined>;
    // index we use for fast access of tooltip directives by seriesId
    private tooltipDirectivesIndex: {
        [seriesId: string]: ChartTooltipDirective;
    } = {};
    private closePending = false;
    private isOpen = false;
    private openTimeout: number;
    private collisionTimeout: number;
    private closeTimeout: number;

    constructor(private changeDetector: ChangeDetectorRef) {}

    public ngOnChanges(changes: SimpleChanges) {
        if (!(changes["plugin"] && changes["plugin"].currentValue)) {
            return;
        }

        this.unsubscribe$.next();

        this.plugin.showSubject
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(() => this.handleOpen());
        this.plugin.hideSubject
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(() => this.handleClose());
    }

    public ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    public trackByFn(index: number, item: any) {
        return item.value.seriesId;
    }

    private handleOpen() {
        this.changeDetector.detectChanges();

        const currentTooltipDirectivesIndex: {
            [seriesId: string]: ChartTooltipDirective;
        } = {};
        this.tooltips.forEach((tooltip) => {
            // this is how we identify which series does the tooltip belong to
            const seriesId: string | undefined =
                tooltip.elementRef.nativeElement.getAttribute("series-id") ??
                undefined;

            if (!seriesId) {
                throw new Error("SeriesId is not defined");
            }

            currentTooltipDirectivesIndex[seriesId] = tooltip;
        });

        const directivesChanged = !isEqual(
            currentTooltipDirectivesIndex,
            this.tooltipDirectivesIndex
        );
        if (this.closePending || directivesChanged || !this.isOpen) {
            clearTimeout(this.openTimeout);

            this.openTimeout = setTimeout(() => {
                this.openTooltips.next();
                clearTimeout(this.collisionTimeout);

                this.collisionTimeout = setTimeout(() => {
                    this.avoidTooltipCollisions();
                    this.isOpen = true;
                });
            });
        } else {
            this.openTooltips.next();
            this.avoidTooltipCollisions();
            this.isOpen = true;
        }
    }

    private handleClose() {
        if (this.simulation) {
            this.simulation.stop();
        }

        this.closePending = true;
        clearTimeout(this.closeTimeout);

        this.closeTimeout = setTimeout(() => {
            this.closeTooltips.next();
            this.closePending = false;
            this.isOpen = false;
        });
    }

    /**
     * Runs the D3 forceCollide based tooltip collision avoidance algorithm
     */
    private avoidTooltipCollisions() {
        // extracted tooltip positions from tooltip directives
        const tooltipPositions: { [seriesId: string]: IPosition } = {};

        this.tooltips.forEach((tooltip) => {
            const element = tooltip.getOverlayElement();

            // this is how we identify which series does the tooltip belong to
            const seriesId: string | undefined =
                tooltip.elementRef.nativeElement.getAttribute("series-id") ??
                undefined;

            if (!seriesId) {
                throw new Error("SeriesId is not defined");
            }

            this.tooltipDirectivesIndex[seriesId] = tooltip;

            tooltipPositions[seriesId] = {
                x: element.offsetLeft,
                y: element.offsetTop,
                width: element.clientWidth,
                height: element.clientHeight,
            };
        });

        // if there was a previous simulation, then stop it before running a new one
        if (this.simulation) {
            this.simulation.stop();
        }

        this.simulation = this.startSimulation(
            this.tooltipDirectivesIndex,
            tooltipPositions
        );
    }

    /**
     * Starts the force simulation to avoid tooltip overlap
     *
     * @param tooltipIndex
     * @param tooltipPositions
     */
    private startSimulation(
        tooltipIndex: { [p: string]: ChartTooltipDirective },
        tooltipPositions: { [seriesId: string]: IPosition }
    ) {
        const nodes = Object.keys(tooltipPositions).map((seriesId) => {
            const position = tooltipPositions[seriesId];

            if (isNil(position.height) || isNil(position.width)) {
                throw new Error("Position height or width are not defined");
            }

            const props: any = {
                seriesId: seriesId,
                x: position.x,
                y: position.y,
                radius: this.isVertical()
                    ? position.height / 2
                    : position.width / 2,
            };
            if (this.isVertical()) {
                props.fx = position.x;
            } else {
                props.fy = position.y;
            }
            return props;
        });

        // TODO: these numbers are only based on playing with the library for the while, it's not fine tuned at all
        const collisionForce = forceCollide((node: any) => node.radius)
            .strength(0.5)
            .iterations(20);

        const simulation = forceSimulation(nodes)
            .alphaDecay(0.3)
            .force("collisionForce", collisionForce);

        simulation.on("tick", () => {
            each(nodes, (node: ITooltipNode) => {
                const tooltip = tooltipIndex[node.seriesId];

                select(tooltip.getOverlayElement()).style(
                    this.isVertical() ? "top" : "left",
                    (this.isVertical() ? node.y : node.x) + "px"
                );
            });
        });

        return simulation;
    }

    private isVertical() {
        return this.plugin.orientation === "right";
    }
}
