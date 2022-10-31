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

import { Component, OnDestroy } from "@angular/core";

@Component({
    selector: "nui-spinner-determinate-example",
    templateUrl: "./spinner-determinate.example.component.html",
})
export class SpinnerDeterminateExampleComponent implements OnDestroy {
    public show = false;
    public spinPercentage = 0;

    private interval: any = undefined;

    public toggleSpinners() {
        this.show = !this.show;
        this.show ? this.startProgress() : this.onCancel();
    }

    public startProgress() {
        this.clearInterval();
        this.interval = setInterval(() => {
            this.spinPercentage < 100
                ? (this.spinPercentage += 10)
                : this.onCancel();
        }, 500);
    }

    public onCancel() {
        this.clearInterval();
        this.show = false;
        this.spinPercentage = 0;
    }

    public ngOnDestroy() {
        this.clearInterval();
    }

    private clearInterval() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = undefined;
        }
    }
}
