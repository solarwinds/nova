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

import { NuiOverlayModule } from "../../overlay/overlay.module";
import { IOptionValueObject, OptionValueType } from "../../overlay/types";
import { ComboboxV2OptionHighlightDirective } from "../combobox-v2-option-highlight/combobox-v2-option-highlight.directive";
import {
    ANNOUNCER_CLOSE_MESSAGE,
    ANNOUNCER_OPEN_MESSAGE_SUFFIX,
} from "../constants";
import { OptionKeyControlService } from "../option-key-control.service";
import { SelectV2OptionComponent } from "../option/select-v2-option.component";
import { ComboboxV2Component } from "./combobox-v2.component";

const selectedValuesMock: OptionValueType[] = [
    { id: "item-0", name: "Item 0" },
    { id: "item-1", name: "Item 1" },
    { id: "item-2", name: "Item 2" },
];

const nonExistentItem = { id: "item-101", name: "Item 101" };

@Component({
    template: `
        <nui-combobox-v2
            placeholder="Select Item"
            [formControl]="comboboxControl"
            #combobox
        >
            <nui-select-v2-option *ngFor="let item of items" [value]="item">
                <span [nuiComboboxV2OptionHighlight]="item"></span>
            </nui-select-v2-option>
        </nui-combobox-v2>
    `,
})
class ComboboxV2WrapperComponent {
    public items = Array.from({ length: 10 }).map((_, i) => `Item ${i}`);
    public comboboxControl = new FormControl();
    @ViewChild(ComboboxV2Component) combobox: ComboboxV2Component;
    constructor(public elRef: ElementRef<HTMLElement>) {}
}

