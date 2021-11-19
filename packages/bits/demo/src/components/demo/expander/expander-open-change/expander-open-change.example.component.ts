import { Component } from "@angular/core";


@Component({
    selector: "nui-expander-open-change-example",
    templateUrl: "expander-open-change.example.component.html",
})

export class ExpanderOpenChangeExampleComponent {
    public bindingExampleOpen: boolean = false;

    constructor() { }

    public getButtonLabel(): string {
        return this.bindingExampleOpen ? $localize`Close` : $localize`Open`;
    }

    public onOpenChange(event: boolean): void {
        this.bindingExampleOpen = event;
    }
}
