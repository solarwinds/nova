import { Component, OnDestroy } from "@angular/core";

@Component({
    selector: "nui-spinner-with-delay-toggle-example",
    templateUrl: "./spinner-with-delay-toggle.example.component.html",
})
export class SpinnerWithDelayToggleExampleComponent implements OnDestroy {
    public show = false;
    public spinPercentage = 0;
    public isCanceled = false;

    private interval: any = undefined;

    public toggleSpinners(): void {
        this.show = !this.show;
        this.show ? this.startProgress() : this.onCancel();
    }

    public startProgress(): void {
        this.clearInterval();
        this.interval = setInterval(() => {
            this.spinPercentage < 100 ? this.spinPercentage += 10 : this.onCancel();
        }, 500);
    }

    public onCancel(): void {
        this.clearInterval();
        this.isCanceled = true;
        this.show = false;
        this.spinPercentage = 0;
    }

    public ngOnDestroy(): void {
        this.clearInterval();
    }

    private clearInterval() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = undefined;
        }
    }
}
