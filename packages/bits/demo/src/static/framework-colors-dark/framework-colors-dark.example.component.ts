import { Component } from "@angular/core";
import { ToastService } from "@nova-ui/bits";

/* tslint:disable-next-line */
import * as colors from "../../../../src/styles/data/framework-colors-dark.json";

@Component({
    selector: "framework-colors-dark.example",
    styleUrls: ["./framework-colors-dark.example.component.less"],
    templateUrl: "./framework-colors-dark.example.component.html",
})
export class FrameworkColorsDarkExampleComponent {
    public colors = colors;
    constructor(private toastService: ToastService) {}

    public onClipboardSuccess() {
        this.toastService.success({
            message: $localize `Color successfully copied to clipboard`,
        });
    }

    public keyValueCompare(a: any, b: any) {
        return parseInt(a.key, 10) - parseInt(b.key, 10);
    }
}
