import { Component } from "@angular/core";

@Component({
    selector: "nui-progress-visual-test",
    templateUrl: "./progress-visual-test.component.html",
})
export class ProgressVisualTestComponent {
    public show = false;
    public percent = 50;
    public isCanceled = false;

    public startProgress() {
        this.show = true;
    }

    public onCancel() {
        this.isCanceled = true;
        this.show = false;
        this.percent = 0;
    }
}
