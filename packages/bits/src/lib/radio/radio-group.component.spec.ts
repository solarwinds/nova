// © 2026 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";

import { NuiRadioModule } from "./radio.module";

@Component({
    template: `
        <nui-radio-group [(value)]="direction">
            <nui-radio [value]="false">Egress</nui-radio>
            <nui-radio [value]="true">Ingress</nui-radio>
        </nui-radio-group>
        <nui-radio-group [name]="optionalName" [(value)]="scope">
            <nui-radio [value]="false">This map</nui-radio>
            <nui-radio [value]="true">All maps</nui-radio>
        </nui-radio-group>
        <nui-radio-group name="explicit" [(value)]="explicit">
            <nui-radio [value]="false">No</nui-radio>
            <nui-radio [value]="true">Yes</nui-radio>
        </nui-radio-group>
    `,
    standalone: false,
})
class RadioGroupsHostComponent {
    public direction = false;
    public scope = false;
    public optionalName: string | undefined;
    public explicit = false;
}

describe("radio groups", () => {
    it("keeps selections independent and preserves explicit group names", async () => {
        await TestBed.configureTestingModule({
            imports: [FormsModule, NuiRadioModule],
            declarations: [RadioGroupsHostComponent],
        }).compileComponents();
        const fixture = TestBed.createComponent(RadioGroupsHostComponent);
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        const groups: NodeListOf<HTMLElement> =
            fixture.nativeElement.querySelectorAll("nui-radio-group");
        const direction = groups[0].querySelectorAll<HTMLInputElement>("input");
        const scope = groups[1].querySelectorAll<HTMLInputElement>("input");
        const explicit = groups[2].querySelectorAll<HTMLInputElement>("input");

        expect(direction[0].name).toBe(direction[1].name);
        expect(scope[0].name).toBe(scope[1].name);
        expect(direction[0].name).not.toBe(scope[0].name);
        expect(explicit[0].name).toBe("explicit");
        expect(explicit[1].name).toBe("explicit");

        direction[1].click();
        fixture.detectChanges();
        scope[1].click();
        fixture.detectChanges();
        expect(direction[1].checked).toBeTrue();
        expect(scope[1].checked).toBeTrue();
    });
});
