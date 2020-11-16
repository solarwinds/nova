import { Component } from "@angular/core";

@Component({
    selector: "nui-menu-custom-item-example",
    templateUrl: "./menu-custom-item.example.component.html",
    styleUrls: ["./menu-custom-item.example.component.less"],
})
export class MenuCustomItemExampleComponent {
    public checked: boolean = false;
    public doNotClosePopup(event: Event) {
        event.stopPropagation();
    }
    public switchClick(event: Event) {
        this.doNotClosePopup(event);
        this.checked = !this.checked;
        console.log(`Switch is ${this.checked}`);
    }
}
