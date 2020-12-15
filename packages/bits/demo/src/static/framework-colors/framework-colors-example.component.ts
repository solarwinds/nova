import { Component } from "@angular/core";
import { ToastService } from "@nova-ui/bits";

/* tslint:disable-next-line */
import * as colors from "../../../../src/styles/data/framework-colors.json";

@Component({
    selector: "framework-colors-example",
    styleUrls: ["./framework-colors-example.component.less"],
    templateUrl: "./framework-colors-example.component.html",
})
export class FrameworkColorsExampleComponent {
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
