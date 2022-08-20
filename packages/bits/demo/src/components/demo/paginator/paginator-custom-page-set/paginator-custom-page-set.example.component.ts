import { Component } from "@angular/core";

@Component({
    selector: "nui-paginator-custom-page-set-example",
    templateUrl: "./paginator-custom-page-set.example.component.html",
})
export class PaginatorCustomPageSetExampleComponent {
    public customPageSizeSet = [5, 15, 30, 150, 200];
}
