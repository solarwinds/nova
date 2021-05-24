import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from "@angular/core";

import { IDashwizButtonsComponent } from "../types";

@Component({
    selector: "nui-dashwiz-buttons",
    template: `
        <div class="d-flex justify-content-end p-4">
            <button nui-button
                    class="nui-dashwiz-buttons__cancel-button"
                    type="button"
                    [disabled]="busy"
                    (click)="onCancel()">
                <span i18n>Cancel</span>
            </button>
            <button *ngIf="!isFirstStepActive"
                    class="ml-3 nui-dashwiz-buttons__back-button"
                    nui-button
                    icon="caret-left"
                    type="button"
                    [disabled]="busy"
                    (click)="onBack()">
                <span i18n>Back</span>
            </button>
            <button *ngIf="!isLastStepActive && canProceed"
                    class="ml-3 nui-dashwiz-buttons__next-button"
                    nui-button
                    type="button"
                    [displayStyle]="canFinish ? 'default' : 'primary'"
                    [disabled]="busy"
                    (click)="onNext()">
                <span>{{nextText}}</span>
            </button>
            <button *ngIf="canFinish || isLastStepActive"
                    class="ml-3 nui-dashwiz-buttons__finish-button"
                    nui-button
                    type="button"
                    displayStyle="primary"
                    [isBusy]="busy"
                    [disabled]="busy"
                    (click)="onFinish()">
                <span>{{finishText}}</span>
            </button>
        </div>
    `,
})
export class DashwizButtonsComponent implements IDashwizButtonsComponent {
    static lateLoadKey = "DashwizButtonsComponent";

    constructor(public changeDetector: ChangeDetectorRef) { }

    @Input() public busy = false;
    @Input() public canFinish = false;
    @Input() public canProceed = false;
    @Input() public isFirstStepActive = false;
    @Input() public isLastStepActive = false;
    @Input() public nextText: string;
    @Input() public finishText: string;

    @Output() public cancel = new EventEmitter<void>();
    @Output() public next = new EventEmitter<void>();
    @Output() public back = new EventEmitter<void>();
    @Output() public finish = new EventEmitter<void>();

    public onCancel() {
        this.cancel.emit();
    }

    public onNext() {
        this.next.emit();
    }

    public onBack() {
        this.back.emit();
    }

    public onFinish() {
        this.finish.emit();
    }
}
