import { ComponentFixture, TestBed } from "@angular/core/testing";

import { WizardOverflowComponent } from "./wizard-overflow.component";

describe("WizardOverflowComponent", () => {
    let component: WizardOverflowComponent;
    let fixture: ComponentFixture<WizardOverflowComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ WizardOverflowComponent ],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(WizardOverflowComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
