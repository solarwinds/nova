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

import { ElementRef } from "@angular/core";
import { fakeAsync, flush } from "@angular/core/testing";
import { Subject } from "rxjs";

import { DelayedMousePresenceDetectionDirective } from "./delayed-mouse-presence-detection.directive";

describe("TableHideScrollBarDirective", () => {
    let directive: DelayedMousePresenceDetectionDirective;
    let nativeElement: HTMLElement;

    beforeEach(() => {
        nativeElement = document.createElement("div");
        directive = new DelayedMousePresenceDetectionDirective({
            nativeElement,
        } as ElementRef<HTMLElement>);
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

    it("should return back true on the subject on focusin", () => {
        const nextSpy = spyOn(directive.mousePresentSubject, "next");
        directive.onHostFocusin();
        expect(nextSpy).toHaveBeenCalledWith(true);
    });

    it("should return back false on the subject on focusout when relatedTarget is outside the host element", () => {
        const nextSpy = spyOn(directive.mousePresentSubject, "next");
        directive.onHostFocusout(
            new FocusEvent("focusout", {
                relatedTarget: document.createElement("span"),
            })
        );
        expect(nextSpy).toHaveBeenCalledWith(false);
    });

    it("should return back false on the subject on focusout when relatedTarget is null", () => {
        const nextSpy = spyOn(directive.mousePresentSubject, "next");
        directive.onHostFocusout(
            new FocusEvent("focusout", { relatedTarget: null })
        );
        expect(nextSpy).toHaveBeenCalledWith(false);
    });

    it("should NOT return false on the subject on focusout when relatedTarget is still inside the host element", () => {
        const nextSpy = spyOn(directive.mousePresentSubject, "next");
        const childElement = document.createElement("span");
        nativeElement.appendChild(childElement);
        directive.onHostFocusout(
            new FocusEvent("focusout", { relatedTarget: childElement })
        );
        expect(nextSpy).not.toHaveBeenCalled();
    });

    it("should not update the subject when disabled on focusin or focusout", () => {
        const nextSpy = spyOn(directive.mousePresentSubject, "next");
        directive.enabled = false;
        directive.onHostFocusin();
        directive.onHostFocusout(
            new FocusEvent("focusout", {
                relatedTarget: document.createElement("span"),
            })
        );
        expect(nextSpy).not.toHaveBeenCalled();
    });
});
