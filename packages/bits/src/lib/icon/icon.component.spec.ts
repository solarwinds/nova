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
import { DomSanitizer } from "@angular/platform-browser";

import { IconComponent } from "./icon.component";
import { IconService } from "./icon.service";
import { IconData, IconStatus } from "./types";

describe("components >", () => {
    describe("icon >", () => {
        let fixture: ComponentFixture<IconComponent>;
        let subject: IconComponent;

        const PRINTER = "printer";
        const BRUSH_TYPE = "filled";
        const ICON_COLOR = "green";
        const ICON_HOVER_COLOR = "orange";
        const CSS_CLASS = "custom-class";
        const COUNTER = "5";
        const ICON_CODE = "<svg></svg>";

        const ICONS: IconData[] = [
            {
                svgFile: "printer.svg",
                name: PRINTER,
                cat_namespace: undefined,
                category: "object",
                code: ICON_CODE,
            },
        ];

        (IconService as any).ICONS = ICONS;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [IconComponent],
                providers: [
                    IconService,
                    {
                        provide: DomSanitizer,
                        useValue: {
                            sanitize: (val: any) => val,
                            bypassSecurityTrustHtml: (val: any) => val,
                        },
                    },
                ],
            });
            fixture = TestBed.createComponent(IconComponent);
            subject = fixture.componentInstance;
        });

        it("should find icon data", () => {
            fixture.componentRef.setInput("icon", "printer");
            fixture.detectChanges();

            expect(subject.icon()).toBe("printer");

            const iconClass = subject.iconClass();
            expect(iconClass).toContain("nui-icon");
            expect(iconClass).toContain(BRUSH_TYPE);
            expect(iconClass).not.toContain("nui-icon-not-found");
        });

        it("should not find icon data", () => {
            const icon = "unknown";
            fixture.componentRef.setInput("icon", icon);
            fixture.detectChanges();

            expect(subject.icon()).toBe(icon);

            const iconClass = subject.iconClass();
            expect(iconClass).toContain("nui-icon");
            expect(iconClass).not.toContain(CSS_CLASS);
            expect(iconClass).toContain("nui-icon-not-found");

            expect(subject.resultingSvg().toString()).not.toContain("svg");
        });

        it("should have iconColor, iconHoverColor, cssClass classes", () => {
            fixture.componentRef.setInput("icon", "printer");
            fixture.componentRef.setInput("iconColor", ICON_COLOR);
            fixture.componentRef.setInput("iconHoverColor", ICON_HOVER_COLOR);
            fixture.componentRef.setInput("cssClass", CSS_CLASS);
            fixture.detectChanges();

            expect(subject.iconClass()).toContain(`${ICON_COLOR}-icon`);
            expect(subject.iconClass()).toContain(
                `${ICON_HOVER_COLOR}-hover-icon`
            );
            expect(subject.iconClass()).toContain(CSS_CLASS);
        });

        it("should not have iconColor, iconHoverColor, cssClass classes", () => {
            fixture.componentRef.setInput("icon", "printer");
            fixture.detectChanges();

            expect(subject.iconClass()).not.toContain(`${ICON_COLOR}-icon`);
            expect(subject.iconClass()).not.toContain(
                `${ICON_HOVER_COLOR}-hover-icon`
            );
            expect(subject.iconClass()).not.toContain(CSS_CLASS);
        });

        it("should have valid iconSize class", () => {
            fixture.componentRef.setInput("icon", "printer");
            for (const key in IconComponent.SIZE_MAP) {
                if (IconComponent.SIZE_MAP.hasOwnProperty(key)) {
                    fixture.componentRef.setInput("iconSize", key);
                    fixture.detectChanges();
                    expect(subject.iconClass()).toContain(
                        IconComponent.SIZE_MAP[key]
                    );
                }
            }
        });

        it("should not have iconSize class", () => {
            fixture.componentRef.setInput("icon", "printer");
            fixture.componentRef.setInput("iconSize", "unknown");
            fixture.detectChanges();

            expect(subject.iconClass()).not.toContain("nui-icon-size");
        });

        it("should have valid counter", () => {
            fixture.componentRef.setInput("icon", "printer");
            fixture.componentRef.setInput("counter", COUNTER);
            fixture.detectChanges();

            expect(subject.counter()).toBe(COUNTER);
        });

        it("should have undefined counter", () => {
            fixture.componentRef.setInput("icon", "printer");
            fixture.componentRef.setInput("counter", "a");
            fixture.detectChanges();

            expect(subject.counter()).toBeUndefined();

            fixture.componentRef.setInput("counter", undefined);
            fixture.detectChanges();

            expect(subject.counter()).toBeUndefined();
        });

        it("should change status and childStatus", () => {
            fixture.componentRef.setInput("icon", "printer");
            fixture.componentRef.setInput("status", IconStatus.Critical);
            fixture.componentRef.setInput("childStatus", IconStatus.Unmanaged);
            fixture.detectChanges();

            const result = subject.resultingSvg().toString();
            expect(result.includes("nui-icon-item__child")).toBeTruthy();
            expect(result.includes("nui-icon-item__grand-child")).toBeTruthy();
        });
    });
});
