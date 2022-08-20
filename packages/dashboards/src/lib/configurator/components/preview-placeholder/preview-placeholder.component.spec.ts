import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { PreviewPlaceholderComponent } from "./preview-placeholder.component";

describe("PreviewPlaceholderComponent", () => {
    let component: PreviewPlaceholderComponent;
    let fixture: ComponentFixture<PreviewPlaceholderComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [PreviewPlaceholderComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PreviewPlaceholderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
