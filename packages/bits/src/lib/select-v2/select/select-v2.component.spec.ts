// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import { LiveAnnouncer } from "@angular/cdk/a11y";
import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    NO_ERRORS_SCHEMA,
    QueryList,
    SimpleChange,
    ViewChild,
} from "@angular/core";
import {
    ComponentFixture,
    fakeAsync,
    TestBed,
    tick,
    waitForAsync,
} from "@angular/core/testing";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";

import { KEYBOARD_CODE } from "../../../constants/keycode.constants";
import { NuiOverlayModule } from "../../overlay/overlay.module";
import { IOptionValueObject, OptionValueType } from "../../overlay/types";
import { OptionKeyControlService } from "../option-key-control.service";
import { SelectV2OptionComponent } from "../option/select-v2-option.component";
import { InputValueTypes } from "../types";
import { SelectV2Component } from "./select-v2.component";

@Component({
    template: `
        <nui-select-v2 placeholder="Select Item" [formControl]="selectControl">
            <nui-select-v2-option *ngFor="let item of items" [value]="item">{{
                item
            }}</nui-select-v2-option>
        </nui-select-v2>
    `,
})
class SelectV2WrapperWithFormControlComponent {
    public items = Array.from({ length: 10 }).map((_, i) => `Item ${i}`);
    public selectControl = new FormControl();
    @ViewChild(SelectV2Component) select: SelectV2Component;
    constructor(public elRef: ElementRef<HTMLElement>) {}
}

@Component({
    template: `
        <nui-select-v2 [value]="value" placeholder="Select Item">
            <nui-select-v2-option *ngFor="let item of items" [value]="item">{{
                item
            }}</nui-select-v2-option>
        </nui-select-v2>
    `,
})
class SelectV2WrapperWithValueComponent {
    public items = Array.from({ length: 10 }).map((_, i) => `Item ${i}`);
    public value: InputValueTypes = this.items[0];
    @ViewChild(SelectV2Component) select: SelectV2Component;
    constructor(public elRef: ElementRef<HTMLElement>) {}
}

@Component({
    template: `
        <nui-select-v2 placeholder="Select Item" [formControl]="selectControl">
            <nui-select-v2-option
                *ngFor="let item of items"
                [value]="item.id"
                >{{ item.name }}</nui-select-v2-option
            >
        </nui-select-v2>
    `,
})
class SelectV2WrapperAsyncComponent {
    public items: any[];
    public selectControl = new FormControl();
    @ViewChild(SelectV2Component) select: SelectV2Component;
    constructor(public elRef: ElementRef<HTMLElement>) {}

    public setItems() {
        setTimeout(() => {
            this.items = Array.from({ length: 10 }).map((_, i) => ({
                id: i,
                name: `Item ${i}`,
            }));
        }, 200);
    }
}

const selectedValuesMock: OptionValueType[] = [
    { id: "item-0", name: "Item 0", icon: "email" },
    { id: "item-1", name: "Item 1", icon: "email" },
    { id: "item-2", name: "Item 2", icon: "email" },
];

