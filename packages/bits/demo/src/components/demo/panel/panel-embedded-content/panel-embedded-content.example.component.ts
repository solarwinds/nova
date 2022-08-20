import { Component, Inject } from "@angular/core";
import { ToastService } from "@nova-ui/bits";

@Component({
    selector: "nui-panel-embedded-content-example",
    templateUrl: "./panel-embedded-content.example.component.html",
})
export class PanelEmbeddedContentExampleComponent {
    public isCollapsed = false;
    public headerIcon = "filter";
    public displayFooter = true;

    constructor(@Inject(ToastService) private toastService: ToastService) {}

    onClickCancel() {
        this.toastService.info({
            message: $localize`Cancel clicked!`,
            title: $localize`Action`,
        });
    }

    onClickConfirm() {
        this.toastService.success({
            message: $localize`Confirm clicked!`,
            title: $localize`Action`,
        });
    }

    public toggleFooter() {
        this.displayFooter = !this.displayFooter;
    }
}
