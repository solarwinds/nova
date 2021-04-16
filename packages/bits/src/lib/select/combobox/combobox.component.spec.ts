import { DebugElement, NO_ERRORS_SCHEMA, SimpleChange } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";

import { ButtonComponent } from "../../../lib/button/button.component";
import { CheckboxComponent } from "../../../lib/checkbox/checkbox.component";
import { IconComponent } from "../../../lib/icon/icon.component";
import { IconService } from "../../../lib/icon/icon.service";
import { PopupToggleDirective } from "../../../lib/popup/popup-toggle.directive";
import { ValidationMessageComponent } from "../../../lib/validation-message/validation-message.component";
import { HighlightPipe } from "../../../pipes/highlight.pipe";
import { DomUtilService } from "../../../services/dom-util.service";
import { EdgeDetectionService } from "../../../services/edge-detection.service";
import { LoggerService } from "../../../services/log-service";
import { NotificationService } from "../../../services/notification-service";
import { UtilService } from "../../../services/util.service";
import { DividerComponent } from "../../divider/divider.component";
import { MenuActionComponent } from "../../menu/menu-item/menu-action/menu-action.component";
import { MenuGroupComponent } from "../../menu/menu-item/menu-group/menu-group.component";
import { MenuItemComponent } from "../../menu/menu-item/menu-item/menu-item.component";
import { MenuLinkComponent } from "../../menu/menu-item/menu-link/menu-link.component";
import { MenuOptionComponent } from "../../menu/menu-item/menu-option/menu-option.component";
import { MenuSwitchComponent } from "../../menu/menu-item/menu-switch/menu-switch.component";
import { MenuPopupComponent } from "../../menu/menu-popup/menu-popup.component";
import { MenuComponent } from "../../menu/menu/menu.component";
import { PopoverComponent } from "../../popover/popover.component";
import { PopupComponent } from "../../popup-adapter/popup-adapter.component";
import { PopupAdapterModule } from "../../popup-adapter/popup-adapter.module";
import { RepeatItemComponent } from "../../repeat/repeat-item/repeat-item.component";
import { SpinnerComponent } from "../../spinner/spinner.component";
import { SwitchComponent } from "../../switch/switch.component";
import { TextboxComponent } from "../../textbox/textbox.component";
import { ToastContainerService } from "../../toast/toast-container.service";
import { ToastService } from "../../toast/toast.service";
import { TooltipDirective } from "../../tooltip/tooltip.directive";
import { ISelectGroup } from "../public-api";
import { ComboboxReactiveFormTestComponent } from "../spec-helpers/spec-components";

import { ComboboxComponent } from "./combobox.component";

