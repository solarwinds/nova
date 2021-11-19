import { Component } from "@angular/core";

@Component({
    selector: "nui-progress-visual-test",
    templateUrl: "./progress-visual-test.component.html",
})
export class ProgressVisualTestComponent {
    public show = false;
    public percent = 50;
    public isCanceled = false;

    public startProgress(): void {
        this.show = true;
    }

    public onCancel(): void {
        this.isCanceled = true;
        this.show = false;
        this.percent = 0;
    }
}
