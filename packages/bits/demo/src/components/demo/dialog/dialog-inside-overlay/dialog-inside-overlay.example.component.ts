import { Component, TemplateRef } from "@angular/core";
import { DialogService, NuiDialogRef } from "@nova-ui/bits";

@Component({
    selector: "nui-dialog-inside-overlay-example",
    templateUrl: "./dialog-inside-overlay.example.component.html",
})
export class DialogInsideOverlayExampleComponent {
    public options1 = Array.from({ length: 25 }).map(
        (_, i) => $localize`Item ${i}`
    );
    public options2 = Array.from({ length: 25 }).map(
        (_, i) => $localize`Item ${i}`
    );

    private activeDialog: NuiDialogRef;

    constructor(private dialogService: DialogService) {}

    /**
     * Notice that the 'useOverlay' option is being passed in here
     */
    public openInOverlay(content: TemplateRef<string>) {
        this.activeDialog = this.dialogService.open(content, {
            size: "sm",
            useOverlay: true,
        });
    }

    public onDone(): void {
        this.activeDialog.close();
    }

    public onCancel(): void {
        this.activeDialog.close();
    }
}