describe("components >", () => {
    describe("combobox >", () => {
        const itemsSource = ["Item 1", "Item 2", "Item 3"];
        const itemsSourceComplex = [
            {name: "Item 4", value: "Bonobo"},
            {name: "Item 5", value: "Zelda"},
            {name: "Item 6", value: "Max"},
        ];
        const itemsSourceComplexGrouped: ISelectGroup[] = [{
            header: "Group",
            items: [
                {name: "Item 4", value: "Bonobo"},
                {name: "Item 5", value: "Zelda"},
                {name: "Item 6", value: "Max"},
            ],
        }];

        let fixture: ComponentFixture<ComboboxComponent>;
        let componentInstance: ComboboxComponent;
        let debugElement: DebugElement;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [
                    FormsModule,
                    ReactiveFormsModule,
                    PopupAdapterModule,
                ],
                declarations: [
                    ButtonComponent,
                    CheckboxComponent,
                    ComboboxComponent,
                    DividerComponent,
                    HighlightPipe,
                    IconComponent,
                    MenuActionComponent,
                    MenuComponent,
                    MenuGroupComponent,
                    MenuItemComponent,
                    MenuLinkComponent,
                    MenuOptionComponent,
                    MenuPopupComponent,
                    MenuSwitchComponent,
                    PopoverComponent,
                    PopupComponent,
                    PopupToggleDirective,
                    RepeatItemComponent,
                    SpinnerComponent,
                    SwitchComponent,
                    TextboxComponent,
                    TooltipDirective,
                    ValidationMessageComponent,
                    ComboboxReactiveFormTestComponent,
                ],
                providers: [
                    UtilService,
                    EdgeDetectionService,
                    DomUtilService,
                    LoggerService,
                    IconService,
                ],
            });

            fixture = TestBed.createComponent(ComboboxComponent);
            componentInstance = fixture.componentInstance;
            debugElement = fixture.debugElement;

            componentInstance.itemsSource = itemsSource;
        });

        it("should show placeholder if it's set and value is not selected", () => {
            expect(componentInstance.displayPlaceholder()).toEqual(false);
            componentInstance.placeholder = "select item";
            expect(componentInstance.displayPlaceholder()).toEqual(true);
            componentInstance.onInputChange(itemsSource[1]);
            expect(componentInstance.displayPlaceholder()).toEqual(false);
        });

        it("should contain proper number of items", () => {
            fixture.detectChanges();
            componentInstance.popup.toggleOpened(new FocusEvent("focusin"));
            const listItems = debugElement.queryAll(By.css("nui-menu-action"));
            expect(listItems.length).toEqual(3);
        });

        it("should highlight selected item", () => {
            spyOn(componentInstance, "isItemSelected").and.callThrough();
            componentInstance.value = itemsSource[1];
            fixture.detectChanges();
            componentInstance.popup.toggleOpened(new FocusEvent("focusin"));
            const selected = debugElement.query(By.css(".nui-menu-item.item-selected"));
            expect(selected).toBeDefined();
            expect(selected.nativeElement.innerText.trim()).toEqual(itemsSource[1]);
            expect(componentInstance.isItemSelected).toHaveBeenCalled();
        });

        it("should respect 'disabled' attribute", () => {
            componentInstance.isDisabled = true;
            fixture.detectChanges();
            const button = debugElement.query(By.css(".menu-button[disabled]"));
            expect(button).toBeDefined();
        });

        it("should display some property value of complex object on view", () => {
            componentInstance.itemsSource = itemsSourceComplex;
            componentInstance.displayValue = "value";
            componentInstance.value = itemsSourceComplex[1];
            fixture.detectChanges();
            componentInstance.popup.toggleOpened(new FocusEvent("focusin"));
            const selected = debugElement.query(By.css(".nui-menu-item.item-selected"));
            expect(selected).toBeDefined();
            expect(selected.nativeElement.innerText.trim()).toEqual("Zelda");
        });

        it("should proper item be selected if selected value is string, not an object", () => {
            const toggle = debugElement.query(By.css(".nui-combobox__toggle"));
            componentInstance.itemsSource = itemsSourceComplex;
            componentInstance.displayValue = "name";
            componentInstance.value = itemsSourceComplex[1].name;
            fixture.detectChanges();
            toggle.nativeElement.click();
            expect(debugElement.query(By.css(".nui-menu-item.item-selected"))).not.toBeNull();

            componentInstance.ngOnInit();
            expect(debugElement.query(By.css(".nui-menu-item.item-selected"))).not.toBeNull();
        });

        it("should change selected item on value change event", () => {
            spyOn(componentInstance, "select").and.callThrough();
            spyOn(componentInstance, "changeValue").and.callThrough();
            spyOn(componentInstance, "writeValue").and.callThrough();
            expect(componentInstance.selectedItem).toBeUndefined();
            componentInstance.ngOnChanges({
                value: new SimpleChange(itemsSource[1], itemsSource[2], false),
            });
            expect(componentInstance.select).toHaveBeenCalled();
            expect(componentInstance.changeValue).toHaveBeenCalled();
            expect(componentInstance.writeValue).toHaveBeenCalled();
            expect(componentInstance.selectedItem).toEqual(itemsSource[2]);
        });

        it("should has 'nui-combobox--inline' class if 'inline' attribute is set to 'true'", () => {
            componentInstance.inline = true;
            fixture.detectChanges();
            expect(debugElement.classes["nui-combobox--inline"]).toEqual(true);
        });

        it("should has 'nui-combobox--justified' class if 'justified' attribute is set to 'true'", () => {
            componentInstance.justified = true;
            fixture.detectChanges();
            expect(debugElement.classes["nui-combobox--justified"]).toEqual(true);
        });

        it("should add 'has-error' class if 'isInErrorState' is 'true' and value is not selected", () => {
            componentInstance.isInErrorState = true;
            fixture.detectChanges();
            const button = debugElement.query(By.css(".menu-button.has-error"));
            expect(button).toBeDefined();
        });

        it("should show icon while being editable and if the icon is set", () => {
            componentInstance.icon = "add";
            fixture.detectChanges();
            const icon = debugElement.query(By.css(".nui-combobox__icon"));
            expect(icon).toBeDefined();
        });

        it("should not show icon while being editable and if the icon is not set", () => {
            fixture.detectChanges();
            const icon = debugElement.query(By.css(".nui-combobox__icon"));
            expect(icon).toBeNull();
        });

        it("should not modify text position while not being editable and if the icon is not set", () => {
            fixture.detectChanges();
            const inputIcon = debugElement.query(By.css(".nui-combobox__input"));
            // checking that nui-combobox__input-icon is not applied
            expect(inputIcon.classes["nui-combobox__input-icon"]).toBeUndefined();
        });

        it("should modify text position while being editable and if the icon is set", () => {
            componentInstance.icon = "add";
            fixture.detectChanges();
            const inputIcon = debugElement.query(By.css(".nui-combobox__input"));
            expect(inputIcon.classes["nui-combobox__input-icon"]).toEqual(true);
        });

        it("should change value via input", () => {
            componentInstance.ngOnChanges({
                value: new SimpleChange(itemsSource[1], itemsSource[2], false),
            });
            expect(componentInstance.selectedItem).toEqual(itemsSource[2]);
        });

        it("should not change value via input if value is not in list of available items", () => {
            const invalidValue = "it doesn't work like that";
            componentInstance.ngOnChanges({
                value: new SimpleChange(itemsSource[1], invalidValue, false),
            });
            expect(componentInstance.selectedItem).toBeUndefined();
        });

        it("should clear value and selected item if value is not in list of available items", () => {
            const invalidValue = "it doesn't work like that";
            componentInstance.clearOnBlur = true;
            componentInstance.onInputChange(invalidValue);
            componentInstance.handleBlur();
            expect(componentInstance.inputValue).toEqual("");
            expect(componentInstance.selectedItem).toEqual("");
        });

        it("shouldn't clear value and selected item if value is in list of available items", () => {
            componentInstance.clearOnBlur = true;
            componentInstance.onInputChange(itemsSource[2]);
            componentInstance.handleBlur();
            expect(componentInstance.inputValue).toEqual(itemsSource[2]);
            expect(componentInstance.selectedItem).toEqual(itemsSource[2]);
        });

        it("should return correct value when displayValue is true", () => {
            spyOn(componentInstance, "select").and.callThrough();
            spyOn(componentInstance, "changeValue").and.callThrough();
            spyOn(componentInstance, "writeValue").and.callThrough();
            componentInstance.displayValue = "value";
            componentInstance.select(itemsSourceComplex[2]);
            expect(componentInstance.selectedItem).toEqual(itemsSourceComplex[2]);
        });

        it("should return correct value when displayValue is true and data is grouped", () => {
            componentInstance.itemsSource = itemsSourceComplexGrouped;
            componentInstance.displayValue = "value";
            expect(componentInstance.findObjectByValue("Bonobo")).toEqual(itemsSourceComplexGrouped[0].items[0]);
        });

        it("should return true if data is passed as ISelectGroup[]", () => {
            expect(componentInstance.isGroupedData(itemsSourceComplexGrouped)).toEqual(true);
        });

        it("should not clear value if data is grouped with displayValue and with clearOnBlur", (() => {
            componentInstance.itemsSource = itemsSourceComplexGrouped;
            componentInstance.displayValue = "name";
            componentInstance.onInputChange("Item 5");
            componentInstance.handleBlur();
            expect(componentInstance.selectedItem).toEqual(itemsSourceComplexGrouped[0].items[1]);
            expect(componentInstance.inputValue).toEqual("Item 5");
        }));

        it("should not call changeValue multiple times if value doesn't change", () => {
            spyOn(componentInstance, "select").and.callThrough();
            spyOn(componentInstance, "changeValue").and.callThrough();
            expect(componentInstance.selectedItem).toBeUndefined();
            componentInstance.select(itemsSource[0]);
            componentInstance.handleBlur();
            componentInstance.select(itemsSource[0]);
            componentInstance.handleBlur();
            componentInstance.select(itemsSource[1]);
            componentInstance.handleBlur();
            expect(componentInstance.changeValue).toHaveBeenCalledTimes(2);
            expect(componentInstance.selectedItem).toEqual(itemsSource[1]);
        });

        it("should clear value if isRemoveValueEnabled", () => {
            fixture.detectChanges();
            componentInstance.popup.toggleOpened(new FocusEvent("focusin"));
            componentInstance.select("Item 2");
            componentInstance.isRemoveValueEnabled = true;

            componentInstance.clearValue({ stopPropagation: () => {} } as Event);
            expect(componentInstance.inputValue).toBeNull();
        });

        it("should NOT clear value if isRemoveValueEnabled", () => {
            fixture.detectChanges();
            componentInstance.select("Item 2");
            componentInstance.isRemoveValueEnabled = false;

            componentInstance.clearValue({ stopPropagation: () => {} } as Event);
            expect(componentInstance.inputValue).toEqual("Item 2");
        });

        describe("on blur event", () => {
            beforeEach(() => {
                spyOn(componentInstance, "select").and.callThrough();
                spyOn(componentInstance.changed, "emit").and.callThrough();
                componentInstance.onInputChange(itemsSource[1]);
            });

            it("should emit value on blur only once, if value has changed", (() => {
                expect(componentInstance.select).not.toHaveBeenCalled();
                expect(componentInstance.changed.emit).toHaveBeenCalledTimes(1);
                componentInstance.onInputChange(itemsSource[2]);
                componentInstance.handleBlur();
                expect(componentInstance.select).toHaveBeenCalledTimes(1);
                expect(componentInstance.changed.emit).toHaveBeenCalledTimes(2);
            }));

            it("shouldn't emit value on blur, if value hasn't changed", () => {
                expect(componentInstance.select).not.toHaveBeenCalled();
                expect(componentInstance.changed.emit).toHaveBeenCalledTimes(1);
                componentInstance.handleBlur();
                expect(componentInstance.select).toHaveBeenCalledTimes(1);
                expect(componentInstance.changed.emit).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe("combobox with reactive form >", () => {
        let fixture: ComponentFixture<ComboboxReactiveFormTestComponent>;
        let componentInstance: ComboboxReactiveFormTestComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [
                    FormsModule,
                    ReactiveFormsModule,
                ],
                declarations: [
                    ComboboxReactiveFormTestComponent,
                ],
                providers: [
                    ToastService,
                    ToastContainerService,
                    NotificationService,
                ],
                schemas: [NO_ERRORS_SCHEMA],
            });

            fixture = TestBed.createComponent(ComboboxReactiveFormTestComponent);
            componentInstance = fixture.componentInstance;
        });

        it("should validate form on submit, emit error toast if no value is selected and re-validate form on value selection", () => {
            spyOn(componentInstance.toastService, "error");
            componentInstance.ngOnInit();
            expect(componentInstance.myForm.valid).toEqual(false);
            componentInstance.onSubmit();
            expect(componentInstance.toastService.error).toHaveBeenCalled();
            const item = componentInstance.myForm.controls["item"];
            item.setValue("Item 1");
            expect(componentInstance.myForm.valid).toEqual(true);
        });

        it("should validate form on submit and emit success toast if value is selected", () => {
            spyOn(componentInstance.toastService, "success");
            componentInstance.ngOnInit();
            expect(componentInstance.myForm.valid).toEqual(false);
            const item = componentInstance.myForm.controls["item"];
            item.setValue("Item 1");
            expect(componentInstance.myForm.valid).toEqual(true);
            componentInstance.onSubmit();
            expect(componentInstance.toastService.success).toHaveBeenCalled();
        });
    });
});
