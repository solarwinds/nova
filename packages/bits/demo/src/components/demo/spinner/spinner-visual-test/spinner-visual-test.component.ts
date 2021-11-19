import { Component } from "@angular/core";

@Component({
    selector: "nui-spinner-visual",
    templateUrl: "./spinner-visual-test.component.html",
})
export class SpinnerVisualTestComponent {
    public show: boolean = true;
    public showWithCancel: boolean = true;
    public isCanceled: boolean = false;
    public spinPercentage: number = 0;

    public onCancel(): void {
        this.showWithCancel = false;
        this.isCanceled = true;
    }

}
