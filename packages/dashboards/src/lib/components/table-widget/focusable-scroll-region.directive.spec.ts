// © 2026 SolarWinds Worldwide, LLC. All rights reserved.
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

import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FocusableScrollRegionDirective } from "./focusable-scroll-region.directive";

@Component({
    template: `
        <div
            class="scroll-host"
            style="display: block; width: 100px; height: 50px; overflow: hidden;"
            [nuiFocusableScrollRegion]="labelledBy">
            <div
                class="scroll-content"
                [style.width.px]="contentWidth"
                [style.height.px]="contentHeight"></div>
        </div>
    `,
    imports: [FocusableScrollRegionDirective],
})
class FocusableScrollRegionTestHostComponent {
    public labelledBy = "widget-title table";
    public contentWidth = 100;
    public contentHeight = 50;
}

describe("FocusableScrollRegionDirective", () => {
    let fixture: ComponentFixture<FocusableScrollRegionTestHostComponent>;
    let testHost: FocusableScrollRegionTestHostComponent;
    let hostElement: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FocusableScrollRegionTestHostComponent],
        });

        fixture = TestBed.createComponent(
            FocusableScrollRegionTestHostComponent
        );
        testHost = fixture.componentInstance;
        fixture.detectChanges();
        hostElement = fixture.nativeElement.querySelector(".scroll-host");
    });

    const nextFrames = async (): Promise<void> => {
        await new Promise<void>(resolve =>
            requestAnimationFrame(() => resolve())
        );
        await new Promise<void>(resolve =>
            requestAnimationFrame(() => resolve())
        );
    };

    function expectOverflowAttributes(labelledBy: string | null): void {
        expect(hostElement.getAttribute("tabindex")).toBe("0");
        expect(hostElement.getAttribute("role")).toBe("region");
        expect(hostElement.getAttribute("aria-labelledby")).toBe(labelledBy);
    }

    it("sets region attributes when content overflows horizontally", async () => {
        testHost.contentWidth = 200;
        fixture.detectChanges();
        await nextFrames();

        expectOverflowAttributes("widget-title table");
    });

    it("sets region attributes when content overflows vertically only", async () => {
        testHost.contentHeight = 100;
        fixture.detectChanges();
        await nextFrames();

        expectOverflowAttributes("widget-title table");
    });

    it("does not set region attributes when content fits", () => {
        expect(hostElement.getAttribute("tabindex")).toBeNull();
        expect(hostElement.getAttribute("role")).toBeNull();
        expect(hostElement.getAttribute("aria-labelledby")).toBeNull();
    });

    it("removes region attributes after overflowing content shrinks", async () => {
        testHost.contentWidth = 200;
        fixture.detectChanges();
        await nextFrames();
        expectOverflowAttributes("widget-title table");

        testHost.contentWidth = 50;
        testHost.contentHeight = 25;
        fixture.detectChanges();
        await nextFrames();

        expect(hostElement.getAttribute("tabindex")).toBeNull();
        expect(hostElement.getAttribute("role")).toBeNull();
        expect(hostElement.getAttribute("aria-labelledby")).toBeNull();
    });

    it("updates aria-labelledby when the input changes", async () => {
        testHost.contentWidth = 200;
        fixture.detectChanges();
        await nextFrames();

        testHost.labelledBy = "updated-title updated-table";
        fixture.detectChanges();

        expect(hostElement.getAttribute("aria-labelledby")).toBe(
            "updated-title updated-table"
        );
    });

    it("omits aria-labelledby when labelledBy is empty", async () => {
        testHost.labelledBy = "";
        testHost.contentWidth = 200;
        fixture.detectChanges();
        await nextFrames();

        expectOverflowAttributes(null);
    });

    it("disconnects the ResizeObserver on destroy", () => {
        const disconnectSpy = spyOn(ResizeObserver.prototype, "disconnect");

        fixture.destroy();

        expect(disconnectSpy).toHaveBeenCalled();
    });
});
