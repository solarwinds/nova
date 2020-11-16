import { Component } from "@angular/core";
import { ToastService } from "@solarwinds/nova-bits";

@Component({
    selector: "nui-checkbox-link-example",
    templateUrl: "./checkbox-link.example.component.html",
})
export class CheckboxLinkExampleComponent {
    public action() {
        this.toastService.warning({message: $localize `Link clicked!`});
        return false;
    }
    constructor(private toastService: ToastService) {}
}
