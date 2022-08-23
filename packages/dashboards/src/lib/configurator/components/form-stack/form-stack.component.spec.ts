import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { AbstractControl, FormGroup, FormGroupDirective } from "@angular/forms";
import { Subject } from "rxjs";

import { EventBus } from "@nova-ui/bits";

import { NuiDashboardsModule } from "../../../dashboards.module";
import { DynamicComponentCreator } from "../../../pizzagna/services/dynamic-component-creator.service";
import { PizzagnaService } from "../../../pizzagna/services/pizzagna.service";
import { ProviderRegistryService } from "../../../services/provider-registry.service";
import { PIZZAGNA_EVENT_BUS } from "../../../types";
import { FormStackComponent } from "./form-stack.component";

class MockFormGroupDirective {
    public form: FormGroup = {
        valueChanges: new Subject(),
        value: null,
        addControl(name: string, control: AbstractControl): void {},
    } as unknown as FormGroup;
}

describe("FormStackComponent", () => {
    let component: FormStackComponent;
    let fixture: ComponentFixture<FormStackComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [NuiDashboardsModule],
            providers: [
                ProviderRegistryService,
                PizzagnaService,
                DynamicComponentCreator,
                {
                    provide: PIZZAGNA_EVENT_BUS,
                    useClass: EventBus,
                },
                {
                    provide: FormGroupDirective,
                    useClass: MockFormGroupDirective,
                },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FormStackComponent);
        component = fixture.componentInstance;
        component.nodes = [];
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("ngOnInit > ", () => {
        it("should initialize the form group", () => {
            expect((<any>component).form).toBeUndefined();
            component.ngOnInit();
            expect((<any>component).form).toEqual(component.formDirective.form);
        });
    });

    describe("onEvent > ", () => {
        it("should invoke addFormGroup on formReady event", () => {
            const testComponentId = "testComponentId";
            const testPayload = "test payload";
            spyOn(component, "addFormGroup" as never);
            component.onEvent(testComponentId, {
                id: "formReady",
                payload: testPayload,
            });
            expect(component.addFormGroup).toHaveBeenCalledWith(
                testComponentId,
                testPayload as never
            );
        });
    });

    describe("addFormGroup > ", () => {
        it("should invoke addControl on the form", () => {
            const testComponentId = "testComponentId";
            const testFormGroup = { test: {} };
            component.ngOnInit();
            spyOn(component.form, "addControl" as never);
            component.addFormGroup(
                testComponentId,
                testFormGroup as unknown as FormGroup
            );
            expect(component.form.addControl).toHaveBeenCalledWith(
                testComponentId,
                testFormGroup as never
            );
        });
    });
});
