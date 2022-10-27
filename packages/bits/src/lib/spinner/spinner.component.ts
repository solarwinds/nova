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

import { animate, style, transition, trigger } from "@angular/animations";
import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    HostBinding,
    Input,
    NgZone,
    OnChanges,
    OnDestroy,
    Output,
    SimpleChange,
    SimpleChanges,
    ViewEncapsulation,
} from "@angular/core";

import { LoggerService } from "../../services/log-service";
import { ButtonIcon, SpinnerSize } from "./public-api";

/**
 * <example-url>./../examples/index.html#/spinner</example-url>
 */
@Component({
    selector: "nui-spinner",
    templateUrl: "./spinner.component.html",
    styleUrls: ["./spinner.component.less"],
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger("spinnerAppear", [
            transition(":enter", [
                animate(".2s ease-in-out", style({ opacity: 1 })),
            ]),
            transition(":leave", [
                animate(".2s ease-in-out", style({ opacity: 0 })),
            ]),
        ]),
    ],
    host: {
        role: "progressbar",
        "aria-valuemin": "0",
        "aria-valuemax": "100",
        "[attr.aria-label]": "ariaLabel",
    },
})
export class SpinnerComponent implements OnChanges, OnDestroy {
    private static defaultSize: SpinnerSize = SpinnerSize.Small;
    private showTimer: any;
    private _size: SpinnerSize;
    public tooltipText = $localize`Cancel`;

    public showSpinner = false;
    public isDeterminate = false;

    @HostBinding("attr.aria-valuenow") ariaValueNow: string | undefined;

    @Input() public percent?: number;
    @Input() public show = false;
    @Input() public delay = 250;
    @Input() public allowCancel?: boolean;
    @Input() public message?: string;
    @Input() public helpText?: string;

    /**
     * Input to set aria label text
     */
    @Input() public ariaLabel: string = "Spinner";

    @Output() public cancel = new EventEmitter();

    @Input() public set size(val: SpinnerSize) {
        const sizes = Object.values(SpinnerSize);

        if (sizes.includes(val)) {
            this._size = val;
            return;
        }

        this.logger.warn(
            `Allowed sizes for nui-spinner are ${sizes.join(", ")}. ` +
                `Default is ${SpinnerComponent.defaultSize}.`
        );

        this._size = SpinnerComponent.defaultSize;
    }

    public get size() {
        return this._size || SpinnerComponent.defaultSize;
    }

    public get icon() {
        return ButtonIcon[this.size];
    }

    public get showText() {
        return this.size !== SpinnerSize.Small;
    }

    constructor(
        private logger: LoggerService,
        private changeDetector: ChangeDetectorRef,
        private ngZone: NgZone
    ) {}

    public ngOnChanges(changes: SimpleChanges) {
        if (changes?.percent) {
            this.ariaValueNow = this.percent ? String(this.percent) : undefined;
        }

        if (!changes["show"]) {
            return;
        }

        this.isDeterminate = this.percent !== undefined;

        this.cancelShowTimer();

        if (this.delay && this.show) {
            this.ngZone.runOutsideAngular(() => {
                this.showTimer = setTimeout(() => {
                    this.ngZone.run(() => {
                        this.showSpinner = this.show;
                        this.changeDetector.detectChanges();
                    });
                }, this.delay);
            });
        } else {
            this.showSpinner = this.show;
        }
    }

    public cancelShowTimer() {
        if (this.showTimer) {
            clearTimeout(this.showTimer);
        }
    }

    public cancelProgress() {
        this.cancel.emit();
    }

    public ngOnDestroy() {
        this.cancelShowTimer();
    }
}
