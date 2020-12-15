import { Component, TemplateRef, ViewChild } from "@angular/core";
import { DialogService, NuiDialogRef, SelectV2Component } from "@nova-ui/bits";

@Component({
    selector: "nui-dialog-inside-overlay-example",
    templateUrl: "./dialog-inside-overlay.example.component.html",
})
export class DialogInsideOverlayExampleComponent {
    public optionsMultiDimensions = this.getOptions(50, false);
    public items = Array.from({ length: 100 }).map((_, i) => $localize `Item ${i}`);

    private activeDialog: NuiDialogRef;

    @ViewChild("selectMultiDimensions") public selectMultiDimensions: SelectV2Component;

    constructor(private dialogService: DialogService) {}

    public displayFn(item: any): string {
        return item?.name || "";
    }

    /**
     * Watch how the 'useOverlay' option is being passed in here
     */
    public openInOverlay(content: TemplateRef<string>) {
        this.activeDialog = this.dialogService.open(content, {size: "sm", useOverlay: true});
    }

    public actionDone(): void {
        this.activeDialog.close();
    }

    public actionCanceled(): void {
        this.activeDialog.close();
    }

    public onButtonClick(title: string) {
        title === "Action" ? this.actionDone() : this.actionCanceled();
        this.activeDialog.close();
    }

    public toggleList(event: Event): void {
        event.stopPropagation();
        this.selectMultiDimensions.toggleDropdown();
        this.selectMultiDimensions.inputElement.nativeElement.focus();
    }

    // This generates mocked data for the dropdown
    private getOptions(amount: number, isDisabled?: boolean) {
        return Array.from({ length: amount }).map((_, i) =>
                    ({
                        id: `value-${i}`,
                        name: $localize `Item ${i}`,
                        disabled: isDisabled || i % 2 ? true : false,
                    }));
    }
}
