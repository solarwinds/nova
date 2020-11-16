import { Component } from "@angular/core";



@Component({
    selector: "nui-menu-append-to-body-example",
    templateUrl: "./menu-append-to-body.example.component.html",
})
export class MenuAppendToBodyExampleComponent {
    public dataset = {
        itemsInGroups: [
            {
                header: $localize `Section 1 title`,
                items: [$localize `Item 1`, $localize `Item 2`, $localize `Item 3`],
            },
            {
                header: $localize `Section 2 title`,
                items: [$localize `Item 4`, $localize `Item 5`, $localize `Item 6`],
            },
        ],
    };
    constructor() { }

    public actionDone(item: string): void {
        console.log(`Action done! Item: ` + item);
    }
}
