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
    selector: "nui-stacked-header-example",
    templateUrl: "./stacked-header.example.component.html",
})
export class StackedHeaderProgressExampleComponent implements OnDestroy {
    public show = false;
    public percent = 0;
    public isCanceled = false;
    private stop: any = undefined;

    public startProgress(): void {
        this.clearInterval();

        this.show = true;
        this.stop = setInterval(() => {
            if (this.percent < 100) {
                this.percent += 10;
            } else {
                this.onCancel();
            }
        }, 1000);
    }

    public onCancel(): void {
        this.clearInterval();
        this.isCanceled = true;
        this.show = false;
        this.stop = undefined;
        this.percent = 0;
    }

    public ngOnDestroy(): void {
        this.clearInterval();
    }

    private clearInterval() {
        if (this.stop) {
            clearInterval(this.stop);
        }
    }
}
