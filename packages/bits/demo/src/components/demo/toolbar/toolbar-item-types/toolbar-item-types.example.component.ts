import { Component } from "@angular/core";

@Component({
    selector: "nui-toolbar-item-types-example",
    templateUrl: "./toolbar-item-types.example.component.html",
})

export class ToolbarItemTypesExampleComponent {
    public actionDone(): void {
        console.log("action");
    }
}
