import { TestBed } from "@angular/core/testing";

import { DialogBackdropComponent } from "./dialog-backdrop.component";

describe("components >", () => {
    describe("dialog-backdrop >", () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [DialogBackdropComponent],
            });
        });

        it("should render backdrop with required CSS classes", () => {
            const fixture = TestBed.createComponent(DialogBackdropComponent);

            fixture.detectChanges();
            expect(fixture.nativeElement.className).toContain(
                "dialog-backdrop"
            );
        });
    });
});
