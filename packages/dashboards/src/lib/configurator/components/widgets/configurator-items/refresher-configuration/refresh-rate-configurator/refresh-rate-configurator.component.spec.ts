import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormBuilder } from "@angular/forms";

import { RefreshRateConfiguratorComponent } from "./refresh-rate-configurator.component";

describe("RefreshRateConfiguratorComponent", () => {
    let component: RefreshRateConfiguratorComponent;
    let fixture: ComponentFixture<RefreshRateConfiguratorComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [RefreshRateConfiguratorComponent],
            providers: [FormBuilder],
            schemas: [NO_ERRORS_SCHEMA],
        });

        fixture = TestBed.createComponent(RefreshRateConfiguratorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
