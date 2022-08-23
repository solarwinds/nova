import { Component } from "@angular/core";

@Component({
    selector: "nui-busy-basic-example",
    templateUrl: "./busy-basic.example.component.html",
    styleUrls: ["./busy-basic.example.component.less"],
})
export class BusyBasicExampleComponent {
    public busy: boolean;

    public switchBusy() {
        this.busy = !this.busy;
    }
}
