import { Component } from "@angular/core";

@Component({
    selector: "nui-busy-test",
    templateUrl: "./busy-test.component.html",
})
export class BusyTestComponent {
    public busy: boolean;
    public items = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"];

    public switchBusy() {
        this.busy = !this.busy;
    }
}
