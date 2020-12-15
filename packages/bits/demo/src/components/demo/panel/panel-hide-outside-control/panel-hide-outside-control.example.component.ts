import { ChangeDetectorRef, Component, Inject } from "@angular/core";
import { ToastService } from "@nova-ui/bits";

@Component({
    selector: "nui-panel-hide-outside-control-example",
    templateUrl: "./panel-hide-outside-control.example.component.html",
})

export class PanelHideOutsideControlExampleComponent {
    public isHidden = false;

    public hide() {
        this.isHidden = true;
        this.changeDetectorRef.detectChanges();
    }

    public reveal() {
        this.isHidden = false;
        this.changeDetectorRef.detectChanges();
    }

    public getHideStateChanged($event: boolean) {
        this.isHidden = $event;
        this.toastService.info({
            message: this.isHidden ? $localize `Hidden` : $localize `Revealed`,
            title: $localize `Panel State`,
        });
    }

    constructor(@Inject(ToastService) private toastService: ToastService,
                private changeDetectorRef: ChangeDetectorRef) {
    }
}
