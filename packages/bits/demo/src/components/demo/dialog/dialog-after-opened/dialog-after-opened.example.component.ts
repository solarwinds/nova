import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { DialogService, NuiDialogRef, ToastService } from "@nova-ui/bits";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { DialogContentExampleComponent } from "../component-as-content/dialog-content.example.component";

@Component({
    selector: "nui-dialog-after-opened-example",
    templateUrl: "./dialog-after-opened.example.component.html",
})
export class DialogAfterOpenedExampleComponent implements OnInit, OnDestroy {
    constructor(@Inject(DialogService) private dialogService: DialogService,
                @Inject(ToastService) private toastService: ToastService) {
    }

    public destroy$$: Subject<void> = new Subject<void>();

    public ngOnInit() {
        this.dialogService.afterOpened$.pipe(
            takeUntil(this.destroy$$)
        ).subscribe((dialog: NuiDialogRef) => {
            this.toastService.info({ message: `${dialog.componentInstance.constructor.name} was opened` });
        });
    }

    public ngOnDestroy() {
        this.destroy$$.next();
        this.destroy$$.complete();
    }

    public openConfirmationDialog() {
        this.dialogService.confirm({
            message: $localize`Are you sure you want to do it?`,
            severity: "info",
            setFocus: "confirm",
            title: "Confirmation dialog",
        });
    }

    public openWithComponent() {
        const dialogRef = this.dialogService.open(DialogContentExampleComponent, { size: "sm" });
        dialogRef.componentInstance.name = $localize `Dialog title`;
    }
}
