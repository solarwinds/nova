import { Component, Inject } from "@angular/core";
import { ToastService } from "@solarwinds/nova-bits";

@Component({
    selector: "nui-panel-collapse-outside-control-example",
    templateUrl: "./panel-collapse-outside-control.example.component.html",
})

export class PanelCollapseOutsideControlExampleComponent {
    public isCollapsed: boolean = false;
    public heading = $localize `Header`;

    public collapse() {
        this.isCollapsed = true;
    }

    public expand() {
        this.isCollapsed = false;
    }

    public onCollapseChange($event: boolean) {
        this.isCollapsed = $event;
        this.toastService.info({
            message: this.isCollapsed ? $localize `Collapsed` : $localize `Expanded`,
            title: $localize `Panel State`,
        });
    }

    constructor(@Inject(ToastService) private toastService: ToastService) {
    }

}
