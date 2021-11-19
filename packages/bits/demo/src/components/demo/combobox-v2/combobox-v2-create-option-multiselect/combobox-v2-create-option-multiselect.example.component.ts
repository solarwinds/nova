import { ChangeDetectionStrategy, Component, SecurityContext } from "@angular/core";
import { FormControl } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { IChipsItem } from "@nova-ui/bits";

@Component({
    selector: "nui-combobox-v2-create-option-multiselect-example",
    templateUrl: "combobox-v2-create-option-multiselect.example.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ["combobox-v2-create-option-multiselect.example.component.less"],
})
export class ComboboxV2CreateOptionMultiselectExampleComponent {
    public options = Array.from({ length: 3 }).map((_, i) => $localize`Item ${i}`);

    public comboboxControl = new FormControl();

    constructor(private domSanitizer: DomSanitizer) { }

    public createOption(optionName: string): void {
        const sanitizedOption = this.domSanitizer.sanitize(SecurityContext.HTML, optionName)?.trim();
        if (sanitizedOption) {
            this.options.push(sanitizedOption);
            this.comboboxControl.setValue([...(this.comboboxControl.value || []), optionName]);
        }
    }

    public convertToChip(value: string): IChipsItem {
        return ({ label: value });
    }
}
