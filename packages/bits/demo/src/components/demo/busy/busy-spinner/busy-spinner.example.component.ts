import { Component } from "@angular/core";

@Component({
    selector: "nui-busy-spinner-example",
    templateUrl: "./busy-spinner.example.component.html",
    styleUrls: ["./busy-spinner.example.component.less"],
})
export class BusySpinnerExampleComponent {
    public busy: boolean;

    public switchBusy() {
        this.busy = !this.busy;
    }
}
