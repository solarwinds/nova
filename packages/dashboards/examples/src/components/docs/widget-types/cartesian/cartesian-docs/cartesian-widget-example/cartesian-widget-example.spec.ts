import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CartesianWidgetExampleComponent } from "./cartesian-widget-example.component";

describe("CartesianWidgetExampleComponent", () => {
    let component: CartesianWidgetExampleComponent;
    let fixture: ComponentFixture<CartesianWidgetExampleComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CartesianWidgetExampleComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CartesianWidgetExampleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
