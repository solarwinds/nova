import { Component, Inject } from "@angular/core";
import { ToastService } from "@nova-ui/bits";

@Component({
    selector: "nui-search-focus-change-example",
    templateUrl: "./search-focus-change.example.component.html",
})

export class SearchFocusChangeExampleComponent {
    public isFocused: boolean = false;

    constructor(@Inject(ToastService) public toastService: ToastService) {
    }

    public onFocusChange(focused: boolean) {
        this.isFocused = focused;
        this.toastService.success({message: this.isFocused ? "Focused in!" : "Focused out"});
    }

    public setFocus() {
        this.isFocused = true;
        this.toastService.success({message: "Focused in!"});
    }
}
