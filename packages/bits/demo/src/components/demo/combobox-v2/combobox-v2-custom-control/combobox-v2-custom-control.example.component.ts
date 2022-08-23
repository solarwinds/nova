import { AfterViewInit, Component, OnDestroy, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Subject } from "rxjs";

import { ComboboxV2Component } from "@nova-ui/bits";

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
export class ComboboxV2CustomControlExampleComponent
    implements OnDestroy, AfterViewInit
{
    public items = Array.from({ length: 100 }).map(
        (_, i) => $localize`Item ${i}`
    );
    public comboboxControl = new FormControl();
    public placeholder: string = $localize`Select Item`;
    public handleClicksOutside: boolean = false;

    @ViewChild("combobox") public combobox: ComboboxV2Component;

    private destroy$: Subject<void> = new Subject();

    public ngAfterViewInit() {
        this.combobox.clickOutsideDropdown.subscribe(() => {
            if (this.handleClicksOutside) {
                this.combobox.hideDropdown();
            }
        });
    }

    public ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public onChipRemoved(item: IExampleItem) {
        this.combobox.deselectItem(item);
    }

    public convertToChip(value: IExampleItem) {
        return { label: value };
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
