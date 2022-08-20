import { Component } from "@angular/core";
import { CheckboxChangeEvent, ToastService } from "@nova-ui/bits";

@Component({
    selector: "nui-checkbox-output-example",
    templateUrl: "./checkbox-output.example.component.html",
})
export class CheckboxOutputExampleComponent {
    constructor(private toastService: ToastService) {}

    public onValueChanged($event: CheckboxChangeEvent) {
        this.toastService.success({
            message: $localize`Checkbox is checked: ${$event.target.checked}`,
        });
    }
}