describe("components >", () => {
    describe("combobox v2 >", () => {
        let component: ComboboxV2Component;
        let fixture: ComponentFixture<ComboboxV2Component>;
        let selectedOptionsMock: SelectV2OptionComponent[];
        let wrapperFixture: ComponentFixture<ComboboxV2WrapperComponent>;
        let wrapperComponent: ComboboxV2WrapperComponent;

        beforeEach(waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [
                    ComboboxV2Component,
                    SelectV2OptionComponent,
                    ComboboxV2OptionHighlightDirective,
                    ComboboxV2WrapperComponent,
                ],
                providers: [
                    ChangeDetectorRef,
                    OptionKeyControlService,
                    LiveAnnouncer,
                ],
                imports: [NuiOverlayModule, ReactiveFormsModule, FormsModule],
                schemas: [NO_ERRORS_SCHEMA],
            }).compileComponents();

            // component
            fixture = TestBed.createComponent(ComboboxV2Component);
            component = fixture.componentInstance;
            fixture.detectChanges();

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

            // wrapper component
            wrapperFixture = TestBed.createComponent(
                ComboboxV2WrapperComponent
            );
            wrapperComponent = wrapperFixture.componentInstance;
            wrapperFixture.detectChanges();
        }));

        it("should create", () => {
            expect(component).toBeTruthy();
        });

        describe("ngAfterContentInit", () => {
            const df = (value: IOptionValueObject) => value.name;

            it("should set correct default input value", fakeAsync(() => {
                component.ngAfterContentInit();
                tick();
                expect(component.inputValue).toEqual("");
            }));

            it("should set correct input value if one's been preselected on init", fakeAsync(() => {
                component.options = new QueryList<SelectV2OptionComponent>();
                component.options.reset([...selectedOptionsMock]);
                component.selectedOptions = [selectedOptionsMock[0]];
                component.displayWith = df;
                component.ngAfterContentInit();
                tick();
                expect(component.inputValue).toEqual(
                    (<IOptionValueObject>selectedOptionsMock[0].value).name
                );
            }));
        });

        describe("selectOption()", () => {
            beforeEach(() => {
                component.options = new QueryList<SelectV2OptionComponent>();
                component.options.reset([...selectedOptionsMock]);
                component.allPopupItems = component.options;
                component.selectedOptions = [];
                component.ngAfterViewInit();
                component["dropdown"].show();
                component.selectOption(selectedOptionsMock[0]);
            });

            it("should add selected items", () => {
                expect(component.selectedOptions.length).toBeGreaterThan(0);
                expect(component.selectedOptions[0]).toEqual(
                    selectedOptionsMock[0]
                );
            });

            it("should not add more than one item in single select mode", () => {
                component.selectOption(selectedOptionsMock[1]);
                expect(component.selectedOptions.length).toBeLessThan(2);
                expect(component.selectedOptions[0]).toEqual(
                    selectedOptionsMock[1]
                );
            });

            it("should selected item get active", () => {
                expect(component.selectedOptions[0].active).toBe(true);
            });

            it("should be able to multiselect", () => {
                component.multiselect = true;
                component.selectOption(selectedOptionsMock[1]);
                expect(component.selectedOptions.length).toEqual(2);
                expect(
                    component.selectedOptions[
                        component.selectedOptions.length - 1
                    ]
                ).toEqual(selectedOptionsMock[1]);
            });
        });

        describe("deselect()", () => {
            beforeEach(() => {
                component.multiselect = false;
                component.options = new QueryList<SelectV2OptionComponent>();
                component.options.reset([...selectedOptionsMock]);
                component.ngAfterViewInit();
                component["dropdown"].show();
                component.selectOption(selectedOptionsMock[0]);
            });

            afterEach(() => {
                component.selectedOptions = [];
                // @ts-ignore: Suppressing error for testing purposes
                component.options = null;
            });

            it("should not affect selected options in singleselect mode", () => {
                component.deselectItem(selectedValuesMock[0]);
                expect(component.selectedOptions.length).toEqual(1);
                expect(component.value).toEqual(selectedValuesMock[0]);
            });

            it("should not filter things out in singleselect", () => {
                component.options.reset([...selectedOptionsMock]);
                component.deselectItem(selectedValuesMock[0]);

                component.options.toArray().forEach((option) => {
                    expect(option.outfiltered).toEqual(false);
                });
            });

            it("should outfilter selected and leave the removed one unfiltered in multiselect", () => {
                component.multiselect = true;
                component.options.reset([...selectedOptionsMock]);
                component.selectedOptions = [...selectedOptionsMock];
                component.deselectItem(selectedValuesMock[0]);

                expect(component.selectedOptions.length).toEqual(2);
                expect(component.options.toArray()[0].outfiltered).toEqual(
                    false
                );
                expect(component.options.toArray()[1].outfiltered).toEqual(
                    true
                );
                expect(component.options.toArray()[2].outfiltered).toEqual(
                    true
                );
                expect(component.selectedOptions[0].outfiltered).toEqual(true);
                expect(component.selectedOptions[1].outfiltered).toEqual(true);
            });

            it("should reduce selected options in multiselect mode", () => {
                component.multiselect = true;
                component.deselectItem(selectedValuesMock[0]);
                expect(component.selectedOptions.length).toEqual(0);
            });

            it("should not reduce selected options in multiselect mode on attempt to remove non-existent item", () => {
                const value = { id: "item-101", name: "Item 101" };
                component.multiselect = true;
                component.deselectItem(value);
                expect(component.selectedOptions.length).toEqual(1);
            });
        });

        describe("writeValue()", () => {
            beforeEach(() => {
                component.multiselect = false;
                component.selectedOptions = [];
                component.options = new QueryList<SelectV2OptionComponent>();
                component.options.reset([...selectedOptionsMock]);
            });

            it("should set correct value in single select mode", () => {
                component.writeValue(selectedValuesMock[0]);
                expect(component.value).toEqual(selectedValuesMock[0]);
                expect(component.selectedOptions[0].value).toEqual(
                    selectedValuesMock[0]
                );
            });

            it("should set correct value in single select mode", () => {
                component.writeValue(nonExistentItem);
                expect(component.selectedOptions).toEqual([]);
            });

            it("should set correct value in multi select mode", () => {
                component.multiselect = true;
                component.writeValue([selectedValuesMock[0]]);

                expect(component.value).toEqual([selectedValuesMock[0]]);
                expect(
                    component.selectedOptions.includes(selectedOptionsMock[0])
                ).toBe(true);
            });

            it("should mark items as filtered in multi select mode", () => {
                component.multiselect = true;
                component.writeValue([selectedValuesMock[0]]);

                expect(component.selectedOptions[0].outfiltered).toBe(true);
            });
        });

        describe("clearValue()", () => {
            beforeEach(() => {
                component.options = new QueryList<SelectV2OptionComponent>();
                component.options.reset([...selectedOptionsMock]);
                component.allPopupItems = component.options;
                component.ngAfterViewInit();
                component["dropdown"].show();
                component.selectOption(selectedOptionsMock[0]);
            });

            it(`should return on falsy isDisabled = true input`, () => {
                component.isDisabled = true;
                component.clearValue();
                expect(component.selectedOptions.length).toEqual(1);
            });

            it(`should clear input if isRemoveValueEnabled = true and isDisabled = false`, () => {
                const valueChangedSpy = spyOn(component.valueChanged, "emit");
                component.isRemoveValueEnabled = true;
                component.isDisabled = false;
                component["dropdown"].show();
                component.clearValue();

                expect(component.selectedOptions.length).toEqual(
                    0,
                    "selected option were NOT cleared!"
                );
                expect(component.inputValue).toEqual("", "Input is NOT empty!");

                component.options.forEach((o) => {
                    expect(o.outfiltered).toBe(
                        false,
                        "Some items in the list are still filtered out!"
                    );
                });

                expect(component.options.toArray()[0].active).toBe(
                    true,
                    "First item of the dropdown list IS NOT active!"
                );
                expect(valueChangedSpy).toHaveBeenCalled();
            });

            it("should not close popover if keepDropdown is on", () => {
                component["dropdown"].show();
                // @ts-ignore: Suppressing error for testing purposes
                component.clearValue(undefined, true);

                expect(component["dropdown"].showing).toBe(true);
            });
        });

        describe("handleInput >", () => {
            beforeEach(() => {
                component.options = new QueryList<SelectV2OptionComponent>();
                component.options.reset([...selectedOptionsMock]);
                component["dropdown"].show();
                component.selectOption(selectedOptionsMock[0]);
                component.multiselect = false;
            });

            it("should handle remove item on backspace", () => {
                component["dropdown"].show();
                expect(component["dropdown"].showing).toBeTruthy();

                component.handleInput("");
                expect(component["dropdown"].showing).toBeFalsy();
                expect(component.value).toEqual("");
                expect(component.selectedOptions).toEqual([]);
            });

            it("should filter items", () => {
                expect(component.options.length).toEqual(3);

                component.handleInput("2");
                fixture.detectChanges();
                const filterdOptions = component.options.filter(
                    (o) => !o.outfiltered
                );
                expect(filterdOptions.length).toEqual(1);
                expect(
                    filterdOptions.find((o) => o.viewValue === "Item 2")
                ).toBeTruthy();
            });

            it("should open dropdown", () => {
                component["dropdown"].hide();
                expect(component["dropdown"].showing).toBeFalsy();

                component.handleInput("1");

                expect(component["dropdown"].showing).toBeTruthy();
            });
        });

        describe("string value", () => {
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
                component.ngAfterViewInit();
                component["dropdown"].show();
            });

            it("should select item with 'value' as a string", () => {
                const itemName = "Item 2";

                component.writeValue(itemName);

                expect(component.selectedOptions[0]).toBeTruthy();
                expect(component.selectedOptions[0].value).toEqual(itemName);
            });
        });

        describe("combobox manualDropdownControl input", () => {
            let hideSpy: any;

            beforeEach(() => {
                hideSpy = spyOn(component, "hideDropdown");
                component.manualDropdownControl = true;
                fixture.detectChanges();
                component.ngAfterViewInit();
            });

            it("should not hide on clearValue() ", () => {
                component.clearValue();
                expect(hideSpy).not.toHaveBeenCalled();
            });
        });

        it("should react to dropdown.clickOutside output", () => {
            fixture.detectChanges();
            component.options = new QueryList<SelectV2OptionComponent>();
            component.options.reset([...selectedOptionsMock]);
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
                const itemToSet = wrapperComponent.items[3];
                wrapperComponent.comboboxControl.setValue(itemToSet);

                expect(
                    wrapperComponent.combobox.getLastSelectedOption()?.value
                ).toEqual(itemToSet);
            });

            it("should make form control touched on focusout", () => {
                expect(wrapperComponent.comboboxControl.touched).toBeFalsy();

                const input = wrapperFixture.debugElement.query(
                    By.css(".nui-combobox-v2__input")
                );
                input.nativeElement.focus();
                document.body.click();

                expect(wrapperComponent.comboboxControl.touched).toBeTruthy();
            });

            it("should not set form control touched if value changed programmatically", () => {
                expect(wrapperComponent.comboboxControl.touched).toBeFalsy();

                const itemToSet = wrapperComponent.items[3];
                wrapperComponent.comboboxControl.setValue(itemToSet);

                expect(wrapperComponent.comboboxControl.touched).toBeFalsy();
            });

            it("should set the control to dirty when the value changes in DOM", () => {
                expect(wrapperComponent.comboboxControl.dirty).toBeFalsy();

                const input = wrapperFixture.debugElement.query(
                    By.css(".nui-combobox-v2__input")
                );
                input.nativeElement.focus();
                const option = wrapperFixture.debugElement.query(
                    By.css("nui-select-v2-option")
                );
                option.nativeElement.click();

                expect(wrapperComponent.comboboxControl.dirty).toBeTruthy();
            });

            it("should make item 'active' after setting it programmatically", () => {
                const itemToSet = wrapperComponent.items[3];
                wrapperComponent.comboboxControl.setValue(itemToSet);

                expect(
                    wrapperComponent.combobox.getLastSelectedOption()?.active
                ).toBeTruthy();
            });

            it("should items be correctly outfiltered if value sets using formControl", () => {
                expect(
                    wrapperComponent.combobox.options.toArray()[3].outfiltered
                ).toBe(false);
                expect(
                    wrapperComponent.combobox.options.toArray()[4].outfiltered
                ).toBe(false);

                wrapperComponent.combobox.multiselect = true;
                const itemsToSet = [
                    wrapperComponent.items[3],
                    wrapperComponent.items[4],
                ];
                wrapperComponent.comboboxControl.setValue(itemsToSet);

                expect(
                    wrapperComponent.combobox.options.toArray()[3].outfiltered
                ).toBe(true);
                expect(
                    wrapperComponent.combobox.options.toArray()[4].outfiltered
                ).toBe(true);
            });
        });

        describe("options change >", () => {
            it("should keep the same value in case options changed and value is present", fakeAsync(() => {
                const itemToSet = wrapperComponent.items[9];
                wrapperComponent.comboboxControl.setValue(itemToSet);
                expect(wrapperComponent.comboboxControl.value).toEqual(
                    itemToSet
                );
                wrapperComponent.items = Array.from({ length: 10 }).map(
                    (_, i) => `Item ${i + 5}`
                );
                wrapperFixture.detectChanges();
                tick(0);
                expect(wrapperComponent.comboboxControl.value).toEqual(
                    itemToSet
                );
            }));

            it("should NOT keep the same value in case options changed and value is NOT present, but should keep inputValue", fakeAsync(() => {
                const itemToSet = wrapperComponent.items[3];
                wrapperComponent.comboboxControl.setValue(itemToSet);
                expect(wrapperComponent.comboboxControl.value).toEqual(
                    itemToSet
                );
                wrapperComponent.items = Array.from({ length: 10 }).map(
                    (_, i) => `Item ${i + 5}`
                );
                wrapperFixture.detectChanges();
                tick(0);
                expect(wrapperComponent.comboboxControl.value).toEqual(
                    undefined
                );
                expect(wrapperComponent.combobox.inputValue).toEqual(itemToSet);
            }));

            it("should filter selected options in case of multiselect", fakeAsync(() => {
                wrapperComponent.combobox.multiselect = true;
                wrapperComponent.comboboxControl.setValue([
                    "Item 3",
                    "Item 5",
                    "Item 9",
                ]);
                expect(wrapperComponent.comboboxControl.value).toEqual([
                    "Item 3",
                    "Item 5",
                    "Item 9",
                ]);
                wrapperComponent.items = Array.from({ length: 10 }).map(
                    (_, i) => `Item ${i + 6}`
                );
                wrapperFixture.detectChanges();
                tick(0);
                expect(wrapperComponent.comboboxControl.value).toEqual([
                    "Item 9",
                ]);
            }));
        });

        describe("LiveAnnouncer >", () => {
            it("should announce dropdown list on focusin", () => {
                const spy = spyOn(
                    wrapperComponent.combobox.liveAnnouncer,
                    "announce"
                );
                expect(wrapperComponent.comboboxControl.touched).toBeFalsy();

                const msg = `${wrapperComponent.combobox.options.length} ${ANNOUNCER_OPEN_MESSAGE_SUFFIX}`;
                const input = wrapperFixture.debugElement.query(
                    By.css(".nui-combobox-v2__input")
                );
                input.nativeElement.focus();

                expect(spy).toHaveBeenCalledWith(msg);
            });

            it("should announce dropdown is closed on focusout", () => {
                const spy = spyOn(
                    wrapperComponent.combobox.liveAnnouncer,
                    "announce"
                );
                expect(wrapperComponent.comboboxControl.touched).toBeFalsy();

                const msg = ANNOUNCER_CLOSE_MESSAGE;
                const input = wrapperFixture.debugElement.query(
                    By.css(".nui-combobox-v2__input")
                );
                input.nativeElement.focus();
                document.body.click();

                expect(spy).toHaveBeenCalledWith(msg);
            });
        });
    });
});
