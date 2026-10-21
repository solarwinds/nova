import { Component } from "@angular/core";

@Component({
    selector: "nui-form-field-legacy-test",
    template: `
        <nui-form-field
            id="nui-form-field-research-legacy-select"
            caption="Maintenance priority"
            [hint]="priorityHint"
            i18n-caption>
            <nui-select
                [itemsSource]="['Normal', 'Emergency']"
                placeholder="Choose priority"
                i18n-placeholder></nui-select>
        </nui-form-field>

        <nui-form-field
            id="nui-form-field-research-legacy-combobox"
            caption="Recovery site"
            [hint]="recoveryHint"
            i18n-caption>
            <nui-combobox
                [itemsSource]="['PRG-01', 'BRN-01']"
                placeholder="Choose site code"
                i18n-placeholder></nui-combobox>
        </nui-form-field>
            <button
                nui-button
                type="button"
                (click)="priorityHint = ''; recoveryHint = ''"
                i18n>
                Clear legacy field hints
            </button>
    `,
    standalone: false,
})
export class FormFieldLegacyTestComponent {
    public priorityHint = $localize`Choose Emergency only when service is unavailable.`;
    public recoveryHint = $localize`Use a site code from the approved recovery plan.`;
}
