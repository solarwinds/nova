import { Component } from "@angular/core";

@Component({
    selector: "nui-menu-item-variations-example",
    templateUrl: "./menu-item-variations.example.component.html",
})
export class MenuItemVariationsExampleComponent {
    public onActionDone($event?: undefined | boolean): void {
        console.log("Action Done", $event);
    }
}
