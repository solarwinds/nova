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

import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ProgressComponent } from "./progress.component";
import { NuiProgressModule } from "./progress.module";

@Component({
    template: `
        <ng-template #helpTemplate>
            <span>Custom progress help</span>
        </ng-template>
        <nui-progress
            [show]="true"
            [percent]="percent"
            [ariaLabel]="'Upload progress'"
            [message]="message"
            [helpText]="helpText"
            [helpTemplateRef]="useHelpTemplate ? helpTemplate : undefined"
            [allowCancel]="allowCancel"
            [compactMode]="compactMode">
        </nui-progress>
    `,
    standalone: false,
})
class TestProgressHostComponent {
    public percent: number | undefined;
    public message: string | undefined;
    public helpText: string | undefined;
    public compactMode = false;
    public useHelpTemplate = true;
    public allowCancel = false;
}

describe("ProgressComponent", () => {
    let fixture: ComponentFixture<TestProgressHostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TestProgressHostComponent],
            imports: [NuiProgressModule],
        }).compileComponents();

        fixture = TestBed.createComponent(TestProgressHostComponent);
        fixture.detectChanges();
    });

    it("exposes progressbar semantics only on the bar", () => {
        const host = fixture.nativeElement.querySelector(
            "nui-progress"
        ) as HTMLElement;
        const bar = fixture.nativeElement.querySelector(
            ".nui-progress__bar"
        ) as HTMLElement;

        expect(host.hasAttribute("role")).toBeFalse();
        expect(
            fixture.nativeElement.querySelectorAll("[role='progressbar']")
                .length
        ).toBe(1);
        expect(bar.getAttribute("role")).toBe("progressbar");
        expect(bar.getAttribute("aria-valuemin")).toBe("0");
        expect(bar.getAttribute("aria-valuemax")).toBe("100");
        expect(bar.getAttribute("aria-label")).toBe("Upload progress");
    });

    it("exposes a determinate zero value", () => {
        fixture.componentInstance.percent = 0;
        fixture.detectChanges();

        const bar = fixture.nativeElement.querySelector(
            ".nui-progress__bar"
        ) as HTMLElement;

        expect(bar.getAttribute("aria-valuenow")).toBe("0");
    });

    it("omits the current value for indeterminate progress", () => {
        fixture.componentInstance.percent = undefined;
        fixture.detectChanges();

        const bar = fixture.nativeElement.querySelector(
            ".nui-progress__bar"
        ) as HTMLElement;

        expect(bar.hasAttribute("aria-valuenow")).toBeFalse();
    });

    it("describes custom help template content", () => {
        const bar = fixture.nativeElement.querySelector(
            ".nui-progress__bar"
        ) as HTMLElement;
        const describedBy = bar.getAttribute("aria-describedby");
        const descriptions = Array.from<HTMLElement>(
            fixture.nativeElement.querySelectorAll("[id]")
        ).filter(element => element.id === describedBy);

        expect(describedBy).toBeTruthy();
        expect(descriptions.length).toBe(1);
        expect(descriptions[0].textContent).toContain("Custom progress help");
    });

    it("describes default help text without duplicating its id", () => {
        fixture.componentInstance.helpText = "Upload complete";
        fixture.componentInstance.useHelpTemplate = false;
        fixture.detectChanges();

        const bar = fixture.nativeElement.querySelector(
            ".nui-progress__bar"
        ) as HTMLElement;
        const describedBy = bar.getAttribute("aria-describedby");
        const descriptions = Array.from<HTMLElement>(
            fixture.nativeElement.querySelectorAll("[id]")
        ).filter(element => element.id === describedBy);

        expect(describedBy).toBeTruthy();
        expect(descriptions.length).toBe(1);
        expect(descriptions[0].textContent).toContain("Upload complete");
    });

    it("gives the cancel button an accessible name", () => {
        fixture.componentInstance.allowCancel = true;
        fixture.detectChanges();

        const cancelButton = fixture.nativeElement.querySelector(
            ".nui-progress__cancel"
        ) as HTMLElement;

        expect(cancelButton.getAttribute("aria-label")).toBe("Cancel");
    });

    it("omits the description in compact mode", () => {
        fixture.componentInstance.compactMode = true;
        fixture.detectChanges();

        const bar = fixture.nativeElement.querySelector(
            ".nui-progress__bar"
        ) as HTMLElement;

        expect(bar.hasAttribute("aria-describedby")).toBeFalse();
    });
});

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
            component.showProgress = false;
            fixture.detectChanges();

            expect(
                fixture.nativeElement.querySelector(progressbarSelector)
            ).toBeNull();
        });

        it("describes the progressbar by the rendered message", () => {
            component.message = "Uploading";
            component.compactMode = false;
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

        it("renders the cancel button and percent number outside the progressbar", () => {
            component.allowCancel = true;
            component.showNumber = true;
            component.compactMode = false;
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
            component.allowCancel = true;
            fixture.detectChanges();

            const cancelButton = fixture.nativeElement.querySelector(
                "button.nui-progress__cancel"
            ) as HTMLElement;
            expect(cancelButton.getAttribute("aria-label")).toBe("Cancel");
        });

        it("keeps aria-valuenow for a determinate progress at 0 percent", () => {
            component.percent = 0;
            component.ngOnChanges();
            fixture.detectChanges();

            const progressbar = fixture.nativeElement.querySelector(
                progressbarSelector
            ) as HTMLElement;
            expect(progressbar.getAttribute("aria-valuenow")).toBe("0");
        });

        it("does not reference a missing message in compact mode", () => {
            component.message = "Uploading";
            component.compactMode = true;
            fixture.detectChanges();

            const progressbar = fixture.nativeElement.querySelector(
                progressbarSelector
            ) as HTMLElement;
            expect(progressbar.hasAttribute("aria-describedby")).toBe(false);
        });

        it("omits aria-valuenow for an indeterminate progress", () => {
            component.percent = undefined as unknown as number;
            component.ngOnChanges();
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
