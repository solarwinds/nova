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
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    Output,
} from "@angular/core";

import { IDashwizButtonsComponent } from "../types";

@Component({
    selector: "nui-dashwiz-buttons",
    template: `
        <div class="d-flex justify-content-end p-4">
            <button
                nui-button
                class="nui-dashwiz-buttons__cancel-button"
                type="button"
                [disabled]="busy"
                (click)="onCancel()"
            >
                <span i18n>Cancel</span>
            </button>
            <button
                *ngIf="!isFirstStepActive"
                class="ml-3 nui-dashwiz-buttons__back-button"
                nui-button
                icon="caret-left"
                type="button"
                [disabled]="busy"
                (click)="onBack()"
            >
                <span i18n>Back</span>
            </button>
            <button
                *ngIf="!isLastStepActive && canProceed"
                class="ml-3 nui-dashwiz-buttons__next-button"
                nui-button
                type="button"
                [displayStyle]="canFinish ? 'default' : 'primary'"
                [disabled]="busy"
                (click)="onNext()"
            >
                <span>{{ nextText }}</span>
            </button>
            <button
                *ngIf="canFinish || isLastStepActive"
                class="ml-3 nui-dashwiz-buttons__finish-button"
                nui-button
                type="button"
                displayStyle="primary"
                [isBusy]="busy"
                [disabled]="busy"
                (click)="onFinish()"
            >
                <span>{{ finishText }}</span>
            </button>
        </div>
    `,
    standalone: false,
})
export class DashwizButtonsComponent implements IDashwizButtonsComponent {
    static lateLoadKey = "DashwizButtonsComponent";

    constructor(public changeDetector: ChangeDetectorRef) {}

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

    public onCancel(): void {
        this.cancel.emit();
    }

    public onNext(): void {
        this.next.emit();
    }

    public onBack(): void {
        this.back.emit();
    }

    public onFinish(): void {
        this.finish.emit();
    }
}
