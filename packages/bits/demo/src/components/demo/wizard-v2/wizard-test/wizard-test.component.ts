// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import {
    FlexibleConnectedPositionStrategy,
    OverlayRef,
} from "@angular/cdk/overlay";
import {
    AfterViewInit,
    Component,
    Inject,
    OnDestroy,
    TemplateRef,
    ViewChild,
} from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import {
    DialogService,
    IWizardState,
    NuiDialogRef,
    OverlayComponent,
    WizardHorizontalComponent,
    WizardStepV2Component,
} from "@nova-ui/bits";

interface IWizardStepData {
    title: string;
    templateRef: TemplateRef<string>;
}

@Component({
    selector: "nui-wizard-test",
    templateUrl: "./wizard-test.component.html",
    styleUrls: ["./wizard-test.less"],
    standalone: false
})
export class WizardV2TestComponent implements AfterViewInit, OnDestroy {
    public onDestroy$ = new Subject<void>();
    public overlayTriggered$ = new Subject<void>();
    public responsiveSteps: Array<any> = Array.from({ length: 20 });

    private overlayRef: OverlayRef;
    public busy: boolean = false;
    public activeDialog: NuiDialogRef;

    constructor(@Inject(DialogService) private dialogService: DialogService) {}

    public vegetables = [
        $localize`Cabbage`,
        $localize`Potato`,
        $localize`Tomato`,
        $localize`Carrot`,
    ];
    public selectedVegetables = [$localize`Potato`, $localize`Tomato`];
    public state: IWizardState;
    public steps: IWizardStepData[] = [];

    @ViewChild("normalStep") normalStep: TemplateRef<string>;

    public ngAfterViewInit(): void {
        this.addStep(this.normalStep);
    }

    public isChecked(vegetable: string): boolean {
        return this.selectedVegetables.indexOf(vegetable) > -1;
    }

    public valuesChanged(values: any[]): void {
        this.selectedVegetables = [...values];
    }

    public openDialog(content: TemplateRef<string>): void {
        this.activeDialog = this.dialogService.open(content, {
            size: "lg",
            windowClass: "active-dialog",
        });
    }

    public closeDialog(): void {
        this.activeDialog.close();
    }

    public toggleBusy(): void {
        this.busy = !this.busy;
        setTimeout(() => {
            this.busy = false;
        }, 3000);
    }

    public openConfirmationOverlay(
        overlay: OverlayComponent,
        wizard: WizardHorizontalComponent
    ): void {
        if (wizard.selectedIndex === 0) {
            this.closeDialog();
            return;
        }

        this.overlayTriggered$.next();
        overlay.toggle();

        this.overlayRef = overlay.getOverlayRef();
        (
            this.overlayRef.getConfig()
                .positionStrategy as FlexibleConnectedPositionStrategy
        ).withPositions([
            {
                originX: "start",
                originY: "top",
                overlayX: "start",
                overlayY: "top",
            },
        ]);
        this.updateOverlayDimensions(overlay);
        this.activeDialog?.closed$
            .pipe(takeUntil(this.overlayTriggered$), takeUntil(this.onDestroy$))
            .subscribe(() => overlay.hide());
    }

    public open(content: TemplateRef<string>): void {
        this.activeDialog = this.dialogService.open(content, {
            size: "lg",
            backdrop: "static",
            useOverlay: true,
        });
    }

    public actionDone(): void {
        this.activeDialog.close();
    }

    public onContainerResize(overlay: OverlayComponent): void {
        this.updateOverlayDimensions(overlay);
    }

    public ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
        this.overlayTriggered$.complete();
    }

    public saveState(state: IWizardState): void {
        this.state = state;
    }

    public completeWizard(step: WizardStepV2Component): void {
        step.completed = true;
        this.activeDialog.close();
    }

    public addStep(templateRef: TemplateRef<string>, title?: string): void {
        this.steps.push({
            title: title ?? `Dynamic Step ${this.steps.length + 1}`,
            templateRef: templateRef,
        });
    }

    public removeStep(index = 1): void {
        this.steps.splice(index, 1);
    }

    private updateOverlayDimensions(overlay: OverlayComponent): void {
        this.overlayRef?.updateSize({
            width: overlay.toggleReference.getBoundingClientRect().width,
            height: overlay.toggleReference.getBoundingClientRect().height,
        });
    }
}
