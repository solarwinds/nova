import { Component } from "@angular/core";

@Component({
    selector: "nui-demo-highlight-pipe",
    templateUrl: "./highlight-pipe.example.component.html",
})
export class HighlightPipeExampleComponent {
    term: string = "bar";
    searchString: string = `hello <span class="x">FOO</span> bar`;
    changeSearchValue(value: string): void {
        this.term = value;
    }
}
