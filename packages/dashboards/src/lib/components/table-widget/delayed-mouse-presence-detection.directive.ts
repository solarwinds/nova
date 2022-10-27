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

import { Directive, HostListener, Input } from "@angular/core";
import { Subject } from "rxjs";

@Directive({
    selector: "[nuiDelayedMousePresenceDetection]",
})
export class DelayedMousePresenceDetectionDirective {
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input("nuiDelayedMousePresenceDetection") public enabled: boolean = true;
    @Input() mousePresentSubject: Subject<boolean>;
    @Input() delay: number = 500;

    private timeout: NodeJS.Timeout;

    @HostListener("mouseenter") onHostMouseenter() {
        if (!this.enabled) {
            return;
        }
        this.timeout = setTimeout(() => {
            this.mousePresentSubject.next(true);
        }, this.delay);
    }

    @HostListener("click") onHostClick() {
        if (!this.enabled) {
            return;
        }
        this.mousePresentSubject.next(true);
    }

    @HostListener("mouseleave") onHostMouseleave() {
        if (!this.enabled) {
            return;
        }
        clearTimeout(this.timeout);

        this.mousePresentSubject.next(false);
    }
}
