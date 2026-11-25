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

import {
    ChangeDetectionStrategy,
    Component,
    forwardRef,
    Input,
} from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { Subject } from "rxjs";

import { NuiFormFieldModule } from "./form-field.module";
import { NuiFormFieldControl } from "./public-api";
import { CheckboxComponent } from "../checkbox/checkbox.component";
import { NuiCheckboxModule } from "../checkbox/checkbox.module";
import { NuiColorPickerModule } from "../color-picker/color-picker.module";
import { NuiDatePickerModule } from "../date-picker/date-picker.module";
import { NuiDateTimePickerModule } from "../date-time-picker/date-time-picker.module";
import { NuiFreetypeQueryModule } from "../freetype-query-builder/freetype-query-builder.module";
import { NuiRadioModule } from "../radio/radio.module";
import { NuiSelectModule } from "../select/select.module";
import { NuiSelectV2Module } from "../select-v2/select-v2.module";
import { NuiSwitchModule } from "../switch/switch.module";
import { NuiTextboxModule } from "../textbox/textbox.module";
import { NuiTimePickerModule } from "../time-picker/time-picker.module";

@Component({
    template: `
        <span id="external-description">External instruction</span>
        <nui-form-field [caption]="caption" [hint]="hint">
            <nui-checkbox ariaDescribedby="external-description">
                Email alerts
            </nui-checkbox>
        </nui-form-field>
        <button data-test="update" (click)="caption = 'Delivery'; hint = ''">
            Update
        </button>
        <button data-test="clear" (click)="caption = ''">Clear caption</button>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
class OnPushFormFieldHostComponent {
    public caption = "Notifications";
    public hint = "Choose how to receive alerts";
}

@Component({
    template: `
        <nui-form-field id="select" [caption]="caption">
            <nui-select [itemsSource]="items" [ariaLabel]="name"></nui-select>
        </nui-form-field>
        <nui-form-field id="combobox" [caption]="caption">
            <nui-combobox [itemsSource]="items" [ariaLabel]="name"></nui-combobox>
        </nui-form-field>
        <nui-form-field id="select-v2" [caption]="caption">
            <nui-select-v2 [ariaLabel]="name"></nui-select-v2>
        </nui-form-field>
        <nui-form-field id="combobox-v2" [caption]="caption">
            <nui-combobox-v2 [ariaLabel]="name"></nui-combobox-v2>
        </nui-form-field>
        <nui-form-field id="radio" [caption]="caption">
            <nui-radio-group [ariaLabel]="name"></nui-radio-group>
        </nui-form-field>
        <nui-form-field id="date" [caption]="caption">
            <nui-date-picker [ariaLabel]="name"></nui-date-picker>
        </nui-form-field>
        <nui-form-field id="time" [caption]="caption">
            <nui-time-picker [ariaLabel]="name" [initEmpty]="true"></nui-time-picker>
        </nui-form-field>
        <nui-form-field id="datetime" [caption]="caption">
            <nui-date-time-picker [ariaLabel]="name" [initEmpty]="true"></nui-date-time-picker>
        </nui-form-field>
        <nui-form-field id="color" [caption]="caption">
            <nui-color-picker [colors]="items" [ariaLabel]="name"></nui-color-picker>
        </nui-form-field>
        <nui-form-field id="query" [caption]="caption">
            <nui-freetype-query-builder [cursorSetter$]="cursorSetter" [ariaLabel]="name"></nui-freetype-query-builder>
        </nui-form-field>
        <button data-test="override" (click)="name = 'Filter details'">Override</button>
        <button data-test="caption" (click)="caption = 'Updated filter'; name = 'Updated filter details'">Update</button>
        <button data-test="clear" (click)="name = ''">Clear</button>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
class FormFieldControlNamesHostComponent {
    public caption = "Filter";
    public name = "";
    public items: string[] = [];
    public cursorSetter = new Subject<number>();
}

@Component({
    selector: "legacy-form-control",
    template: `<input [attr.aria-describedby]="ariaDescribedby" />`,
    providers: [
        {
            provide: NuiFormFieldControl,
            useExisting: forwardRef(() => LegacyFormControlComponent),
        },
    ],
    standalone: false,
})
class LegacyFormControlComponent {
    @Input() public ariaDescribedby: string;
    public ariaLabel: string;
    public id: string;
    public isInErrorState = false;
}

@Component({
    template: `
        <span id="external-description">External instruction</span>
        <span id="other-description">Other instruction</span>
        <nui-form-field id="checkbox-field" caption="Checkbox" [hint]="hint">
            <nui-checkbox *ngIf="showCheckbox" [ariaDescribedby]="description" hint="Checkbox hint">Checkbox</nui-checkbox>
        </nui-form-field>
        <nui-form-field id="checkbox-group-field" caption="Checkbox group" [hint]="hint">
            <nui-checkbox-group [ariaDescribedby]="description"></nui-checkbox-group>
        </nui-form-field>
        <nui-form-field id="switch-field" caption="Switch" [hint]="hint">
            <nui-switch [ariaDescribedby]="description">Switch</nui-switch>
        </nui-form-field>
        <nui-form-field id="textbox-field" caption="Textbox" [hint]="hint">
            <nui-textbox [ariaDescribedby]="description"></nui-textbox>
        </nui-form-field>
        <nui-form-field id="number-field" caption="Number" [hint]="hint">
            <nui-textbox-number [ariaDescribedby]="description"></nui-textbox-number>
        </nui-form-field>
        <nui-form-field id="select-field" caption="Select" [hint]="hint">
            <nui-select [itemsSource]="items" [ariaDescribedby]="description"></nui-select>
        </nui-form-field>
        <nui-form-field id="combobox-field" caption="Combobox" [hint]="hint">
            <nui-combobox [itemsSource]="items" [ariaDescribedby]="description"></nui-combobox>
        </nui-form-field>
        <nui-form-field id="select-v2-field" caption="Select V2" [hint]="hint">
            <nui-select-v2 [ariaDescribedby]="description"></nui-select-v2>
        </nui-form-field>
        <nui-form-field id="combobox-v2-field" caption="Combobox V2" [hint]="hint">
            <nui-combobox-v2 [ariaDescribedby]="description"></nui-combobox-v2>
        </nui-form-field>
        <nui-form-field id="radio-field" caption="Radio" [hint]="hint">
            <nui-radio-group [ariaDescribedby]="description"></nui-radio-group>
        </nui-form-field>
        <nui-form-field id="date-field" caption="Date" [hint]="hint">
            <nui-date-picker [ariaDescribedby]="description"></nui-date-picker>
        </nui-form-field>
        <nui-form-field id="time-field" caption="Time" [hint]="hint">
            <nui-time-picker [ariaDescribedby]="description" [initEmpty]="true"></nui-time-picker>
        </nui-form-field>
        <nui-form-field id="datetime-field" caption="Date and time" [hint]="hint">
            <nui-date-time-picker [ariaDescribedby]="description" [initEmpty]="true"></nui-date-time-picker>
        </nui-form-field>
        <nui-form-field id="color-field" caption="Color" [hint]="hint">
            <nui-color-picker [colors]="items" [ariaDescribedby]="description"></nui-color-picker>
        </nui-form-field>
        <nui-form-field id="query-field" caption="Query" [hint]="hint">
            <nui-freetype-query-builder [cursorSetter$]="cursorSetter" [ariaDescribedby]="description"></nui-freetype-query-builder>
        </nui-form-field>
        <nui-form-field id="legacy-field" caption="Custom" [hint]="hint">
            <legacy-form-control [ariaDescribedby]="description"></legacy-form-control>
        </nui-form-field>
        <button data-test="detect" (click)="detectChanges()">Update</button>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
class FormFieldDescriptionsHostComponent {
    public hint = "Field instruction";
    public description = "external-description";
    public showCheckbox = true;
    public items: string[] = [];
    public cursorSetter = new Subject<number>();

    public detectChanges(): void {}
}

@Component({
    template: `
        <nui-form-field caption="Notifications">
            <nui-checkbox ariaLabel="Notifications">Notifications</nui-checkbox>
        </nui-form-field>
        <nui-form-field caption="Color">
            <nui-color-picker [colors]="colors" ariaLabel="Color"></nui-color-picker>
        </nui-form-field>
        <nui-form-field caption="Method">
            <nui-select-v2 ariaLabel="Method"></nui-select-v2>
        </nui-form-field>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
class OnPushFormFieldIdsHostComponent {
    public colors: string[] = [];
}

@Component({
    template: `
        <nui-form-field caption="Email alerts">
            <nui-checkbox id="alerts">Email alerts</nui-checkbox>
        </nui-form-field>
        <nui-form-field caption="Email">
            <nui-textbox id="email" [rows]="rows"></nui-textbox>
        </nui-form-field>
        <nui-form-field caption="Count">
            <nui-textbox-number id="count"></nui-textbox-number>
        </nui-form-field>
        <nui-form-field caption="Dynamic">
            <nui-textbox [id]="dynamicId" [attr.id]="dynamicId"></nui-textbox>
        </nui-form-field>
        <nui-form-field caption="Dynamic checkbox">
            <nui-checkbox [id]="'bound-id'" [attr.id]="checkboxHostId">
                Dynamic checkbox
            </nui-checkbox>
        </nui-form-field>
    `,
    standalone: false,
})
class FormFieldStaticIdsHostComponent {
    public rows = 1;
    public dynamicId = "dynamic";
    public checkboxHostId = "bound-id";
}

describe("form-field control IDs", () => {
    it("keeps host IDs unique and associates captions with native controls", async () => {
        TestBed.configureTestingModule({
            declarations: [FormFieldStaticIdsHostComponent, CheckboxComponent],
            imports: [NuiFormFieldModule, NuiTextboxModule],
        });
        const fixture = TestBed.createComponent(
            FormFieldStaticIdsHostComponent
        );
        fixture.autoDetectChanges();
        await fixture.whenStable();
        const root = fixture.nativeElement as HTMLElement;

        const assertAssociation = (
            hostId: string
        ): HTMLInputElement | HTMLTextAreaElement => {
            const host = root.querySelector<HTMLElement>(`[id="${hostId}"]`)!;
            const input = host.querySelector<
                HTMLInputElement | HTMLTextAreaElement
            >("input, textarea")!;
            const caption = host
                .closest("nui-form-field")!
                .querySelector<HTMLLabelElement>("label")!;
            expect(input.id).toBeTruthy();
            expect(input.id).not.toBe(hostId);
            expect(root.querySelectorAll(`[id="${hostId}"]`).length).toBe(1);
            expect(root.querySelectorAll(`[id="${input.id}"]`).length).toBe(1);
            expect(caption.control).toBe(input);
            return input;
        };

        assertAssociation("alerts");
        const checkbox = root.querySelector<HTMLInputElement>(
            "#alerts input[type='checkbox']"
        )!;
        assertAssociation("email");
        assertAssociation("count");
        assertAssociation("dynamic");
        assertAssociation("bound-id");
        const caption = root.querySelector<HTMLLabelElement>(
            `nui-form-field label[for="${checkbox.id}"]`
        )!;
        caption.click();
        expect(checkbox.checked).toBeTrue();

        fixture.componentInstance.rows = 2;
        fixture.componentInstance.dynamicId = "changed";
        fixture.componentInstance.checkboxHostId = "other-host-id";
        fixture.detectChanges();
        await fixture.whenStable();
        expect(assertAssociation("email").tagName).toBe("TEXTAREA");
        assertAssociation("changed");
        const dynamicCheckbox =
            root.querySelector<HTMLElement>("#other-host-id")!;
        const dynamicInput = dynamicCheckbox.querySelector("input")!;
        const dynamicCaption = dynamicCheckbox
            .closest("nui-form-field")!
            .querySelector<HTMLLabelElement>("label")!;
        expect(dynamicInput.id).toBe("bound-id");
        expect(dynamicCaption.control).toBe(dynamicInput);

        fixture.componentInstance.checkboxHostId = "bound-id";
        const dynamicTextboxCaption = root
            .querySelector("#changed")!
            .closest("nui-form-field")!
            .querySelector<HTMLLabelElement>("label")!;
        fixture.componentInstance.dynamicId = `${dynamicTextboxCaption.id}-control`;
        fixture.detectChanges();
        await fixture.whenStable();
        assertAssociation("bound-id");
        assertAssociation(fixture.componentInstance.dynamicId);
    });
});

describe("form-field labels in an OnPush host", () => {
    it("renders checkbox and color-picker IDs with explicit caption names", async () => {
        TestBed.configureTestingModule({
            declarations: [OnPushFormFieldIdsHostComponent, CheckboxComponent],
            imports: [
                NuiFormFieldModule,
                NuiColorPickerModule,
                NuiSelectV2Module,
                NoopAnimationsModule,
            ],
        });
        const fixture = TestBed.createComponent(
            OnPushFormFieldIdsHostComponent
        );
        fixture.autoDetectChanges();
        await fixture.whenStable();
        const fields = (fixture.nativeElement as HTMLElement).querySelectorAll(
            "nui-form-field"
        );
        const checkboxInput = fields[0].querySelector<HTMLInputElement>(
            "input[type=checkbox]"
        );
        const checkboxCaption = fields[0].querySelector<HTMLLabelElement>(
            ".nui-form-field__control-label"
        );
        expect(checkboxInput?.id).toBeTruthy();
        expect(checkboxCaption?.control).toBe(checkboxInput);
        expect(
            fields[0]
                .querySelector(".nui-checkbox__input")
                ?.getAttribute("aria-label")
        ).toBe("Notifications");
        const colorControl = fields[1].querySelector<HTMLElement>(
            ".color-picker-input"
        );
        expect(colorControl?.id).toBeTruthy();
        expect(colorControl?.getAttribute("aria-label")).toBe("Color");
        expect(
            fields[2]
                .querySelector("[role=combobox]")
                ?.getAttribute("aria-label")
        ).toBe("Method");
    });
});

describe("form-field control name precedence", () => {
    it("preserves explicit names and restores changed captions across supported controls", async () => {
        TestBed.configureTestingModule({
            declarations: [FormFieldControlNamesHostComponent],
            imports: [
                NuiFormFieldModule,
                NuiColorPickerModule,
                NuiDatePickerModule,
                NuiDateTimePickerModule,
                NuiFreetypeQueryModule,
                NuiRadioModule,
                NuiSelectModule,
                NuiSelectV2Module,
                NuiTimePickerModule,
                NoopAnimationsModule,
            ],
        });
        const fixture = TestBed.createComponent(
            FormFieldControlNamesHostComponent
        );
        fixture.autoDetectChanges();
        await fixture.whenStable();
        const host: HTMLElement = fixture.nativeElement;
        const selectors = [
            "#select button.menu-button",
            "#combobox input",
            "#select-v2 [role=combobox]",
            "#combobox-v2 input",
            "#radio nui-radio-group",
            "#date input",
            "#time input",
            "#color .color-picker-input",
            "#query textarea",
        ];
        const controls = selectors.map(selector => {
            const control = host.querySelector<HTMLElement>(selector);
            expect(control).withContext(selector).not.toBeNull();
            return control;
        });
        const dateTimeInputs =
            host.querySelectorAll<HTMLInputElement>("#datetime input");
        expect(dateTimeInputs.length).toBe(2);

        const expectNames = (name: string) => {
            controls.forEach((control, index) => {
                expect(control?.getAttribute("aria-label"))
                    .withContext(selectors[index])
                    .toBe(name);
            });
            expect(dateTimeInputs[0].getAttribute("aria-label")).toBe(
                `${name} date`
            );
            expect(dateTimeInputs[1].getAttribute("aria-label")).toBe(
                `${name} time`
            );
        };

        expectNames("Filter");
        host.querySelector<HTMLButtonElement>("[data-test=override]")?.click();
        await fixture.whenStable();
        expectNames("Filter details");
        host.querySelector<HTMLButtonElement>("[data-test=caption]")?.click();
        await fixture.whenStable();
        expectNames("Updated filter details");
        host.querySelector<HTMLButtonElement>("[data-test=clear]")?.click();
        await fixture.whenStable();
        expectNames("Updated filter");
    });
});

describe("form-field descriptions", () => {
    it("keeps consumer descriptions separate while field help changes across controls", async () => {
        TestBed.configureTestingModule({
            declarations: [
                FormFieldDescriptionsHostComponent,
                LegacyFormControlComponent,
            ],
            imports: [
                NuiFormFieldModule,
                NuiCheckboxModule,
                NuiSwitchModule,
                NuiTextboxModule,
                NuiColorPickerModule,
                NuiDatePickerModule,
                NuiDateTimePickerModule,
                NuiFreetypeQueryModule,
                NuiRadioModule,
                NuiSelectModule,
                NuiSelectV2Module,
                NuiTimePickerModule,
                NoopAnimationsModule,
            ],
        });
        const fixture = TestBed.createComponent(
            FormFieldDescriptionsHostComponent
        );
        fixture.autoDetectChanges();
        await fixture.whenStable();

        const cases = [
            ["checkbox-field", "nui-checkbox", "input"],
            [
                "checkbox-group-field",
                "nui-checkbox-group",
                "nui-checkbox-group",
            ],
            ["switch-field", "nui-switch", "[role=checkbox]"],
            ["textbox-field", "nui-textbox", "input"],
            ["number-field", "nui-textbox-number", "input"],
            ["select-field", "nui-select", "button.menu-button"],
            ["combobox-field", "nui-combobox", "input"],
            ["select-v2-field", "nui-select-v2", "[role=combobox]"],
            ["combobox-v2-field", "nui-combobox-v2", "input"],
            ["radio-field", "nui-radio-group", "nui-radio-group"],
            ["date-field", "nui-date-picker", "input"],
            ["time-field", "nui-time-picker", "input"],
            ["datetime-field", "nui-date-time-picker", "input"],
            ["color-field", "nui-color-picker", ".color-picker-input"],
            ["query-field", "nui-freetype-query-builder", "textarea"],
        ];
        const root = fixture.nativeElement as HTMLElement;
        const expectDescriptions = (consumer: string, fieldHelp: boolean) => {
            for (const [fieldId, componentSelector, targetSelector] of cases) {
                const field = root.querySelector<HTMLElement>(`#${fieldId}`)!;
                const component = fixture.debugElement.query(
                    By.css(`#${fieldId} ${componentSelector}`)
                ).componentInstance;
                expect(component.ariaDescribedby)
                    .withContext(`${fieldId} input`)
                    .toBe(consumer);
                const helpId = field.querySelector<HTMLElement>(
                    ".nui-form-field__help"
                )!.id;
                const targets =
                    field.querySelectorAll<HTMLElement>(targetSelector);
                expect(targets.length).withContext(fieldId).toBeGreaterThan(0);
                targets.forEach(target => {
                    const ids = (target.getAttribute("aria-describedby") || "")
                        .split(/\s+/)
                        .filter(Boolean);
                    expect(ids.includes("external-description"))
                        .withContext(fieldId)
                        .toBe(consumer.includes("external-description"));
                    expect(ids.includes("other-description"))
                        .withContext(fieldId)
                        .toBe(consumer.includes("other-description"));
                    expect(ids.includes(helpId))
                        .withContext(fieldId)
                        .toBe(fieldHelp);
                    if (fieldHelp) {
                        expect(new Set(ids).size)
                            .withContext(fieldId)
                            .toBe(ids.length);
                    }
                });
            }
        };
        const update = async () => {
            root.querySelector<HTMLButtonElement>(
                "[data-test=detect]"
            )!.click();
            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();
        };

        expectDescriptions("external-description", true);
        fixture.componentInstance.description =
            "other-description external-description other-description";
        await update();
        expectDescriptions(fixture.componentInstance.description, true);
        fixture.componentInstance.hint = "";
        await update();
        expectDescriptions(fixture.componentInstance.description, false);
        const checkboxInput = root.querySelector<HTMLInputElement>(
            "#checkbox-field input"
        )!;
        const checkboxHint = root.querySelector<HTMLElement>(
            "#checkbox-field .nui-help-hint"
        )!;
        expect(checkboxInput.getAttribute("aria-describedby")).toContain(
            checkboxHint.id
        );
        fixture.componentInstance.description = "";
        await update();
        expectDescriptions("", false);
        fixture.componentInstance.hint = "New field instruction";
        await update();
        expectDescriptions("", true);

        const legacy = root.querySelector<HTMLInputElement>(
            "#legacy-field input"
        )!;
        const legacyHelp = root.querySelector<HTMLElement>(
            "#legacy-field .nui-form-field__help"
        )!;
        expect(legacy.getAttribute("aria-describedby")).toBe(legacyHelp.id);
        fixture.componentInstance.description = "external-description";
        await update();
        expect(legacy.getAttribute("aria-describedby")).toBe(
            `external-description ${legacyHelp.id}`
        );
        fixture.componentInstance.hint = "";
        await update();
        expect(legacy.getAttribute("aria-describedby")).toBe(
            "external-description"
        );

        fixture.componentInstance.showCheckbox = false;
        await update();
        fixture.componentInstance.hint = "Restored instruction";
        fixture.componentInstance.showCheckbox = true;
        await update();
        expectDescriptions("external-description", true);

        const textbox = root.querySelector<HTMLInputElement>(
            "#textbox-field input"
        )!;
        const textboxHelpId = root.querySelector<HTMLElement>(
            "#textbox-field .nui-form-field__help"
        )!.id;
        fixture.componentInstance.description = `${textboxHelpId} external-description ${textboxHelpId}`;
        await update();
        expect(textbox.getAttribute("aria-describedby")).toBe(
            `${textboxHelpId} external-description`
        );
        fixture.componentInstance.hint = "";
        await update();
        expect(textbox.getAttribute("aria-describedby")).toBe(
            fixture.componentInstance.description
        );
    });
});

describe("form field with a checkbox in an OnPush host", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CheckboxComponent, OnPushFormFieldHostComponent],
            imports: [NuiFormFieldModule],
        });
    });

    it("keeps the caption and checkbox text associated when the caption changes", async () => {
        const fixture = TestBed.createComponent(OnPushFormFieldHostComponent);
        fixture.autoDetectChanges();
        await fixture.whenStable();

        const host: HTMLElement = fixture.nativeElement;
        const checkbox = host.querySelector<HTMLElement>(
            ".nui-checkbox__input"
        );
        const caption = host.querySelector<HTMLElement>(
            ".nui-form-field__control-label"
        );
        const projectedText = host.querySelector<HTMLElement>(
            ".nui-checkbox__transclude"
        );

        expect(caption?.textContent?.trim()).toBe("Notifications");
        expect(checkbox?.getAttribute("aria-labelledby")).toBe(
            `${caption?.id} ${projectedText?.id}`
        );
        expect(projectedText?.textContent?.trim()).toBe("Email alerts");

        host.querySelector<HTMLButtonElement>("[data-test=update]")?.click();
        await fixture.whenStable();
        expect(caption?.textContent?.trim()).toBe("Delivery");
        expect(checkbox?.getAttribute("aria-labelledby")).toBe(
            `${caption?.id} ${projectedText?.id}`
        );

        host.querySelector<HTMLButtonElement>("[data-test=clear]")?.click();
        await fixture.whenStable();
        expect(host.querySelector(".nui-form-field__control-label")).toBeNull();
        expect(checkbox?.getAttribute("aria-labelledby")).toBe(
            projectedText?.id
        );
    });

    it("removes the field hint without removing a caller description", async () => {
        const fixture = TestBed.createComponent(OnPushFormFieldHostComponent);
        fixture.autoDetectChanges();
        await fixture.whenStable();

        const host: HTMLElement = fixture.nativeElement;
        const checkbox = host.querySelector<HTMLElement>(
            ".nui-checkbox__input"
        );
        const help = host.querySelector<HTMLElement>(".nui-form-field__help");
        expect(help?.textContent).toContain("Choose how to receive alerts");
        expect(checkbox?.getAttribute("aria-describedby")).toBe(
            `external-description ${help?.id}`
        );

        host.querySelector<HTMLButtonElement>("[data-test=update]")?.click();
        await fixture.whenStable();
        expect(checkbox?.getAttribute("aria-describedby")).toBe(
            "external-description"
        );
    });
});
