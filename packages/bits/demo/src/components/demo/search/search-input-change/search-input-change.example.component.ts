import { Component } from "@angular/core";

@Component({
    selector: "nui-search-input-change-example",
    templateUrl: "search-input-change.example.component.html",
})
export class SearchInputChangeExampleComponent {
    public value: string = "example value";

    public onInputChange(value: string) {
        this.value = value;
    }
}
