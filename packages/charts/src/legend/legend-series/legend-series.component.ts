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
    AfterContentInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    Host,
    HostBinding,
    HostListener,
    Input,
    Optional,
    Output,
    ViewChild,
} from "@angular/core";
import _isEmpty from "lodash/isEmpty";

import { RenderState } from "../../renderers/types";
import { LegendComponent } from "../legend.component";
import { LegendOrientation } from "../types";

/** @ignore */
export const LEGEND_SERIES_CLASS_NAME = "nui-legend-series";

@Component({
    // eslint-disable-next-line
    host: { class: LEGEND_SERIES_CLASS_NAME },
    selector: "nui-legend-series",
    templateUrl: "./legend-series.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
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
    public get isInteractiveClassApplied(): boolean {
        return this._interactive;
    }

    @HostBinding(`class.${LEGEND_SERIES_CLASS_NAME}--horizontal`)
    public isHorizontalClassApplied = false;

    @HostBinding(`class.inverse`)
    public get isActiveClassApplied(): boolean {
        return this._active && this.seriesRenderState !== RenderState.hidden;
    }

    private _seriesRenderState: RenderState;
    private _active = false;
    private _interactive: boolean;

    constructor(@Optional() @Host() private legend: LegendComponent) {}

    public ngAfterContentInit(): void {
        if (this.legend) {
            this.legend.activeChanged.subscribe(
                (active: boolean) => (this._active = active)
            );

            this.icon = this.icon || this.legend.seriesIcon;
            this._active = this.legend.active;
            this.interactive = this.interactive ?? this.legend.interactive;
            this.isHorizontalClassApplied =
                this.legend.orientation === LegendOrientation.horizontal;
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
        return (
            !_isEmpty(this.descriptionPrimary) ||
            !_isEmpty(this.descriptionSecondary)
        );
    }

    /**
     * @returns boolean indicating whether the series has a projected description
     */
    public hasProjectedDescription(): boolean {
        return (
            !!this.projectedDescription &&
            this.projectedDescription.nativeElement.children.length !== 0
        );
    }
}
