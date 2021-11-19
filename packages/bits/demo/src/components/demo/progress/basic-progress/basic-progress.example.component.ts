import { Component, OnDestroy } from "@angular/core";

@Component({
    selector: "nui-basic-progress-example",
    templateUrl: "./basic-progress.example.component.html",
})
export class BasicProgressExampleComponent implements OnDestroy {

    public show = false;
    public percent = 0;
    public isCanceled = false;
    private stop: any = undefined;

    public startProgress(): void {
        this.clearInterval();

        this.show = true;
        this.stop = setInterval(() => {
            if (this.percent < 100) {
                this.percent += 10;
            } else {
                this.onCancel();
            }
        }, 1000);
    }

    private onCancel(): void {
        this.clearInterval();
        this.isCanceled = true;
        this.show = false;
        this.stop = undefined;
        this.percent = 0;
    }

    public ngOnDestroy(): void {
        this.clearInterval();
    }

    private clearInterval(): void {
        if (this.stop) {
            clearInterval(this.stop);
        }
    }
}
