import { Component } from "@angular/core";

@Component({
    selector: "nui-basic-menu-example",
    templateUrl: "./basic-menu.example.component.html",
})
export class BasicMenuExampleComponent {
    public items = ["Item 1", "Item 2", "Item 3"];

    public actionDone(item: string): void {
        console.log(`You've selected ${item}`);
    }
}
