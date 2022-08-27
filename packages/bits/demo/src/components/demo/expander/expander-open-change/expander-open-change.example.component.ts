import { Component } from "@angular/core";

@Component({
    selector: "nui-expander-open-change-example",
    templateUrl: "expander-open-change.example.component.html",
})
export class ExpanderOpenChangeExampleComponent {
    public bindingExampleOpen: boolean = false;

    constructor() {}

    public getButtonLabel() {
        return this.bindingExampleOpen ? $localize`Close` : $localize`Open`;
    }

    public onOpenChange(event: boolean) {
        this.bindingExampleOpen = event;
    }
}
