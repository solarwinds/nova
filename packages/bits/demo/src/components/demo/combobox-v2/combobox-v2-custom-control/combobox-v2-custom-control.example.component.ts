import { AfterViewInit, Component, OnDestroy, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ComboboxV2Component, IChipsItem } from "@nova-ui/bits";
import { Subject } from "rxjs";

interface IExampleItem {
    id: string;
    name: string;
}
@Component({
    selector: "nui-combobox-v2-custom-control-example",
    templateUrl: "combobox-v2-custom-control.example.component.html",
    styleUrls: ["combobox-v2-custom-control.example.component.less"],
    host: { class: "combobox-container d-flex" },
})
export class ComboboxV2CustomControlExampleComponent implements OnDestroy, AfterViewInit {
    public items = Array.from({ length: 100 }).map((_, i) => $localize`Item ${i}`);
    public comboboxControl = new FormControl();
    public placeholder: string = $localize`Select Item`;
    public handleClicksOutside: boolean = false;

    @ViewChild("combobox") public combobox: ComboboxV2Component;

    private destroy$: Subject<void> = new Subject();

    public ngAfterViewInit(): void {
        this.combobox.clickOutsideDropdown.subscribe(() => {
            if (this.handleClicksOutside) { this.combobox.hideDropdown(); }
        });
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public onChipRemoved(item: IExampleItem): void {
        this.combobox.deselectItem(item);
    }

    public convertToChip(value: IExampleItem): IChipsItem {
        return ({ id: value.id, label: value.name });
    }

    public showList(event: Event): void {
        event.stopPropagation();
        this.combobox.showDropdown();
        this.combobox.inputElement.nativeElement.focus();

    }

    public hideList(event: Event): void {
        event.stopPropagation();
        this.combobox.hideDropdown();
    }

    public toggleList(event: Event): void {
        event.stopPropagation();
        this.combobox.toggleDropdown();
        this.combobox.inputElement.nativeElement.focus();
    }
}
