import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Subject } from "rxjs";

interface IExampleItem {
    id: string;
    name: string;
}
@Component({
    selector: "nui-combobox-v2-custom-typeahead-example",
    templateUrl: "combobox-v2-custom-typeahead.example.component.html",
    host: { class: "combobox-container" },
})
export class ComboboxV2CustomTypeaheadExampleComponent {
    public items: IExampleItem[] = Array.from({ length: 100 }).map((_, i) => ({
        id: `value-${i}`,
        name: $localize`Item ${i}`,
    }));

    public comboboxControl = new FormControl();

    // Use this in the template with async pipe to dynamically render the filtered items
    public filteredItems$: Subject<any[]> = new Subject<any[]>();

    public onValueChange(value: any): void {
        // Please be aware that there is a known issue (NUI-6131) which results in the
        // entire set of items appearing in the filtering results on input value set and change

        // Once the combobox input changes the new value is emitted.
        // Use this value to filter out the array of items
        value
            ? this.filteredItems$.next(this.filterItems(String(value)))
            : this.filteredItems$.next(this.items.slice());
    }

    public displayFn(item: IExampleItem): string {
        return item?.name || "";
    }

    // For the sake of the example, the filtering is quite simple.
    // It filters out the combobox items depending on the user input.
    private filterItems(value: string): IExampleItem[] {
        const filterValue = value.toLowerCase();

        return this.items.filter((option) =>
            option.name.toLowerCase().includes(filterValue)
        );
    }
}
