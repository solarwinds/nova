import { Component } from "@angular/core";

@Component({
    selector: "nui-busy-progress-example",
    templateUrl: "./busy-progress.example.component.html",
    styleUrls: ["./busy-progress.example.component.less"],
})
export class BusyProgressExampleComponent {
    public busy: boolean;

    public switchBusy() {
        this.busy = !this.busy;
    }
}
