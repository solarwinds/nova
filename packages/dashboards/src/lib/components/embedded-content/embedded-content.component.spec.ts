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

import { NuiDashboardsModule } from "../../dashboards.module";
import { EmbeddedContentMode } from "../types";
import { EmbeddedContentComponent } from "./embedded-content.component";

describe("EmbeddedContentComponent", () => {
    let component: EmbeddedContentComponent;
    let fixture: ComponentFixture<EmbeddedContentComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [NuiDashboardsModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EmbeddedContentComponent);
        component = fixture.componentInstance;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("ngOnInit > ", () => {
        it("should create iframe and apply embedded sanitized content there, when mode is `url`", () => {
            component.sanitized = true;
            component.mode = EmbeddedContentMode.URL;
            component.customEmbeddedContent =
                "https://www.ventusky.com/<script type='text/javascript'>alert('hello world!');</script>";
            component.ngOnInit();

            const iframeElement =
                fixture.debugElement.nativeElement.querySelector("iframe");
            expect(iframeElement).toBeDefined();
            expect(iframeElement.src).not.toContain("</script>");
            expect(iframeElement.width).toEqual("100%");
            expect(iframeElement.height).toEqual("100%");
        });

        it("should create element with innerHTML and apply embedded sanitized content there, when mode is `html`", () => {
            component.sanitized = true;
            component.mode = EmbeddedContentMode.HTML;
            component.customEmbeddedContent =
                "<p><a href='../../example/index.html''>Link</a></p><script type='text/javascrip'>alert('hello world!');</script>";
            spyOn(console, "warn"); // suppress sanitization warning
            component.ngOnInit();

            const anchorElement = component.anchor.nativeElement;
            expect(anchorElement).toBeDefined();
            expect(anchorElement.innerHTML).toEqual(
                `<p><a href="../../example/index.html">Link</a></p>`
            );
        });
    });

    describe("ngOnChanges > ", () => {
        it("should change embedded content properly", () => {
            const oldEmbeddedContent =
                "https://www.ventusky.com/?p=50.3;31.2;5&l=radar";
            component.customEmbeddedContent = "https://www.ventusky.com/";
            const changes = {
                customEmbeddedContent: new SimpleChange(
                    oldEmbeddedContent,
                    component.customEmbeddedContent,
                    false
                ),
            };
            component.sanitized = true;
            component.mode = EmbeddedContentMode.URL;
            component.ngOnChanges(changes);

            const iframeElement =
                fixture.debugElement.nativeElement.querySelector("iframe");
            expect(iframeElement).toBeDefined();
            expect(iframeElement.src).toEqual(component.customEmbeddedContent);
        });
    });
});
