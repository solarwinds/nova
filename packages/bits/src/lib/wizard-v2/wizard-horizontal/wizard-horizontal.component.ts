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

import { Directionality } from "@angular/cdk/bidi";
import { BooleanInput } from "@angular/cdk/coercion";
import { CdkStepper, StepperSelectionEvent } from "@angular/cdk/stepper";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    QueryList,
    ViewChild,
    ViewChildren,
    ViewEncapsulation,
} from "@angular/core";
import last from "lodash/last";
import pull from "lodash/pull";
import without from "lodash/without";
import { takeUntil } from "rxjs/operators";

import { WizardOverflowComponent } from "../wizard-overflow/wizard-overflow.component";
import { WizardStepHeaderComponent } from "../wizard-step-header/wizard-step-header.component";
import { WizardStepV2Component } from "../wizard-step/wizard-step.component";
import { WizardDirective } from "../wizard.directive";

// <example-url>./../examples/index.html#/wizard-v2</example-url>
@Component({
    selector: "nui-wizard-horizontal",
    exportAs: "wizardHorizontal",
    templateUrl: "wizard-horizontal.component.html",
    styleUrls: ["../wizard.component.less"],
    host: {
        class: "nui-wizard-horizontal-layout",
        "[class.nui-wizard-step-header__label-position--end]":
            "labelPosition == 'end'",
        "[class.nui-wizard-step-header__label-position--top]":
            "labelPosition == 'top'",
        "aria-orientation": "horizontal",
        role: "tablist",
    },
    providers: [
        { provide: WizardDirective, useExisting: WizardHorizontalComponent },
        { provide: CdkStepper, useExisting: WizardHorizontalComponent },
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WizardHorizontalComponent
    extends WizardDirective
    implements OnInit, AfterViewInit, OnDestroy
{
    static ngAcceptInputTypeEditable: BooleanInput = undefined;
    static ngAcceptInputTypeOptional: BooleanInput = undefined;
    static ngAcceptInputTypeCompleted: BooleanInput = undefined;
    static ngAcceptInputTypeHasError: BooleanInput = undefined;

    public hasOverflow = false;
    public isInResponsiveMode = false;
    public allHeadersWidth: number = 0;
    public visibleSteps: Array<WizardStepV2Component> = [];
    public overflownStepsStart: Array<WizardStepV2Component> = [];
    public overflownStepsEnd: Array<WizardStepV2Component> = [];

    private headerResizeObserver: ResizeObserver;
    private dynamicSteps: WizardStepV2Component[] = [];
    private stepsCachedArray: WizardStepV2Component[] = [];
    private dynamicStepWidthAdjustment: number = 0;
    private headerPaddings: number = 0;
    private stepHeaderWidth: number = 0;
    private headerContainerWidth: number = 0;
    private overflowComponentWidth: number = 0;

    public get selectedIndex(): number {
        return super.selectedIndex;
    }
    @Input()
    public set selectedIndex(value: number) {
        super.selectedIndex = value;
    }

    /** Whether the label should display in bottom or end position. */
    @Input() labelPosition: "top" | "end" = "top";

    @ViewChild("headerContainer") public headerContainer: ElementRef;
    @ViewChildren("stepHeaders")
    public stepHeaders: QueryList<WizardStepHeaderComponent>;
    @ViewChildren("overflowComponent")
    public overflowComponents: QueryList<WizardOverflowComponent>;

    constructor(
        private dir: Directionality,
        private cdRef: ChangeDetectorRef,
        private el: ElementRef,
        private zone: NgZone
    ) {
        super(dir, cdRef, el);
    }

    public ngOnInit(): void {
        // Checking the validity of previous steps by default.
        this.linear = true;
    }

    public ngAfterViewInit(): void {
        super.ngAfterViewInit();

        this.stepsCachedArray = [...this.stepsArray];

        // Initial checking if there is an overflow and determining some values we'll use in calculations later
        this.checkHeadingsView();
        this.cdRef.detectChanges();

        this.overflowComponentWidth =
            this.overflowComponents?.first?.el?.nativeElement?.getBoundingClientRect()
                ?.width || 0;

        // This handles how headers are processed during the resize process
        this.headerResizeObserver = new ResizeObserver(
            (entry: ResizeObserverEntry[]) => {
                this.zone.run(() => {
                    if (!this.hasOverflow) {
                        this.checkHeadingsView();
                    }
                    this.onContainerResize(entry[0]);
                    this.checkResponsiveMode();
                    this.cdRef.markForCheck();
                });
            }
        );

        // Steps change event is triggered every time we navigate through the steps AND when dynamic steps are being added/removed (or anything else
        // happens in the scope of the current step's view). We only need to rebuild the headers view if there are any changes connected with dynamic steps.
        // Otherwise, we don't do anything. We also have to track whether any of the dynamic steps were added or not on every event run, because we don't
        // know when exactly user will attempt to add a dynamic step. If this happens, we need to also adjust the width of all the header items with respect
        // to the added step to properly track the overflow, as it can happen when the dynamic step is added.
        this.steps.changes.pipe(takeUntil(this._destroyed)).subscribe(() => {
            this.checkDynamicSteps();

            if (this.dynamicSteps.length) {
                this.checkHeadingsView();
            }

            this.dynamicStepWidthAdjustment = this.stepsArray.includes(
                this.dynamicSteps[0]
            )
                ? this.stepHeaderWidth
                : 0;

            // We keep the cached array intact to properly tack when dynamic steps are added. Multiple dynamic steps may be added,
            // but we're only interested in the latest one, because the rest will be hidden under the overflow elements, if there is
            // no room for them among the visible items
            this.stepsCachedArray = [...this.stepsArray];
        });

        this.selectionChange
            .pipe(takeUntil(this._destroyed))
            .subscribe((event: StepperSelectionEvent) => {
                // This describes the navigation between the headers in a visible and hidden areas in the responsive mode.
                if (this.hasOverflow) {
                    if (event.previouslySelectedIndex < event.selectedIndex) {
                        if (this.overflownStepsEnd.length) {
                            const selectedIndex =
                                this.overflownStepsEnd.findIndex(
                                    (item) =>
                                        item ===
                                        (event.selectedStep as WizardStepV2Component)
                                );
                            this.visibleSteps = this.visibleSteps.concat(
                                this.overflownStepsEnd.splice(
                                    0,
                                    selectedIndex + 1
                                )
                            );
                            this.overflownStepsStart =
                                this.overflownStepsStart.concat(
                                    this.visibleSteps.splice(
                                        0,
                                        selectedIndex + 1
                                    )
                                );
                        }
                    } else {
                        if (this.overflownStepsStart.length) {
                            const startPiece = this.overflownStepsStart.splice(
                                event.selectedIndex,
                                this.overflownStepsStart.length -
                                    event.selectedIndex
                            );
                            this.visibleSteps = startPiece.concat(
                                this.visibleSteps
                            );
                            this.overflownStepsEnd.splice(
                                0,
                                0,
                                ...this.visibleSteps.splice(
                                    this.visibleSteps.length -
                                        startPiece.length,
                                    startPiece.length
                                )
                            );
                        }
                    }
                }
            });

        this.headerResizeObserver.observe(this.headerContainer.nativeElement);
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();

        this.headerResizeObserver.disconnect();
    }

    private handleOverflow(): void {
        this.checkOverflow();

        if (this.hasOverflow || this.isInResponsiveMode) {
            const numberOfVisibleItems = this.numberOfVisibleItems;

            if (!this.isInResponsiveMode) {
                if (this.state?.finished) {
                    this.visibleSteps = this.stepsArray.slice(
                        -numberOfVisibleItems
                    );
                    this.overflownStepsStart = this.stepsArray.slice(
                        0,
                        -numberOfVisibleItems
                    );

                    // This covers an edge case with the saved wizard state. It can happen that the active element
                    // appears inside the hidden list of items, when the dynamnic steps are re-added.
                    // We make it visible again by retrieving it back to the visible items array
                    if (this.overflownStepsStart.length) {
                        while (!this.isCurrentStepVisible) {
                            this.takeLastAddFirst(
                                this.overflownStepsStart,
                                this.visibleSteps
                            );
                            this.takeLastAddFirst(
                                this.visibleSteps,
                                this.overflownStepsEnd
                            );
                        }
                    }
                } else {
                    this.visibleSteps = this.stepsArray.slice(
                        0,
                        numberOfVisibleItems
                    );
                    this.overflownStepsEnd =
                        this.stepsArray.slice(numberOfVisibleItems);
                }
            } else {
                this.handleDynamicHeaderChanges(numberOfVisibleItems);
            }
        }

        this.checkResponsiveMode();
    }

    private get isCurrentStepVisible(): boolean {
        return this.visibleSteps.includes(this.stepsArray[this.selectedIndex]);
    }

    private get numberOfVisibleItems(): number {
        return (
            Math.ceil(
                (this.headerContainerWidth - this.headerPaddings * 2) /
                    this.stepHeaderWidth
            ) - 1
        );
    }

    private handleDynamicHeaderChanges(visibleItemsNUmber: number): void {
        const arr: WizardStepV2Component[] = [...this.stepsArray];

        if (this.overflownStepsStart.length) {
            arr.splice(0, this.overflownStepsStart.length);
        }
        this.visibleSteps = arr.slice(0, visibleItemsNUmber);
        this.overflownStepsEnd = arr.slice(visibleItemsNUmber);

        this.checkOverflow();
        if (!this.hasOverflow && this.overflownStepsStart.length) {
            this.visibleSteps.unshift(
                this.overflownStepsStart.splice(
                    this.overflownStepsStart.length - 1,
                    1
                )[0]
            );
        }
    }

    private checkDynamicSteps(): void {
        if (this.stepsArray.length > this.stepsCachedArray.length) {
            this.dynamicSteps = without(
                this.stepsArray,
                ...this.stepsCachedArray
            );
        }

        if (this.stepsArray.length < this.stepsCachedArray.length) {
            this.dynamicSteps = without(
                this.stepsCachedArray,
                ...this.stepsArray
            );

            // If there are no dynamic items left in the main array we need to clean up the visual items array
            if (!this.stepsArray.includes(this.dynamicSteps[0])) {
                pull(this.visibleSteps, ...this.dynamicSteps);
            }
        }

        if (this.stepsArray.length === this.stepsCachedArray.length) {
            this.dynamicSteps = [];
        }
    }

    private checkHeadingsView(): void {
        this.checkHeaderWidth();
        this.checkHeaderPaddings();
        this.getWidthsForCalculations();
        this.handleOverflow();
    }

    private checkHeaderPaddings(): void {
        if (!this.headerPaddings) {
            this.headerPaddings = +getComputedStyle(
                this.headerContainer.nativeElement
            ).paddingLeft.slice(0, -2);
        }
    }

    private checkHeaderWidth(): void {
        if (!this.stepHeaderWidth) {
            this.stepHeaderWidth =
                this.stepHeaders.first?._elementRef?.nativeElement?.getBoundingClientRect()
                    .width || 0;
        }
    }

    private getWidthsForCalculations(): void {
        this.headerContainerWidth =
            this.headerContainer.nativeElement?.getBoundingClientRect().width;
        this.allHeadersWidth = this.stepHeaderWidth * this.steps.length;
    }

    private checkOverflow(): void {
        this.hasOverflow = this.allHeadersWidth > this.headerContainerWidth;
    }

    private checkResponsiveMode(): void {
        this.isInResponsiveMode =
            !!this.overflownStepsStart.length ||
            !!this.overflownStepsEnd.length;
    }

    private takeLastAddFirst(source: Array<any>, target: Array<any>): void {
        target.unshift(source.splice(-1, 1)[0]);
    }

    private takeFirstAddLast(source: Array<any>, target: Array<any>): void {
        target.push(source.splice(0, 1)[0]);
    }

    private onContainerResize(entry: ResizeObserverEntry): void {
        this.checkOverflow();

        const newWidth = entry.contentRect.width;
        const visibleStepsWidth =
            this.visibleSteps.length * this.stepHeaderWidth;

        if (
            newWidth <
            visibleStepsWidth +
                this.overflowComponentWidth * 2 +
                this.dynamicStepWidthAdjustment
        ) {
            if (this.visibleSteps[0] !== this.stepsArray[this.selectedIndex]) {
                return this.takeFirstAddLast(
                    this.visibleSteps,
                    this.overflownStepsStart
                );
            }

            if (
                last(this.visibleSteps) !== this.stepsArray[this.selectedIndex]
            ) {
                return this.takeLastAddFirst(
                    this.visibleSteps,
                    this.overflownStepsEnd
                );
            }
        }

        if (
            newWidth >
            visibleStepsWidth +
                this.stepHeaderWidth +
                this.overflowComponentWidth * 2 +
                this.dynamicStepWidthAdjustment
        ) {
            if (this.overflownStepsEnd.length) {
                return this.takeFirstAddLast(
                    this.overflownStepsEnd,
                    this.visibleSteps
                );
            }

            if (this.overflownStepsStart.length) {
                return this.takeLastAddFirst(
                    this.overflownStepsStart,
                    this.visibleSteps
                );
            }
        }
    }
}
