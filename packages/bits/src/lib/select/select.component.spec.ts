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

import { DebugElement, NO_ERRORS_SCHEMA, SimpleChange } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";

import { SelectComponent } from "./select.component";
import { SelectReactiveFormTestComponent } from "./spec-helpers/spec-components";
import { ButtonComponent } from "../../lib/button/button.component";
import { CheckboxComponent } from "../../lib/checkbox/checkbox.component";
import { IconComponent } from "../../lib/icon/icon.component";
import { IconService } from "../../lib/icon/icon.service";
import { PopoverComponent } from "../../lib/popover/popover.component";
import { RepeatItemComponent } from "../../lib/repeat/repeat-item/repeat-item.component";
import { ValidationMessageComponent } from "../../lib/validation-message/validation-message.component";
import { HighlightPipe } from "../../pipes/highlight.pipe";
import { DomUtilService } from "../../services/dom-util.service";
import { EdgeDetectionService } from "../../services/edge-detection.service";
import { LoggerService } from "../../services/log-service";
import { NotificationService } from "../../services/notification-service";
import { UtilService } from "../../services/util.service";
import { DividerComponent } from "../divider/divider.component";
import { MenuComponent } from "../menu/menu/menu.component";
import { MenuActionComponent } from "../menu/menu-item/menu-action/menu-action.component";
import { MenuGroupComponent } from "../menu/menu-item/menu-group/menu-group.component";
import { MenuItemComponent } from "../menu/menu-item/menu-item/menu-item.component";
import { MenuLinkComponent } from "../menu/menu-item/menu-link/menu-link.component";
import { MenuOptionComponent } from "../menu/menu-item/menu-option/menu-option.component";
import { MenuSwitchComponent } from "../menu/menu-item/menu-switch/menu-switch.component";
import { MenuPopupComponent } from "../menu/menu-popup/menu-popup.component";
import { NuiOverlayModule } from "../overlay/overlay.module";
import { PopupToggleDirective } from "../popup/popup-toggle.directive";
import { PopupComponent } from "../popup-adapter/popup-adapter.component";
import { SpinnerComponent } from "../spinner/spinner.component";
import { SwitchComponent } from "../switch/switch.component";
import { TextboxComponent } from "../textbox/textbox.component";
import { ToastContainerService } from "../toast/toast-container.service";
import { ToastService } from "../toast/toast.service";
import { TooltipDirective } from "../tooltip/tooltip.directive";

describe("components >", () => {
    describe("select >", () => {
        const itemsSource = ["Item 1", "Item 2", "Item 3"];
        const itemsSourceComplex = [
            { name: "Item 4", value: "Bonobo" },
            { name: "Item 5", value: "Zelda" },
            { name: "Item 6", value: "Max" },
        ];

        let fixture: ComponentFixture<SelectComponent>;
        let componentInstance: SelectComponent;
        let debugElement: DebugElement;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [FormsModule, ReactiveFormsModule, NuiOverlayModule, IconComponent],
                declarations: [
                    ButtonComponent,
                    CheckboxComponent,
                    DividerComponent,
                    HighlightPipe,
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
                    SelectComponent,
                    SpinnerComponent,
                    SwitchComponent,
                    TextboxComponent,
                    TooltipDirective,
                    ValidationMessageComponent,
                ],
                providers: [
                    UtilService,
                    EdgeDetectionService,
                    DomUtilService,
                    LoggerService,
                    IconService,
                ],
            });

            fixture = TestBed.createComponent(SelectComponent);
            componentInstance = fixture.componentInstance;
            debugElement = fixture.debugElement;

            componentInstance.itemsSource = itemsSource;
            fixture.detectChanges();
        });

        it("should show placeholder if it's set and value is not selected", () => {
            expect(componentInstance.displayPlaceholder()).toEqual(false);
            componentInstance.placeholder = "select item";
            expect(componentInstance.displayPlaceholder()).toEqual(true);
            componentInstance.ngOnChanges({
                value: new SimpleChange(
                    componentInstance.value,
                    itemsSource[1],
                    false
                ),
            });
            expect(componentInstance.displayPlaceholder()).toEqual(false);
        });

        it("should contain proper number of items", () => {
            componentInstance.menu.popup.toggleOpened(
                new FocusEvent("focusin")
            );
            fixture.detectChanges();
            const listItems = debugElement.queryAll(By.css("nui-menu-action"));
            expect(listItems.length).toEqual(3);
        });

        it("should highlight selected item", () => {
            spyOn(componentInstance, "isItemSelected").and.callThrough();
            componentInstance.value = itemsSource[1];
            componentInstance.menu.popup.toggleOpened(
                new FocusEvent("focusin")
            );
            componentInstance.ngOnInit();
            fixture.detectChanges();
            const selected = debugElement.query(
                By.css(".nui-menu-item.item-selected")
            );
            expect(selected).toBeDefined();
            expect(selected.nativeElement.textContent.trim()).toEqual(
                itemsSource[1]
            );
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
            componentInstance.menu.popup.toggleOpened(
                new FocusEvent("focusin")
            );
            componentInstance.ngOnInit();
            fixture.detectChanges();
            const selected = debugElement.query(
                By.css(".nui-menu-item.item-selected")
            );
            expect(selected).toBeDefined();
            expect(selected.nativeElement.textContent.trim()).toEqual("Zelda");
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

        it("should change title on item select", () => {
            expect(componentInstance.displayedValue()).toEqual("");
            componentInstance.ngOnChanges({
                value: new SimpleChange(itemsSource[1], itemsSource[2], false),
            });
            expect(componentInstance.displayedValue()).toEqual("Item 3");
        });

        it("should has 'nui-select--inline' class if 'inline' attribute is set to 'true'", () => {
            componentInstance.inline = true;
            fixture.detectChanges();
            expect(debugElement.classes["nui-select--inline"]).toEqual(true);
        });

        it("should has 'nui-select--justified' class if 'justified' attribute is set to 'true'", () => {
            componentInstance.justified = true;
            fixture.detectChanges();
            expect(debugElement.classes["nui-select--justified"]).toEqual(true);
        });

        it("should add 'has-error' class if 'isInErrorState' is 'true' and value is not selected", () => {
            componentInstance.isInErrorState = true;
            fixture.detectChanges();
            const button = debugElement.query(By.css(".menu-button.has-error"));
            expect(button).toBeDefined();
        });

        it("should convert display value to string", () => {
            componentInstance.selectedItem = 42;
            expect(componentInstance.displayedValue() as any).toEqual("42");
        });

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
    });

    describe("select with reactive form >", () => {
        let fixture: ComponentFixture<SelectReactiveFormTestComponent>;
        let componentInstance: SelectReactiveFormTestComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [FormsModule, ReactiveFormsModule],
                declarations: [SelectReactiveFormTestComponent],
                providers: [
                    ToastService,
                    ToastContainerService,
                    NotificationService,
                ],
                schemas: [NO_ERRORS_SCHEMA],
            });

            fixture = TestBed.createComponent(SelectReactiveFormTestComponent);
            componentInstance = fixture.componentInstance;
        });

        it("should change selected item on 'changed' event", () => {
            expect(componentInstance.dataset.selectedItem).toEqual("");
            componentInstance.valueChange({ newValue: "Item 1", oldValue: "" });
            expect(componentInstance.dataset.selectedItem).toEqual("Item 1");
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
