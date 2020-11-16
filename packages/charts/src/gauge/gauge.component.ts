import { AfterViewChecked, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { Arc, DefaultArcObject } from "d3";
import { select } from "d3-selection";
import { arc, pie } from "d3-shape";
import isUndefined from "lodash/isUndefined";

/** @ignore TODO: remove */
export interface IGaugeThresholds {
    error?: number;
    warning?: number;
    [key: string]: any;
}

/** @ignore TODO: remove */
@Component({
    selector: "nui-gauge",
    templateUrl: "./gauge.component.html",
    styleUrls: ["./gauge.component.less"],
})
export class GaugeComponent implements AfterViewChecked, OnInit, OnChanges {

    @Input() public mode: "horizontal" | "vertical" | "radial" = "horizontal";
    @Input() public value: number;
    @Input() public max: number = 100;
    @Input() public thresholds: IGaugeThresholds = {};
    @Input() public thickness: number = 5;

    @ViewChild("control") public control: ElementRef<SVGElement>;

    public width: number;
    public height: number;

    private hostElement: HTMLElement;

    private markerSize = 10;

    constructor(element: ElementRef) {
        this.hostElement = element.nativeElement;
    }

    ngOnInit(): void {
        this.width = this.hostElement.offsetWidth;
        if (this.mode === "horizontal") {
            this.height = this.thickness;
        }
        if (this.mode === "radial") {
            this.height = this.width = Math.min(this.hostElement.offsetWidth, this.hostElement.offsetHeight);
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["thickness"]) {
            if (this.mode === "horizontal") {
                this.height = Math.max(changes["thickness"].currentValue, this.markerSize);
            }
            // just a sanity check: no sense to have a thickness that is bigger than radius
            if (this.mode === "radial" && this.height) {
                this.thickness = Math.min(changes["thickness"].currentValue, this.height / 2);
            }
        }
    }

    ngAfterViewChecked(): void {
        const elementSelection = select(this.control.nativeElement);

        // Changing Fill color for exceeded threshold state
        if (!isUndefined(this.thresholds.warning)) {
            elementSelection.attr("class", (this.thresholds.warning <= this.value) ? "warning" : "");
        }
        if (!isUndefined(this.thresholds.error)) {
            if (this.thresholds.error <= this.value) {
                elementSelection.attr("class", "error");
            }
        }

        let warningPoint: {x: string, y: string};
        let errorPoint: {x: string, y: string};

        if (this.mode === "horizontal" && !isUndefined(this.thresholds.warning) && !isUndefined(this.thresholds.error)) {
            elementSelection.select(".filled")
                .attr("width", `${this.value / this.max * 100}%`);
            elementSelection.selectAll(".measurements-horizontal rect")
                .attr("y", (this.thickness < this.markerSize) ? `${this.height / 2 - this.thickness / 2}` : "0");
            warningPoint = {
                x: `${this.thresholds.warning / this.max * 100}%`,
                y: `${this.height / 2}`,
            };
            errorPoint = {
                x: `${this.thresholds.error / this.max * 100}%`,
                y: `${this.height / 2}`,
            };

            // Drawing lines near threshold points

            const selection = select(this.control.nativeElement)
                .select(".markers .lines")
                .selectAll("line")
                .data([warningPoint.x, errorPoint.x]);
            selection.enter()
                .append("line")
                .attr("y1", "0")
                .merge(selection as any)
                .attr("x1", (d: string) => d)
                .attr("x2", (d: string) => d)
                .attr("y2", this.height);

            // Avoiding use before assigned error for warningPoint and errorPoint
            // Drawing threshold points
            this.drawCircle(elementSelection.select(".warning-marker"), "warning", warningPoint);

            this.drawCircle(elementSelection.select(".error-marker"), "error", errorPoint);
        }

        if (this.mode === "radial") {
            const arcGenerator: Arc<any, DefaultArcObject> = arc()
                .innerRadius(this.height / 2 - this.thickness)
                .outerRadius(this.height / 2);
            const pieGenerator = pie().sort(null);

            const arcs = pieGenerator([this.value, this.max - this.value]) as any;
            arcs[0].class = "filled";
            arcs[1].class = "everything";

            select<SVGElement, SVGElement>(this.control.nativeElement)
                .selectAll("path")
                .data(arcs)
                .attr("class", (d: any) => d.class)
                // Workaround to avoid strict build crash
                .attr("d", <string>(<unknown>arcGenerator));

            select(this.control.nativeElement).attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");

            // Drawing threshold points
            if (this.thresholds.error && this.thresholds.warning) { // TODO: handle only warning (also what if one of the values is 0 which is falsy?)
                const arcsForCircles = pieGenerator(
                    [this.thresholds.warning, 0, this.thresholds.error - this.thresholds.warning, 0, this.max - this.thresholds.error]);
                //                                 |                                                   |
                //                                 1 <-- index of warning                              3 <-- index of error
                //                                 |                                                   |
                //   Those values are to get       |
                //   coordinates of threshold points
                const warnRad = arcGenerator.centroid(arcsForCircles[1] as any);
                const errRad = arcGenerator.centroid(arcsForCircles[3] as any);
                warningPoint = {
                    x: `${warnRad[0]}`,
                    y: `${warnRad[1]}`,
                };
                errorPoint = {
                    x: `${errRad[0]}`,
                    y: `${errRad[1]}`,
                };

                // Drawing lines near threshold points

                const selection = select(this.control.nativeElement)
                    .select(".markers .lines")
                    .selectAll("path")
                    .data([arcsForCircles[1] as any, arcsForCircles[3] as any]);
                selection.enter()
                    .append("path")
                    .merge(selection as any)
                    .attr("d", (d: any) => arcGenerator(d));

                // Avoiding use before assigned error for warningPoint and errorPoint
                // Drawing threshold points
                this.drawCircle(elementSelection.select(".warning-marker"), "warning", warningPoint);

                this.drawCircle(elementSelection.select(".error-marker"), "error", errorPoint);
            }
        }

    }

    drawCircle(elementSelection: any, status: string, point: {x: string, y: string}) {
        elementSelection.select(`circle`)
            .attr("cx", point.x)
            .attr("cy", point.y)
            .attr("r", 5)
            .on("mouseenter", () => this.showTooltip({
                x: point.x,
                y: point.y,
                value: `${status} level is ${this.thresholds[status]}`,
            }))
            .on("mouseleave", () => this.hideTooltip());
    }

    showTooltip(args: any) {
        const {value} = args;
        console.log(`Tooltip for ${value}`);
    }
    hideTooltip() {
        console.log("Tooltips are hidden.");
    }
}
