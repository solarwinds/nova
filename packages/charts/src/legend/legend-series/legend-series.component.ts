import {
    AfterContentInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Host, HostBinding, HostListener, Input, Optional, Output, ViewChild,
    ViewEncapsulation
} from "@angular/core";
import _isEmpty from "lodash/isEmpty";

import { RenderState } from "../../renderers/types";
import { LegendComponent } from "../legend.component";
import { LegendOrientation } from "../types";

/** @ignore */
export const LEGEND_SERIES_CLASS_NAME = "nui-legend-series";

@Component({
    // tslint:disable-next-line
    host: { "class": LEGEND_SERIES_CLASS_NAME },
    selector: "nui-legend-series",
    templateUrl: "./legend-series.component.html",
    styleUrls: ["./legend-series.component.less"],
    encapsulation: ViewEncapsulation.Emulated,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegendSeriesComponent implements AfterContentInit {

    /**
     * Sets the series active status
     *
     * @param {boolean} active The new active status
     */
    @Input()
    public set active(active: boolean) {
        this._active = active;
    }

    /**
     * Sets the series interactive mode switch
     *
     * @param {boolean} interactive The new interactive mode
     */
    @Input()
    public set interactive(interactive: boolean) {
        this._interactive = interactive;
    }

    /**
     * Gets the series interactive mode value
     *
     * @returns {boolean} The current interactive mode
     */
    public get interactive(): boolean {
        return this._interactive;
    }

    /**
     * Set whether the series is selected
     */
    @Input() public isSelected = true;

    /**
     * Emits an event with a boolean value indicating a new selected status
     */
    @Output() public isSelectedChange = new EventEmitter();

    /**
     * The primary description of the series
     */
    @Input() public descriptionPrimary: string;

    /**
     * The secondary description of the series
     */
    @Input() public descriptionSecondary: string;

    /**
     * The series icon
     */
    @Input() public icon: string;

    /**
     * Color of the series
     */
    @Input() public color: string;

    /**
     * The render state of the legend series
     */
    @Input()
    public set seriesRenderState(renderState: RenderState) {
        this._seriesRenderState = renderState;
    }
    public get seriesRenderState(): RenderState {
        return this._seriesRenderState || RenderState.default;
    }

    @ViewChild("projectedDescription") private projectedDescription: ElementRef;

    @HostBinding(`class.${LEGEND_SERIES_CLASS_NAME}--interactive`)
    public get isInteractiveClassApplied() {
        return this._interactive;
    }

    @HostBinding(`class.${LEGEND_SERIES_CLASS_NAME}--horizontal`) public isHorizontalClassApplied = false;

    @HostBinding(`class.inverse`)
    public get isActiveClassApplied() {
        return this._active && this.seriesRenderState !== RenderState.hidden;
    }

    private _seriesRenderState: RenderState;
    private _active = false;
    private _interactive = false;

    constructor(@Optional() @Host() private legend: LegendComponent) { }

    public ngAfterContentInit(): void {
        if (this.legend) {
            this.legend.activeChanged.subscribe((active: boolean) => this._active = active);

            this.icon = this.icon || this.legend.seriesIcon;
            this._active = this.legend.active;
            this.interactive = this.legend.interactive;
            this.isHorizontalClassApplied = this.legend.orientation === LegendOrientation.horizontal;
        }
    }

    /**
     * Emits an isSelectedChange event on series click if the series is in interactive mode
     */
    @HostListener("click")
    public onClick(): void {
        if (this.interactive) {
            this.isSelectedChange.next(!this.isSelected);
        }
    }

    /**
     * @returns boolean indicating whether the series has a primary or secondary description
     */
    public hasInputDescription(): boolean {
        return !_isEmpty(this.descriptionPrimary) || !_isEmpty(this.descriptionSecondary);
    }

    /**
     * @returns boolean indicating whether the series has a projected description
     */
    public hasProjectedDescription(): boolean {
        return !!this.projectedDescription && this.projectedDescription.nativeElement.children.length !== 0;
    }
}
