import { Component, DebugElement, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { Observable } from "rxjs";

import { NUI_SELECT_V2_OPTION_PARENT_COMPONENT } from "../constants";
import { SelectV2OptionComponent } from "../option/select-v2-option.component";
import { SelectV2Component } from "../select/select-v2.component";

// noinspection AngularIncorrectTemplateDefinition
@Component({
    selector: "select-mock",
})

class SelectMockComponent {
    public multiselect: boolean = false;

    valueChanged: Observable<string>;
    valueSelected: Observable<any>;
    isTypeaheadEnabled: boolean;
    selectedOptions: SelectV2OptionComponent[] = [];

    public selectOption(option: SelectV2OptionComponent): void {
        this.selectedOptions.push(option);
    }
}

describe("components >", () => {
    describe("select-option v2 >", () => {
        let component: SelectV2OptionComponent;
        let fixture: ComponentFixture<SelectV2OptionComponent>;
        let debug: DebugElement;

        beforeEach(waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [
                    SelectV2OptionComponent,
                    SelectV2Component,
                ],
                providers: [
                    {
                        provide: NUI_SELECT_V2_OPTION_PARENT_COMPONENT,
                        useClass: SelectMockComponent,
                    },
                ],
                imports: [],
                schemas: [ NO_ERRORS_SCHEMA ],
            })
                .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(SelectV2OptionComponent);
            component = fixture.componentInstance;
            component["select"] = TestBed.inject(NUI_SELECT_V2_OPTION_PARENT_COMPONENT);
            debug = fixture.debugElement;
            fixture.detectChanges();
        });

        it("should create", () => {
            expect(component).toBeTruthy();
        });

        describe("host binding inputs >", () => {
            afterAll(() => {
                component.outfiltered = false;
                component.isDisabled = false;
                component.active = false;
            });

            ["hidden", "selected"]
                .forEach(className => {
                    it(`is not have ${className} class name by default`, () => {
                        expect(debug.nativeElement.classList.value.includes(className)).toBe(false);
                    });
                });

            it(`the "hidden" class is added`, () => {
                component.outfiltered = true;
                fixture.detectChanges();
                expect(debug.nativeElement.classList.value.includes("hidden")).toBe(true);
            });

            describe("selected", () => {
                beforeEach(() => {
                    component["select"].multiselect = false;
                    // @ts-ignore: Suppressing error for testing purposes
                    component.index = undefined;
                });

                afterEach(() => {
                    component["select"].selectedOptions = [];
                });

                it("should select if current option is the one being selected", () => {
                    component["select"].selectedOptions.push(component);
                    fixture.detectChanges();
                    expect(component.selected).toBe(true);
                    expect(debug.nativeElement.classList.value.includes("selected")).toBe(true);
                });

                it("should NOT select if current option is NOT the one being selected", () => {
                    component["select"]
                        .selectedOptions
                        .push(TestBed.createComponent(SelectV2OptionComponent).componentInstance);
                    fixture.detectChanges();
                    expect(component.selected).toBe(false);
                    expect(debug.nativeElement.classList.value.includes("selected")).toBe(false);
                });

                it("should select if current option is the one being selected", () => {
                    component.index = 0;
                    component["select"].selectedOptions.push(component);
                    fixture.detectChanges();
                    expect(component.selected).toBe(true);
                    expect(debug.nativeElement.classList.value.includes("selected")).toBe(true);
                });

                it("should NOT select if current option is NOT the one being selected", () => {
                    const anotherComponent = TestBed.createComponent(SelectV2OptionComponent).componentInstance;

                    component.index = 0;
                    anotherComponent.index = 1;
                    component["select"].selectedOptions.push(anotherComponent);
                    fixture.detectChanges();

                    expect(component.selected).toBe(false);
                    expect(debug.nativeElement.classList.value.includes("selected")).toBe(false);
                });
            });
        });

        describe("onClick", () => {
            const clickEvent = new MouseEvent("click");
            let onClickSpy: any;
            let preventDefaultSpy: any;
            let stopPropagationSpy: any;

            beforeEach(() => {
                onClickSpy = spyOn<any>(component["select"], "selectOption");
                preventDefaultSpy = spyOn<any>(clickEvent, "preventDefault");
                stopPropagationSpy = spyOn<any>(clickEvent, "stopPropagation");
            });

            it("should click if not disabled", () => {
                component.isDisabled = false;
                fixture.detectChanges();
                component.onClick(clickEvent);
                expect(preventDefaultSpy).toHaveBeenCalled();
                expect(stopPropagationSpy).toHaveBeenCalled();
                expect(onClickSpy).toHaveBeenCalled();
            });

            it("should not be able to click if disabled", () => {
                component.isDisabled = true;
                fixture.detectChanges();
                component.onClick(clickEvent);
                expect(preventDefaultSpy).toHaveBeenCalled();
                expect(stopPropagationSpy).toHaveBeenCalled();
                expect(onClickSpy).not.toHaveBeenCalled();
            });
        });
    });
});

