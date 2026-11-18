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

import { ChangeDetectionStrategy, Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { NuiFormFieldModule } from "./form-field.module";
import { CheckboxComponent } from "../checkbox/checkbox.component";

@Component({
    template: `
        <span id="external-description">External instruction</span>
        <nui-form-field [caption]="caption" [hint]="hint">
            <nui-checkbox ariaDescribedby="external-description">
                Email alerts
            </nui-checkbox>
        </nui-form-field>
        <button data-test="update" (click)="caption = 'Delivery'; hint = ''">
            Update
        </button>
        <button data-test="clear" (click)="caption = ''">Clear caption</button>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
class OnPushFormFieldHostComponent {
    public caption = "Notifications";
    public hint = "Choose how to receive alerts";
}

describe("form field with a checkbox in an OnPush host", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CheckboxComponent, OnPushFormFieldHostComponent],
            imports: [NuiFormFieldModule],
        });
    });

    it("keeps the caption and checkbox text associated when the caption changes", async () => {
        const fixture = TestBed.createComponent(OnPushFormFieldHostComponent);
        fixture.autoDetectChanges();
        await fixture.whenStable();

        const host: HTMLElement = fixture.nativeElement;
        const checkbox = host.querySelector<HTMLElement>(
            ".nui-checkbox__label"
        );
        const caption = host.querySelector<HTMLElement>(
            ".nui-form-field__control-label"
        );
        const projectedText = host.querySelector<HTMLElement>(
            ".nui-checkbox__transclude"
        );

        expect(caption?.textContent?.trim()).toBe("Notifications");
        expect(checkbox?.getAttribute("aria-labelledby")).toBe(
            `${caption?.id} ${projectedText?.id}`
        );
        expect(projectedText?.textContent?.trim()).toBe("Email alerts");

        host.querySelector<HTMLButtonElement>("[data-test=update]")?.click();
        await fixture.whenStable();
        expect(caption?.textContent?.trim()).toBe("Delivery");
        expect(checkbox?.getAttribute("aria-labelledby")).toBe(
            `${caption?.id} ${projectedText?.id}`
        );

        host.querySelector<HTMLButtonElement>("[data-test=clear]")?.click();
        await fixture.whenStable();
        expect(host.querySelector(".nui-form-field__control-label")).toBeNull();
        expect(checkbox?.getAttribute("aria-labelledby")).toBe(
            projectedText?.id
        );
    });

    it("removes the field hint without removing a caller description", async () => {
        const fixture = TestBed.createComponent(OnPushFormFieldHostComponent);
        fixture.autoDetectChanges();
        await fixture.whenStable();

        const host: HTMLElement = fixture.nativeElement;
        const checkbox = host.querySelector<HTMLElement>(
            ".nui-checkbox__label"
        );
        const help = host.querySelector<HTMLElement>(".nui-form-field__help");
        expect(help?.textContent).toContain("Choose how to receive alerts");
        expect(checkbox?.getAttribute("aria-describedby")).toBe(
            `external-description ${help?.id}`
        );

        host.querySelector<HTMLButtonElement>("[data-test=update]")?.click();
        await fixture.whenStable();
        expect(checkbox?.getAttribute("aria-describedby")).toBe(
            "external-description"
        );
    });
});
