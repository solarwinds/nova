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
            fixture.nativeElement.querySelectorAll('[role="progressbar"]')
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
