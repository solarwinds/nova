import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CartesianDocsComponent } from "./cartesian-docs.component";

describe("CartesianDocsComponent", () => {
    let component: CartesianDocsComponent;
    let fixture: ComponentFixture<CartesianDocsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CartesianDocsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CartesianDocsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
