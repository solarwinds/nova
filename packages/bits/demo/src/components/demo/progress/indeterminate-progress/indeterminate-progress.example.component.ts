import { Component, OnDestroy } from "@angular/core";

@Component({
    selector: "nui-indeterminate-progress-example",
    templateUrl: "./indeterminate-progress.example.component.html",
})
export class IndeterminateProgressExampleComponent implements OnDestroy {
    public show = false;
    public isCanceled = false;
    private stop: any = undefined;

    public startProgress(): void {
        this.clearInterval();
        this.show = true;
    }

    public onCancel(): void {
        this.clearInterval();
        this.isCanceled = true;
        this.show = false;
        this.stop = undefined;
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
