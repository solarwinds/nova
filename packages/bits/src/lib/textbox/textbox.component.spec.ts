import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SpinnerComponent } from "../spinner/spinner.component";

import { TextboxComponent } from "./textbox.component";

describe("components >", () => {
    describe("textbox >", () => {

        let fixture: ComponentFixture<TextboxComponent>;
        let testComponent: TextboxComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [
                    TextboxComponent,
                    SpinnerComponent,
                ],
            }).compileComponents();

            fixture = TestBed.createComponent(TextboxComponent);
            testComponent = fixture.componentInstance;

            fixture.detectChanges();
        });

        describe("general > ", () => {
            it("should set focus on textbox programmatically", () => {
                expect(testComponent.textboxInput.nativeElement).not.toBe(document.activeElement);

                testComponent.focus();
                expect(testComponent.textboxInput.nativeElement).toBe(document.activeElement);
            });
        });
    });
});
