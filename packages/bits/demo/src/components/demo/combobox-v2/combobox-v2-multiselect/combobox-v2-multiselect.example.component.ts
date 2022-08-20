import { Component, OnDestroy } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Subject } from "rxjs";

@Component({
    selector: "nui-combobox-v2-multiselect-example",
    templateUrl: "combobox-v2-multiselect.example.component.html",
    styleUrls: ["combobox-v2-multiselect.example.component.less"],
    host: { class: "combobox-container" },
})
export class ComboboxV2MultiselectExampleComponent implements OnDestroy {
    public items = Array.from({ length: 100 }).map(
        (_, i) => $localize`Item ${i}`
    );
    public comboboxControl = new FormControl();
    public placeholder: string = $localize`Select Item`;

    private destroy$: Subject<void> = new Subject();

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public convertToChip(value: string) {
        return { label: value };
    }

    public setModel() {
        this.comboboxControl.setValue([
            $localize`Item 10`,
            $localize`Item 12`,
            $localize`Item 14`,
        ]);
    }
}
