import { AfterViewInit, Component, ViewChild } from "@angular/core";

import { SelectV2Component } from "@nova-ui/bits";

@Component({
    selector: "nui-select-v2-custom-control-example",
    templateUrl: "select-v2-custom-control.example.component.html",
    host: { class: "select-container d-flex justify-content-between" },
})
export class SelectV2CustomControlExampleComponent implements AfterViewInit {
    public items = Array.from({ length: 100 }).map(
        (_, i) => $localize`Item ${i}`
    );
    public handleClicksOutside: boolean = false;

    @ViewChild(SelectV2Component) private select: SelectV2Component;

    public ngAfterViewInit() {
        this.select.clickOutsideDropdown.subscribe(() => {
            if (this.handleClicksOutside) {
                this.select.hideDropdown();
            }
        });
    }

    public showList(event: Event): void {
        event.stopPropagation();
        this.select.showDropdown();
        this.select.inputElement.nativeElement.focus();
    }

    public hideList(event: Event): void {
        event.stopPropagation();
        this.select.hideDropdown();
    }

    public toggleList(event: Event): void {
        event.stopPropagation();
        this.select.toggleDropdown();
        this.select.inputElement.nativeElement.focus();
    }
}
