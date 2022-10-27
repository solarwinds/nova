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

import { SimpleChange } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { EmbeddedContentMode } from "../../../../../components/types";
import { NuiDashboardsModule } from "../../../../../dashboards.module";
import { EmbeddedContentConfigurationComponent } from "./embedded-content-configuration.component";

describe("EmbeddedContentConfigurationComponent > ", () => {
    let component: EmbeddedContentConfigurationComponent;
    let fixture: ComponentFixture<EmbeddedContentConfigurationComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [NuiDashboardsModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(
            EmbeddedContentConfigurationComponent
        );
        component = fixture.componentInstance;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("ngOnInit > ", () => {
        it("should build a form", () => {
            component.ngOnInit();
            expect(component.form.get("customEmbeddedContent")?.value).toEqual(
                ""
            );
        });

        it("should emit formReady", () => {
            const spy = spyOn(component.formReady, "emit");
            component.ngOnInit();
            expect(spy).toHaveBeenCalledWith(component.form);
        });
    });

    describe("ngOnChanges > ", () => {
        it("should update value in form", () => {
            component.mode = EmbeddedContentMode.URL;
            component.ngOnInit();
            component.customEmbeddedContent = "https://www.ventusky.com/";
            const changes = {
                customEmbeddedContent: new SimpleChange(
                    "",
                    component.customEmbeddedContent,
                    false
                ),
            };

            component.ngOnChanges(changes);
            expect(component.form.get("urlCustomContent")?.value).toEqual(
                component.customEmbeddedContent
            );
        });
    });
});
