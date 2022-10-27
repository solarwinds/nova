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

import { DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { LinkFormatterComponent } from "./link-formatter.component";

describe(LinkFormatterComponent.name, () => {
    let component: LinkFormatterComponent;
    let fixture: ComponentFixture<LinkFormatterComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [LinkFormatterComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(LinkFormatterComponent);
        component = fixture.componentInstance;
        component.data = {
            link: "http://some.fake/link",
            value: "text",
        };
    });

    const getLink = (): DebugElement | null =>
        fixture.debugElement.query(By.css("a"));

    const assertLinkTarget = (expectedTarget: string) => {
        const link = getLink();
        expect(link?.attributes.target).toBe(expectedTarget);
    };

    it("Defaults to open in new tab", () => {
        component.ngOnChanges({});
        fixture.detectChanges();
        assertLinkTarget("_blank");
    });

    it("Detects changes for target property", () => {
        component.targetSelf = true;
        component.ngOnChanges({});
        fixture.detectChanges();
        assertLinkTarget("_self");
    });
});
