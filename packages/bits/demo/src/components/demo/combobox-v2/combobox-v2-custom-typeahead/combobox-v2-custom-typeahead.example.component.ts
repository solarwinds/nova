import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";

interface IExampleItem {
    id: string;
    name: string;
}
@Component({
    selector: "nui-combobox-v2-custom-typeahead-example",
    templateUrl: "combobox-v2-custom-typeahead.example.component.html",
    host: { class: "combobox-container" },
})
export class ComboboxV2CustomTypeaheadExampleComponent implements OnInit {
    public items: IExampleItem[] = Array.from({ length: 100 }).map((_, i) =>
        ({
            id: `value-${i}`,
            name: $localize `Item ${i}`,
        }));
    public comboboxControl = new FormControl();
    public filteredItems$: Observable<any[]>;

    ngOnInit() {
        this.filteredItems$ = this.comboboxControl.valueChanges.pipe(
            startWith(""),
            map((value) => value?.name || value),
            map((name) =>
                name ? this.filterItems(name) : this.items.slice()
            )
        );
    }

    public displayFn(item: IExampleItem): string {
        return item?.name || "";
    }

    private filterItems(value: string): IExampleItem[] {
        const filterValue = value.toLowerCase();

        return this.items.filter(option => option.name.toLowerCase().includes(filterValue));
    }
}
