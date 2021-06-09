import { Component } from "@angular/core";

@Component({
    selector: "nui-paginator-test",
    templateUrl: "./paginator-test.component.html",
})
export class PaginatorTestComponent {
    public customPageSizeSet = [2, 10, 25, 50, 100];
}
