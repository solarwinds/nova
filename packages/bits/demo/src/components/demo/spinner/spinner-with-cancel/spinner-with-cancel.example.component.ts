import { Component, OnDestroy } from "@angular/core";

@Component({
    selector: "nui-spinner-with-cancel-example",
    templateUrl: "./spinner-with-cancel.example.component.html",
})
export class SpinnerWithCancelExampleComponent implements OnDestroy {
    public show = false;
    public spinPercentage = 0;
    public isCanceled = false;

    private interval: any = undefined;

    public toggleSpinners() {
        this.show = !this.show;
        this.show ? this.startProgress() : this.onCancel();
    }

    public startProgress() {
        this.clearInterval();
        this.interval = setInterval(() => {
            this.spinPercentage < 100
                ? (this.spinPercentage += 10)
                : this.onCancel();
        }, 500);
    }

    public onCancel() {
        this.clearInterval();
        this.isCanceled = true;
        this.show = false;
        this.spinPercentage = 0;
    }

    public ngOnDestroy() {
        this.clearInterval();
    }

    private clearInterval() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = undefined;
        }
    }
}
