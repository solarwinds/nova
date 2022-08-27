import { Component, Inject, TemplateRef } from "@angular/core";

import { DialogService, NuiDialogRef } from "@nova-ui/bits";

@Component({
    selector: "nui-dialog-visual-test",
    templateUrl: "./dialog-visual-test.component.html",
})
export class DialogVisualTestComponent {
    public severity: string;
    private activeDialog: NuiDialogRef;
    public isResponsiveMode = false;
    public dataset = {
        items: [
            "Item 1",
            "Item 2",
            "Item 3",
            "Item 4",
            "Item 5",
            "Item 6",
            "Item 7",
            "Item 8",
            "Item 9",
            "Item 10",
            "Item 11",
            "Item 12",
            "Item 13",
            "Item 14",
            "Item 15",
            "Item 16",
            "Item 17",
            "Item 18",
            "Item 19",
            "Item 20",
        ],
    };

    constructor(@Inject(DialogService) private dialogService: DialogService) {}

    public open(content: TemplateRef<string>, severity = "") {
        this.severity = severity;
        this.activeDialog = this.dialogService.open(content, { size: "sm" });
    }

    public openSizes(content: TemplateRef<string>, size: any) {
        this.activeDialog = this.dialogService.open(content, { size });
    }

    public openResponsive(content: TemplateRef<string>, options: any) {
        this.isResponsiveMode = options.isResponsiveMode;
        this.activeDialog = this.dialogService.open(content);
    }

    public onButtonClick() {
        this.activeDialog.close();
    }

    public confirmationDefaults() {
        this.dialogService.confirm({
            message: "Should I do it?",
        });
    }

    public confirmationOverrides() {
        this.dialogService.confirm({
            message: "Are you sure you want to do it?",
            title: "Format hard drive",
            confirmText: "Format",
            dismissText: "No!",
            severity: "warning",
        });
    }
}
