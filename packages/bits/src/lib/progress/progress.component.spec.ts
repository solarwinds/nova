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

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ProgressComponent } from "./progress.component";
import { NuiProgressModule } from "./progress.module";

describe("components >", () => {
    describe("progress >", () => {
        const progressbarSelector = "[role=progressbar]";
        let fixture: ComponentFixture<ProgressComponent>;
        let component: ProgressComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NuiProgressModule],
            });
            fixture = TestBed.createComponent(ProgressComponent);
            component = fixture.componentInstance;
            component.show = true;
            component.showProgress = true;
            component.percent = 40;
            component.ariaLabel = "Upload progress";
            component.ngOnChanges();
            fixture.detectChanges();
        });

        it("exposes exactly one progressbar and it is the bar element", () => {
            const progressbars =
                fixture.nativeElement.querySelectorAll(progressbarSelector);
            expect(progressbars.length).toBe(1);

            const progressbar = progressbars[0] as HTMLElement;
            expect(progressbar.classList.contains("nui-progress__bar")).toBe(
                true
            );
            expect(progressbar.getAttribute("aria-valuemin")).toBe("0");
            expect(progressbar.getAttribute("aria-valuemax")).toBe("100");
            expect(progressbar.getAttribute("aria-valuenow")).toBe("40");
            expect(progressbar.getAttribute("aria-label")).toBe(
                "Upload progress"
            );

            const container = fixture.nativeElement.querySelector(
                ".nui-progress__container"
            );
            expect(container.hasAttribute("role")).toBe(false);
            expect(fixture.nativeElement.hasAttribute("role")).toBe(false);
        });

        it("does not render a progressbar when showProgress is false", () => {
            fixture.componentRef.setInput("showProgress", false);
            fixture.detectChanges();

            expect(
                fixture.nativeElement.querySelector(progressbarSelector)
            ).toBeNull();
        });

        it("describes the progressbar by the rendered message", () => {
            fixture.componentRef.setInput("message", "Uploading");
            fixture.componentRef.setInput("compactMode", false);
            fixture.detectChanges();

            const progressbar = fixture.nativeElement.querySelector(
                progressbarSelector
            ) as HTMLElement;
            const describedBy = progressbar.getAttribute("aria-describedby");

            expect(describedBy).toBe(component.messageId);
            expect(
                fixture.nativeElement.querySelector(`#${describedBy}`)
            ).not.toBeNull();
        });

        it("describes the progressbar by the help text with a unique id", () => {
            fixture.componentRef.setInput("helpText", "Help text");
            fixture.componentRef.setInput("compactMode", false);
            fixture.detectChanges();

            const progressbar = fixture.nativeElement.querySelector(
                progressbarSelector
            ) as HTMLElement;

            expect(progressbar.getAttribute("aria-describedby")).toBe(
                component.helpId
            );
            expect(
                fixture.nativeElement.querySelectorAll(`#${component.helpId}`)
                    .length
            ).toBe(1);
        });

        it("renders the cancel button and percent number outside the progressbar", () => {
            fixture.componentRef.setInput("allowCancel", true);
            fixture.componentRef.setInput("showNumber", true);
            fixture.componentRef.setInput("compactMode", false);
            fixture.detectChanges();

            const progressbar = fixture.nativeElement.querySelector(
                progressbarSelector
            ) as HTMLElement;
            const cancelButton = fixture.nativeElement.querySelector(
                "button.nui-progress__cancel"
            ) as HTMLElement;
            const percentNumber = fixture.nativeElement.querySelector(
                ".nui-progress__number"
            ) as HTMLElement;

            expect(cancelButton).not.toBeNull();
            expect(percentNumber).not.toBeNull();
            expect(progressbar.contains(cancelButton)).toBe(false);
            expect(progressbar.contains(percentNumber)).toBe(false);
            expect(
                progressbar.querySelector("button, a[href], [tabindex]")
            ).toBeNull();
        });

        it("gives the cancel button an explicit accessible name", () => {
            fixture.componentRef.setInput("allowCancel", true);
            fixture.detectChanges();

            const cancelButton = fixture.nativeElement.querySelector(
                "button.nui-progress__cancel"
            ) as HTMLElement;
            expect(cancelButton.getAttribute("aria-label")).toBe("Cancel");
        });

        it("keeps aria-valuenow for a determinate progress at 0 percent", () => {
            fixture.componentRef.setInput("percent", 0);
            fixture.detectChanges();

            const progressbar = fixture.nativeElement.querySelector(
                progressbarSelector
            ) as HTMLElement;
            expect(progressbar.getAttribute("aria-valuenow")).toBe("0");
        });

        it("does not reference a missing message in compact mode", () => {
            fixture.componentRef.setInput("message", "Uploading");
            fixture.componentRef.setInput("compactMode", true);
            fixture.detectChanges();

            const progressbar = fixture.nativeElement.querySelector(
                progressbarSelector
            ) as HTMLElement;
            expect(progressbar.hasAttribute("aria-describedby")).toBe(false);
        });

        it("omits aria-valuenow for an indeterminate progress", () => {
            fixture.componentRef.setInput("percent", undefined);
            fixture.detectChanges();

            const progressbar = fixture.nativeElement.querySelector(
                progressbarSelector
            ) as HTMLElement;
            expect(progressbar.hasAttribute("aria-valuenow")).toBe(false);
            expect(
                progressbar.classList.contains("nui-progress--indeterminate")
            ).toBe(true);
        });
    });
});
