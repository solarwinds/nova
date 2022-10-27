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

import { fakeAsync, flush } from "@angular/core/testing";
import { Subject } from "rxjs";

import { DelayedMousePresenceDetectionDirective } from "./delayed-mouse-presence-detection.directive";

describe("TableHideScrollBarDirective", () => {
    let directive: DelayedMousePresenceDetectionDirective;

    beforeEach(() => {
        directive = new DelayedMousePresenceDetectionDirective();
        directive.enabled = true;
        directive.mousePresentSubject = new Subject<boolean>();
    });

    it("should create an instance", () => {
        expect(directive).toBeTruthy();
    });

    it("should return back true on the subject if clicked", () => {
        const nextSpy = spyOn(directive.mousePresentSubject, "next");
        directive.onHostClick();
        expect(nextSpy).toHaveBeenCalledWith(true);
    });

    it("should return back true on the subject onHostMouseenter then false onHostMouseleave", fakeAsync(() => {
        const nextSpy = spyOn(directive.mousePresentSubject, "next");
        directive.onHostMouseenter();
        flush();
        expect(nextSpy).toHaveBeenCalledWith(true);
        directive.onHostMouseleave();
        expect(nextSpy).toHaveBeenCalledWith(false);
    }));
});
