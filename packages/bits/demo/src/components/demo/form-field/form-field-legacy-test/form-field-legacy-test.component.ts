import { Component } from "@angular/core";

@Component({
    selector: "nui-form-field-legacy-test",
    template: `
        <nui-form-field
            id="nui-form-field-research-legacy-select"
            caption="Maintenance priority"
            hint="Choose Emergency only when service is unavailable."
            i18n-caption
            i18n-hint>
            <nui-select
                [itemsSource]="['Normal', 'Emergency']"
                placeholder="Choose priority"
                i18n-placeholder></nui-select>
        </nui-form-field>

        <nui-form-field
            id="nui-form-field-research-legacy-combobox"
            caption="Recovery site"
            hint="Use a site code from the approved recovery plan."
            i18n-caption
            i18n-hint>
            <nui-combobox
                [itemsSource]="['PRG-01', 'BRN-01']"
                placeholder="Choose site code"
                i18n-placeholder></nui-combobox>
        </nui-form-field>
    `,
    standalone: false,
})
export class FormFieldLegacyTestComponent {}
