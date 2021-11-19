import { Component, Inject } from "@angular/core";
import { ToastService } from "@nova-ui/bits";

@Component({
    selector: "nui-search-on-search-cancel",
    templateUrl: "search-on-search-cancel.example.component.html",
})

export class SearchOnSearchCancelExampleComponent {
    constructor(@Inject(ToastService) public toastService: ToastService) { }

    public onSearch(value: string): void {
        this.toastService.success({ message: `OnSearch triggered. Current value is: ${value}` });
    }
    public onCancel(value: string): void {
        this.toastService.success({ message: `OnCancel triggered. Current value is: ${value}` });
    }
}
