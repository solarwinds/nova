import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { Subject } from "rxjs";

import { DialogComponent } from "./dialog.component";

describe("components >", () => {
    describe("dialog >", () => {
        let fixture: ComponentFixture<DialogComponent>;

        beforeEach(() => {
            const mockRouter = {
                events: new Subject<any>(),
            };

            TestBed.configureTestingModule({
                declarations: [DialogComponent],
                providers: [{ provide: Router, useValue: mockRouter }],
            });
            fixture = TestBed.createComponent(DialogComponent);
        });

        describe("basic rendering functionality", () => {
            it("should render default dialog window", () => {
                fixture.detectChanges();

                const modalEl: Element = fixture.nativeElement;
                const dialogEl: Element =
                    fixture.nativeElement.querySelector(".modal-dialog");

                expect(modalEl.className).toContain("nui-dialog");
                expect(dialogEl.className).toContain("modal-dialog");
            });

            it("should render default dialog window with a specified size", () => {
                fixture.componentInstance.size = "sm";
                fixture.detectChanges();

                const dialogEl: Element =
                    fixture.nativeElement.querySelector(".modal-dialog");
                expect(dialogEl.className).toContain("modal-dialog");
                expect(dialogEl.className).toContain("dialog-sm");
            });

            it("should render default dialog window with a specified class", () => {
                fixture.componentInstance.windowClass = "custom-class";
                fixture.detectChanges();

                expect(fixture.nativeElement.className).toContain(
                    "custom-class"
                );
            });

            it("aria attributes", () => {
                fixture.detectChanges();

                expect(fixture.nativeElement.getAttribute("role")).toBe(
                    "dialog"
                );
            });

            it("should contain focus trap attribute", () => {
                fixture.detectChanges();
                const dialogEl: Element =
                    fixture.nativeElement.querySelector(".modal-dialog");

                expect(
                    dialogEl.attributes.getNamedItem("cdkTrapFocus")
                ).not.toBeFalsy();
            });
        });
    });
});
