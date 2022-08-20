import { Component, OnDestroy } from "@angular/core";

@Component({
    selector: "nui-progress-with-help-template-example",
    templateUrl: "./progress-with-help-template-example.component.html",
})
export class ProgressWithHelpTemplateExampleComponent implements OnDestroy {
    public show = false;
    public percent = 0;
    private intervalId?: NodeJS.Timeout;

    public toggleProgress() {
        this.show = !this.show;

        if (!this.show) {
            this.clearInterval();
            this.percent = 0;
        } else {
            this.intervalId = setInterval(() => {
                if (this.percent < 100) {
                    this.percent += 10;
                } else {
                    this.clearInterval();
                    this.show = false;
                }
            }, 1000);
        }
    }

    public ngOnDestroy() {
        this.clearInterval();
    }

    private clearInterval() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = undefined;
        }
    }
}
