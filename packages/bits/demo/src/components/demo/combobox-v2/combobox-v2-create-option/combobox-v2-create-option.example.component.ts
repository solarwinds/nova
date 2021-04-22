import { ChangeDetectionStrategy, Component, SecurityContext, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { ComboboxV2Component } from "@nova-ui/bits";

@Component({
    selector: "nui-combobox-v2-create-option-example",
    templateUrl: "combobox-v2-create-option.example.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComboboxV2CreateOptionExampleComponent {
    public options = Array.from({ length: 3 }).map((_, i) => $localize `Item ${i}`);
    @ViewChild("combobox") public combobox: ComboboxV2Component;

    public comboboxControl = new FormControl();

    constructor(private domSanitizer: DomSanitizer) {}

    public createOption(option: string) {
        const sanitizedOption = this.domSanitizer.sanitize(SecurityContext.HTML, option)?.trim();
        if (sanitizedOption) {
            this.options.push(sanitizedOption);
            this.comboboxControl.setValue(sanitizedOption);
        }
    }
}
