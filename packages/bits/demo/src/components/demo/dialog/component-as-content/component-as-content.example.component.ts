import { Component, Inject } from "@angular/core";

import { DialogService } from "@nova-ui/bits";

import { DialogContentExampleComponent } from "./dialog-content.example.component";

@Component({
    selector: "nui-component-as-content-example",
    templateUrl: "./component-as-content.example.component.html",
})
export class ComponentAsContentExampleComponent {
    constructor(@Inject(DialogService) private dialogService: DialogService) {}

    public openWithComponent() {
        const dialogRef = this.dialogService.open(
            DialogContentExampleComponent,
            { size: "sm" }
        );
        dialogRef.componentInstance.name = $localize`Dialog title`;
    }
}
