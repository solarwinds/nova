import { Component } from "@angular/core";

@Component({
    selector: "nui-progress-test",
    templateUrl: "./progress-test.component.html",
})
export class ProgressTestComponent {
    public show = false;
    public percent = 50;
    public isCanceled = false;

    public startProgress(): void {
        this.show = true;
    }

    public toggleProgress(): void {
        this.show = !this.show;
    }

    public onCancel(): void {
        this.isCanceled = true;
        this.show = false;
        this.percent = 0;
    }
}
