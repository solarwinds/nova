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
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    SimpleChanges,
    ViewEncapsulation,
} from "@angular/core";

import { LegendOrientation } from "./types";

@Component({
    selector: "nui-legend",
    // eslint-disable-next-line
    host: { class: "d-inline-block" },
    templateUrl: "./legend.component.html",
    encapsulation: ViewEncapsulation.Emulated,
})
export class LegendComponent implements OnChanges, OnDestroy {
    /**
     * EventEmitter for notifying subscribers of a change in the active state
     */
    public activeChanged = new EventEmitter<boolean>();

    /**
     * The active state
     */
    @Input() public active = false;

    /**
     * The legend's interactive mode switch
     */
    @Input() public interactive = false;

    /**
     * The legend's orientation
     */
    @Input() public orientation: LegendOrientation = LegendOrientation.vertical;

    /**
     * The legend's overall series color. Individual legend series may override this.
     */
    @Input() public seriesColor: string;

    /**
     * The legend's overall series icon. Individual legend series may override this.
     */
    @Input() public seriesIcon: string;

    /**
     * The legend's overall series unit label. Individual legend series may override this.
     */
    @Input() public seriesUnitLabel: string;

    public ngOnChanges(changes: SimpleChanges) {
        if (changes["active"]) {
            this.activeChanged.emit(this.active);
        }
    }

    public ngOnDestroy(): void {
        this.activeChanged.complete();
    }
}
