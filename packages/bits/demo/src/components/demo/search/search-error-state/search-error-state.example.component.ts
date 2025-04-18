import { Component } from "@angular/core";
import { NuiSearchModule } from "../../../../../../src/lib/search/search.module";

@Component({
    selector: "nui-search-error-state-example",
    templateUrl: "./search-error-state.example.component.html",
    imports: [NuiSearchModule]
})
export class SearchErrorStateExampleComponent {
    public isInErrorState = true;
}