describe("components >", () => {
    describe("SelectV2Component", () => {
        let component: SelectV2Component;
        let fixture: ComponentFixture<SelectV2Component>;
        let element: any;
        let selectedOptionsMock: SelectV2OptionComponent[];
        let wrapperWithFormControlFixture: ComponentFixture<SelectV2WrapperWithFormControlComponent>;
        let wrapperWithFormControlComponent: SelectV2WrapperWithFormControlComponent;
        let wrapperWithValueFixture: ComponentFixture<SelectV2WrapperWithValueComponent>;
        let wrapperWithValueComponent: SelectV2WrapperWithValueComponent;

        let wrapperFixtureAsync: ComponentFixture<SelectV2WrapperAsyncComponent>;
        let wrapperComponentAsync: SelectV2WrapperAsyncComponent;

        beforeEach(waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [
                    SelectV2Component,
                    SelectV2OptionComponent,
                    SelectV2WrapperWithFormControlComponent,
                    SelectV2WrapperAsyncComponent,
                    SelectV2WrapperWithValueComponent,
                ],
                providers: [
                    ChangeDetectorRef,
                    OptionKeyControlService,
                    LiveAnnouncer,
                ],
                imports: [FormsModule, ReactiveFormsModule, NuiOverlayModule],
                schemas: [NO_ERRORS_SCHEMA],
            }).compileComponents();

            // component
            fixture = TestBed.createComponent(SelectV2Component);
            element = fixture.nativeElement;
            component = fixture.componentInstance;

            // options
            const optionComponentMocks = Array.from({ length: 3 }).map(() =>
                TestBed.createComponent(SelectV2OptionComponent)
            );
            selectedOptionsMock = optionComponentMocks.map(
                (c) => c.componentInstance
            );
            optionComponentMocks.forEach((c, i) => {
                c.componentInstance.value = selectedValuesMock[i];
                (<HTMLElement>c.elementRef.nativeElement).textContent = (<
                    IOptionValueObject
                >selectedValuesMock[i]).name;
            });

            // wrapper with FormControl component
            wrapperWithFormControlFixture = TestBed.createComponent(
                SelectV2WrapperWithFormControlComponent
            );
            wrapperWithFormControlComponent =
                wrapperWithFormControlFixture.componentInstance;
            wrapperWithFormControlFixture.detectChanges();

            // wrapper with value component
            wrapperWithValueFixture = TestBed.createComponent(
                SelectV2WrapperWithValueComponent
            );
            wrapperWithValueComponent =
                wrapperWithValueFixture.componentInstance;
            wrapperWithValueFixture.detectChanges();

            // wrapper async component
            wrapperFixtureAsync = TestBed.createComponent(
                SelectV2WrapperAsyncComponent
            );
            wrapperComponentAsync = wrapperFixtureAsync.componentInstance;
            wrapperFixtureAsync.detectChanges();
        }));

        it("should create an instance", () => {
            expect(component).toBeTruthy();
            expect(component.registerOnChange).toBeDefined();
            expect(component.registerOnTouched).toBeDefined();
        });

        describe("ngAfterContentInit", () => {
            afterEach(() => {
                component.selectedOptions = [];
                // @ts-ignore: Suppressing error for testing purposes
                component.options = null;
            });
            describe("if is not muiltiselect", () => {
                beforeEach(() => {
                    component.multiselect = false;
                    component.options =
                        new QueryList<SelectV2OptionComponent>();
                    component.options.reset([selectedOptionsMock]);
                    component.allPopupItems =
                        new QueryList<SelectV2OptionComponent>();
                    component.allPopupItems.reset([selectedOptionsMock]);
                });

                it("should set displayText to option value, when option is selected", fakeAsync(() => {
                    component.selectedOptions = [selectedOptionsMock[0]];
                    component.ngAfterContentInit();
                    tick();
                    expect(component.displayText).toEqual(
                        selectedOptionsMock[0].viewValue
                    );
                }));

                it("should set displayText to empty string, when option does not selected", fakeAsync(() => {
                    // @ts-ignore: Suppressing error for testing purposes
                    component.selectedOptions[0] = null;
                    component.ngAfterContentInit();
                    tick();
                    expect(component.displayText).toEqual("");
                }));
            });

            it("should not set displayText, if is muiltiselect", fakeAsync(() => {
                component.multiselect = true;
                component.options = new QueryList<SelectV2OptionComponent>();
                component.options.reset([selectedOptionsMock]);
                component.selectedOptions = [
                    selectedOptionsMock[0],
                    selectedOptionsMock[1],
                ];
                fixture.detectChanges();
                component.ngAfterContentInit();
                tick();
                expect(component.displayText).toBeUndefined();
            }));
        });

        it("should initKeyboardManager on ngAfterViewInit lifeCycle hook", (): void => {
            const initKeyboardManagerSpy = spyOn<any>(
                component["optionKeyControlService"],
                "initKeyboardManager"
            );
            const setSkipPredicateSpy = spyOn<any>(
                component["optionKeyControlService"],
                "setSkipPredicate"
            );
            fixture.detectChanges();
            component.options = new QueryList<SelectV2OptionComponent>();
            component.options.reset([selectedOptionsMock]);
            component.allPopupItems = component.options;
            component.ngAfterViewInit();
            expect(component["optionKeyControlService"].optionItems).toEqual(
                component.options
            );
            expect(component["optionKeyControlService"].popup).toEqual(
                component["dropdown"]
            );
            expect(initKeyboardManagerSpy).toHaveBeenCalled();
            expect(setSkipPredicateSpy).toHaveBeenCalled();
        });

        describe("selectOption", () => {
            beforeEach(() => {
                fixture.detectChanges();
                component.options = new QueryList<SelectV2OptionComponent>();
                component.options.reset([selectedOptionsMock]);
                component.allPopupItems = component.options;
                component.ngAfterViewInit();
                component["dropdown"].show();
            });

            afterEach(() => {
                component.selectedOptions = [];
                // @ts-ignore: Suppressing error for testing purposes
                component.options = null;
            });

            describe("if is not muiltiselect", () => {
                beforeEach(() => {
                    component.multiselect = false;
                });

                it("should set displayText to option value, when option is selected", () => {
                    component.selectedOptions = [selectedOptionsMock[0]];
                    fixture.detectChanges();
                    component.selectOption(selectedOptionsMock[0]);
                    expect(component.displayText).toEqual(
                        selectedOptionsMock[0].viewValue
                    );
                });

                it("should add option to selectedOptions", () => {
                    component.selectOption(selectedOptionsMock[0]);
                    expect(component.selectedOptions).toEqual([
                        selectedOptionsMock[0],
                    ]);
                });
            });

            describe("if is muiltiselect", () => {
                beforeEach(() => {
                    component.multiselect = true;
                });

                it("should add option to selectedOptions", () => {
                    component.selectOption(selectedOptionsMock[0]);
                    expect(component.selectedOptions).toContain(
                        selectedOptionsMock[0]
                    );
                });

                it("should not set displayText, if is muiltiselect", () => {
                    component.selectOption(selectedOptionsMock[0]);
                    expect(component.displayText).toBeUndefined();
                });
            });

            it("should hide dropdown, when selectedOptions includes option", () => {
                component.selectedOptions = [selectedOptionsMock[0]];
                component.selectOption(selectedOptionsMock[0]);
                expect(component["dropdown"].showing).toEqual(false);
            });

            it("should hide dropdown", () => {
                component.selectOption(selectedOptionsMock[0]);
                expect(component["dropdown"].showing).toEqual(false);
            });

            it("should be active this option", () => {
                component.selectOption(selectedOptionsMock[0]);
                expect(
                    component["optionKeyControlService"].getActiveItemIndex()
                ).toEqual(0);
            });
        });

        describe("isEmpty", () => {
            describe("if is muiltiselect", () => {
                beforeEach(() => {
                    component.multiselect = true;
                });

                it("should return true, when does not have any selectedOptions", () => {
                    component.selectedOptions = [];
                    expect(component.isEmpty).toEqual(true);
                });

                it("should return false, when have selectedOptions", () => {
                    component.selectedOptions = [
                        selectedOptionsMock[0],
                        selectedOptionsMock[1],
                    ];
                    expect(component.isEmpty).toEqual(false);
                });
            });

            describe("if is not muiltiselect", () => {
                beforeEach(() => {
                    component.multiselect = false;
                });

                it("should return true, when does not have any selectedOptions", () => {
                    // @ts-ignore: Suppressing error for testing purposes
                    component.selectedOptions[0] = undefined;
                    expect(component.isEmpty).toEqual(true);
                });

                it("should return false, when have selectedOptions", () => {
                    component.selectedOptions = [selectedOptionsMock[0]];
                    expect(component.isEmpty).toEqual(false);
                });
            });
        });

        it("should mouseDown be true, when MouseDown event is happened", () => {
            element.dispatchEvent(new MouseEvent("mousedown"));
            expect(component["mouseDown"]).toEqual(true);
        });

        describe("MouseUp event", () => {
            beforeEach(() => {
                fixture.detectChanges();
                component.options = new QueryList<SelectV2OptionComponent>();
                component.options.reset([selectedOptionsMock]);
                element.dispatchEvent(new MouseEvent("mouseup"));
            });

            it("should mouseDown be false, when MouseDown event is happened", () => {
                expect(component["mouseDown"]).toEqual(false);
            });

            it("should show dropdown", () => {
                expect(component["dropdown"].showing).toEqual(true);
            });
        });

        describe("FocusIn event", () => {
            beforeEach(() => {
                fixture.detectChanges();
                component.options = new QueryList<SelectV2OptionComponent>();
                component.options.reset([selectedOptionsMock]);
            });

            it("should hide dropdown, when mouseDown is true", () => {
                component["mouseDown"] = true;
                element.dispatchEvent(new Event("focusin"));
                expect(component["dropdown"].showing).toEqual(false);
            });

            it("should show dropdown, when mouseDown is false", () => {
                spyOn(component, "isOpenOnFocus" as never).and.returnValue(
                    true as never
                );
                component["mouseDown"] = false;
                element.dispatchEvent(new Event("focusin"));
                expect(component["dropdown"].showing).toEqual(true);
            });
        });

        describe("onKeyDown >", () => {
            beforeEach(() => {
                fixture.detectChanges();
                component.options = new QueryList<SelectV2OptionComponent>();
                component.options.reset([selectedOptionsMock]);
                component.allPopupItems = component.options;
                component.ngAfterViewInit();
                component["dropdown"].show();
            });

            describe("if dropdown is showing >", () => {
                it("should be first item active, when we press PAGE_UP key", () => {
                    const event = new KeyboardEvent("keydown", {
                        code: KEYBOARD_CODE.PAGE_UP,
                    } as KeyboardEventInit);
                    component.onKeyDown(event);
                    expect(
                        component[
                            "optionKeyControlService"
                        ].getActiveItemIndex()
                    ).toEqual(0);
                });

                it("should be last item active, when we press PAGE_DOWN key", () => {
                    const event = new KeyboardEvent("keydown", {
                        code: KEYBOARD_CODE.PAGE_DOWN,
                    } as KeyboardEventInit);
                    component.onKeyDown(event);
                    expect(
                        component[
                            "optionKeyControlService"
                        ].getActiveItemIndex()
                    ).toEqual(selectedOptionsMock.length - 1);
                });

                it("should close dropdown, when we press TAB key", () => {
                    const event = new KeyboardEvent("keydown", {
                        code: KEYBOARD_CODE.TAB,
                    } as KeyboardEventInit);
                    component.onKeyDown(event);
                    expect(component["dropdown"].showing).toEqual(false);
                });

                it("should close dropdown, when we press ESCAPE key", () => {
                    const event = new KeyboardEvent("keydown", {
                        code: KEYBOARD_CODE.ESCAPE,
                    } as KeyboardEventInit);
                    component.onKeyDown(event);
                    expect(component["dropdown"].showing).toEqual(false);
                });
            });

            describe("if dropdown is not showing", () => {
                it("should open dropdown, when we press DOWN_ARROW key", () => {
                    const event = new KeyboardEvent("keydown", {
                        code: KEYBOARD_CODE.ARROW_DOWN,
                    } as KeyboardEventInit);
                    component.onKeyDown(event);
                    expect(component["dropdown"].showing).toEqual(true);
                });
            });
        });

        describe("showDropdown >", () => {
            beforeEach(() => {
                fixture.detectChanges();
                component.multiselect = true;
                component.options = new QueryList<SelectV2OptionComponent>();
                component.options.reset([selectedOptionsMock]);
                component.allPopupItems = component.options;
                component.ngAfterViewInit();
            });

            it("should not show dropdown, when select isDisabled", () => {
                component.isDisabled = true;
                component.showDropdown();
                expect(component["dropdown"].showing).toEqual(false);
            });

            it("when select is not disabled, should show dropdown", () => {
                component.isDisabled = false;
                component.showDropdown();
                expect(component["dropdown"].showing).toEqual(true);
            });

            describe("when value is exists >", () => {
                it("should be active this option, when it is not multiselect", () => {
                    component.multiselect = false;
                    component.options.reset([selectedOptionsMock[0]]);
                    component.showDropdown();
                    expect(
                        component[
                            "optionKeyControlService"
                        ].getActiveItemIndex()
                    ).toEqual(0);
                });

                it("should be active first option, when it is multiselect", () => {
                    component.multiselect = true;
                    component.showDropdown();
                    expect(
                        component[
                            "optionKeyControlService"
                        ].getActiveItemIndex()
                    ).toEqual(0);
                });
            });

            it("should scrollToOption", () => {
                const scrollToOptionSpy = spyOn<any>(
                    component,
                    "scrollToOption"
                );
                component.showDropdown();
                expect(scrollToOptionSpy).toHaveBeenCalled();
            });
        });

        describe("toggleDropdown", () => {
            beforeEach(() => {
                fixture.detectChanges();
                component.options = new QueryList<SelectV2OptionComponent>();
                component.options.reset([selectedOptionsMock]);
                component.allPopupItems = component.options;
            });

            it("should not show dropdown, when select isDisabled", () => {
                component.isDisabled = true;
                component.toggleDropdown();
                expect(component["dropdown"].showing).toEqual(false);
            });

            describe("when select not disabled", () => {
                beforeEach(() => {
                    component.isDisabled = false;
                });

                it("should show dropdown", () => {
                    component.toggleDropdown();
                    expect(component["dropdown"].showing).toEqual(true);
                });

                it("should set active item", () => {
                    component.ngAfterViewInit();
                    component.toggleDropdown();
                    expect(
                        component[
                            "optionKeyControlService"
                        ].getActiveItemIndex()
                    ).toEqual(0);
                });

                it("should select the null option if value is null", () => {
                    const nullOption = TestBed.createComponent(
                        SelectV2OptionComponent
                    ).componentInstance;
                    nullOption.value = null;
                    component.options.reset([
                        ...selectedOptionsMock,
                        nullOption,
                        ...selectedOptionsMock,
                    ]);
                    component.value = null;
                    component.ngOnChanges({
                        value: new SimpleChange(null, component.value, true),
                    });
                    component.ngAfterViewInit();
                    component.toggleDropdown();
                    expect(
                        component[
                            "optionKeyControlService"
                        ].getActiveItemIndex()
                    ).toEqual(3);
                });
            });
        });

        describe("removeSelected", () => {
            beforeEach(() => {
                fixture.detectChanges();
                component.options = new QueryList<SelectV2OptionComponent>();
                component.options.reset([selectedOptionsMock]);
                component.allPopupItems = component.options;
                component.ngAfterViewInit();
                component.selectedOptions = [selectedOptionsMock[0]];
                component.showDropdown();
            });

            it("should not change selectedOptions, when it is not multiselect", () => {
                component.multiselect = false;
                component.removeSelected();
                expect(component.selectedOptions).toEqual([
                    selectedOptionsMock[0],
                ]);
            });

            describe("when it is multiselect", () => {
                beforeEach(() => {
                    component.multiselect = true;
                });

                it("should remove option from selectedOptions, when option is exists", () => {
                    component.removeSelected(component.selectedOptions[0]);
                    expect(component.selectedOptions).not.toContain(
                        selectedOptionsMock[0]
                    );
                    expect(component["dropdown"].showing).toEqual(true);
                });

                it("should set selectedOptions to empty array, when option does not exist", () => {
                    component.hideDropdown();
                    component.removeSelected();
                    expect(component.selectedOptions).toEqual([]);
                    expect(component["dropdown"].showing).toEqual(false);
                });
            });
        });

        describe("setDisabledState", () => {
            it("should set isDisabled to false", () => {
                component.setDisabledState(false);
                expect(component.isDisabled).toEqual(false);
            });

            it("should set isDisabled to true", () => {
                component.setDisabledState(true);
                expect(component.isDisabled).toEqual(true);
            });
        });

        it("should set value properly on writeValue method", () => {
            component.options = new QueryList<SelectV2OptionComponent>();
            component.options.reset([selectedOptionsMock]);
            component.writeValue(selectedOptionsMock[0].value);
            expect(component.value).toEqual(selectedOptionsMock[0].value);
        });

        it("should return last selected option value on getLastSelectedOption method", () => {
            component.selectedOptions = [
                selectedOptionsMock[0],
                selectedOptionsMock[1],
            ];
            expect(component.getLastSelectedOption()).toEqual(
                selectedOptionsMock[1]
            );
        });

        describe("ngOnDestroy", () => {
            let destroyNextSpy: jasmine.Spy;
            let destroyCompleteSpy: jasmine.Spy;
            let popupHide: jasmine.Spy;

            beforeEach(() => {
                destroyNextSpy = spyOn<any>(component["destroy$"], "next");
                destroyCompleteSpy = spyOn<any>(
                    component["destroy$"],
                    "complete"
                );
                component.options = new QueryList<SelectV2OptionComponent>();
                component.options.reset([selectedOptionsMock]);
                fixture.detectChanges();
            });

            it("ngOnDestroy", () => {
                component.ngOnDestroy();
                expect(destroyNextSpy).toHaveBeenCalled();
                expect(destroyCompleteSpy).toHaveBeenCalled();
            });

            it("ngOnDestroy if dropdown is shown", () => {
                component["dropdown"].show();
                fixture.detectChanges();

                popupHide = spyOn<any>(component["dropdown"], "hide");

                component.ngOnDestroy();
                expect(popupHide).toHaveBeenCalled();
            });
        });

        describe("string value >", () => {
            beforeEach(() => {
                const selectedOptionsMockStrings = Array.from({
                    length: 3,
                }).map(
                    () =>
                        TestBed.createComponent(SelectV2OptionComponent)
                            .componentInstance
                );
                selectedOptionsMockStrings.forEach(
                    (option, i) => (option.value = `Item ${i}`)
                );

                component.options = new QueryList<SelectV2OptionComponent>();
                component.options.reset([...selectedOptionsMockStrings]);
                component.selectedOptions = [];
            });

            it("should select item with 'value' as a string", () => {
                const itemName = "Item 2";

                component.writeValue(itemName);

                expect(component.selectedOptions[0]).toBeTruthy();
                expect(component.selectedOptions[0].value).toEqual(itemName);
            });
        });

        it("should react to dropdown.clickOutside output", () => {
            fixture.detectChanges();
            component.options = new QueryList<SelectV2OptionComponent>();
            component.options.reset([selectedOptionsMock]);
            component.ngAfterViewInit();
            component.showDropdown();

            let result;
            const mock = <any>{};

            component.clickOutsideDropdown.subscribe((v: any) => (result = v));
            component["dropdown"].clickOutside.emit(mock);

            expect(result).toEqual(mock);
        });

        describe("reactive forms >", () => {
            it("should set value through formControl", () => {
                const itemToSet = wrapperWithFormControlComponent.items[3];
                wrapperWithFormControlComponent.selectControl.setValue(
                    itemToSet
                );

                expect(
                    wrapperWithFormControlComponent.select.getLastSelectedOption()
                        ?.value
                ).toEqual(itemToSet);
            });

            it("should make form control touched on focusout", () => {
                spyOn(
                    wrapperWithFormControlComponent.select,
                    "isOpenOnFocus" as never
                ).and.returnValue(true as never);
                expect(
                    wrapperWithFormControlComponent.selectControl.touched
                ).toBeFalsy();

                wrapperWithFormControlComponent.select.elRef.nativeElement.dispatchEvent(
                    new Event("focusin")
                );
                document.body.click();

                expect(
                    wrapperWithFormControlComponent.selectControl.touched
                ).toBeTruthy();
            });

            it("should not set form control touched if value changed programmatically", () => {
                expect(
                    wrapperWithFormControlComponent.selectControl.touched
                ).toBeFalsy();

                const itemToSet = wrapperWithFormControlComponent.items[3];
                wrapperWithFormControlComponent.selectControl.setValue(
                    itemToSet
                );

                expect(
                    wrapperWithFormControlComponent.selectControl.touched
                ).toBeFalsy();
            });

            it("should set the control to dirty when the value changes in DOM", () => {
                spyOn(
                    wrapperWithFormControlComponent.select,
                    "isOpenOnFocus" as never
                ).and.returnValue(true as never);
                expect(
                    wrapperWithFormControlComponent.selectControl.dirty
                ).toBeFalsy();

                wrapperWithFormControlComponent.select.elRef.nativeElement.dispatchEvent(
                    new Event("focusin")
                );
                const option = wrapperWithFormControlFixture.debugElement.query(
                    By.css("nui-select-v2-option")
                );
                option.nativeElement.click();

                expect(
                    wrapperWithFormControlComponent.selectControl.dirty
                ).toBeTruthy();
            });

            it("should set 'displayText' in case value is set before options", fakeAsync(() => {
                wrapperComponentAsync.selectControl.setValue(3);
                wrapperComponentAsync.setItems();
                wrapperFixtureAsync.detectChanges();

                tick(200); // wrapperComponentAsync.setItems setTimeout
                wrapperFixtureAsync.detectChanges();
                tick(0); // selectV2.optionsChanged delay
                expect(wrapperComponentAsync.select.displayText).toEqual(
                    "Item 3"
                );
            }));

            it("should be empty in case value is set to null", () => {
                wrapperComponentAsync.selectControl.setValue(null);
                wrapperFixtureAsync.detectChanges();

                expect(wrapperComponentAsync.select.isEmpty).toEqual(true);
            });
        });

        describe("options change >", () => {
            it("should keep the same value in case options changed and value is present", fakeAsync(() => {
                const itemToSet = wrapperWithFormControlComponent.items[9];
                wrapperWithFormControlComponent.selectControl.setValue(
                    itemToSet
                );
                expect(
                    wrapperWithFormControlComponent.selectControl.value
                ).toEqual(itemToSet);
                wrapperWithFormControlComponent.items = Array.from({
                    length: 10,
                }).map((_, i) => `Item ${i + 5}`);
                wrapperWithFormControlFixture.detectChanges();
                tick(0);
                expect(
                    wrapperWithFormControlComponent.selectControl.value
                ).toEqual(itemToSet);
            }));

            it("should NOT keep the same value in case options changed and value is NOT present", fakeAsync(() => {
                const itemToSet = wrapperWithFormControlComponent.items[3];
                wrapperWithFormControlComponent.selectControl.setValue(
                    itemToSet
                );
                expect(
                    wrapperWithFormControlComponent.selectControl.value
                ).toEqual(itemToSet);
                wrapperWithFormControlComponent.items = Array.from({
                    length: 10,
                }).map((_, i) => `Item ${i + 5}`);
                wrapperWithFormControlFixture.detectChanges();
                tick(0);
                expect(
                    wrapperWithFormControlComponent.selectControl.value
                ).toEqual(undefined);
            }));
        });

        it("update selected value, if value change in code", fakeAsync(() => {
            const itemToSet = wrapperWithValueComponent.items[9];
            wrapperWithValueComponent.value = itemToSet;
            expect(wrapperWithValueComponent.value).toEqual(itemToSet);
            wrapperWithValueFixture.detectChanges();
            tick(0);
            expect(wrapperWithValueComponent.select.displayText).toEqual(
                itemToSet
            );
        }));
    });
});
