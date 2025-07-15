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
  AfterContentInit,
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
  ViewEncapsulation,
  output
} from "@angular/core";
import _find from "lodash/find";
import _findIndex from "lodash/findIndex";
import _isUndefined from "lodash/isUndefined";
import { BehaviorSubject } from "rxjs";

import {
    IWizardSelectionEvent,
    IWizardStepComponent,
    IWizardWaitEvent,
} from "./public-api";
import { WizardStepComponent } from "./wizard-step.component";
import { LoggerService } from "../../services/log-service";

// <example-url>./../examples/index.html#/wizard</example-url>

/**
 * Component that provides wizard functionality.
 */
@Component({
    selector: "nui-wizard",
    templateUrl: "./wizard.component.html",
    styleUrls: ["./wizard.component.less"],
    encapsulation: ViewEncapsulation.None,
    standalone: false,
})
export class WizardComponent
    implements OnInit, AfterContentInit, AfterViewChecked, OnDestroy
{
    private static placeholderFinishText = "Action"; // as a placeholder "Action" does not need to be i18n

    @ContentChildren(WizardStepComponent) steps: QueryList<WizardStepComponent>;
    @ViewChildren("stepTitle") stepTitles: QueryList<ElementRef>;
    @ViewChild("container", { read: ViewContainerRef }) dynamicStep: any;

    /**
     * Set to true to show the "Finish" button at any point during the wizard process.
     *(default: false)
     */
    @Input() public canFinish = false;
    /**
     * Set to true to enable overflow in wizard body container.
     */
    @Input() public enableScroll: boolean = false;
    /**
     * Use this to set wizard body container height.
     */
    @Input() public bodyContainerHeight: string;
    /**
     * Overrides the default text on the finish step button.
     *(default: 'Action')
     */
    @Input() public finishText = WizardComponent.placeholderFinishText;
    /**
     * Use this to stretch lines between step labels according to largest label width.
     *(default: false)
     */
    @Input() public stretchStepLines: boolean = false;
    /**
     * Evaluated when a step is selected.
     */
    public readonly selectionChange = output<IWizardSelectionEvent>();
    /**
     * Evaluated when the user attempts to cancel the wizard.
     */
    public readonly cancel = output<boolean>();
    /**
     * Evaluated when the user completes the wizard.
     */
    public readonly finish = output();
    /**
     * Emits when next button is clicked.
     */
    public readonly next = output();
    /**
     * Emits when Back button is clicked.
     */
    public readonly back = output();

    public currentStep?: WizardStepComponent;
    public stepLineWidth: number = 65;
    public navigationControl: BehaviorSubject<IWizardWaitEvent> =
        new BehaviorSubject<IWizardWaitEvent>({
            busyState: { busy: false },
            allowStepChange: true,
        });
    private selectionEvent: IWizardSelectionEvent;
    private stepIndex: number;
    private previousStepIndex = 0;
    private futureStep?: WizardStepComponent;

    private arraySteps: any[];
    private dynamicSubscriptions = new Map();
    private dynamicRefs = new Map();

    constructor(
        private changeDetector: ChangeDetectorRef,
        private viewContainerRef: ViewContainerRef,
        private logger: LoggerService
    ) {}

    public ngOnInit(): void {
        if (this.finishText === WizardComponent.placeholderFinishText) {
            this.logger
                .warn(`WizardComponent input "finishText" is using placeholder text
"${WizardComponent.placeholderFinishText}". A value should be specified.`);
        }
    }

    public ngAfterContentInit(): void {
        const activeTabs = this.steps.filter((item) => item.active);
        this.arraySteps = this.steps.toArray();
        if (activeTabs.length === 0) {
            this.currentStep = this.steps.first;
            this.selectStep(this.currentStep);
            this.changeDetector.detectChanges();
        }
        this.steps.toArray().forEach((step: WizardStepComponent) => {
            step.valid.subscribe((event: any) => {
                if (!_isUndefined(event)) {
                    this.handleStepControl(step);
                }
            });
        });
        this.navigationControl.subscribe((value) => {
            if (this.currentStep) {
                this.currentStep.busyConfig = value.busyState;
            }
            if (
                value.allowStepChange &&
                !_isUndefined(this.futureStep) &&
                this.currentStep !== this.futureStep
            ) {
                this.enterAnotherStep();
                this.futureStep = undefined;
            }
        });
    }

    public ngAfterViewChecked(): void {
        if (this.stretchStepLines) {
            this.stepLineWidth = Math.round(this.getLargestLabelWidth() / 2);
            this.changeDetector.detectChanges();
        }
    }

    public ngOnDestroy(): void {
        this.steps
            .toArray()
            .forEach((step: WizardStepComponent) => step.valid.unsubscribe());
        this.navigationControl.unsubscribe();
    }

    public addStepDynamic(
        wizardStep: IWizardStepComponent,
        indexToInsert: number
    ): IWizardStepComponent {
        const componentRef = this.dynamicStep.createComponent(WizardStepComponent);
        const instance: IWizardStepComponent = componentRef.instance;
        const wizardStepInputs = this.getInputsAndOutputs(wizardStep);

        wizardStepInputs.forEach((key) => {
            instance[key] = wizardStep[key];
        });
        this.handleStepControl(componentRef.instance);

        const subscription = instance.valid?.subscribe((event: any) => {
            if (!_isUndefined(event)) {
                instance.stepControl = wizardStep.stepControl;
                this.handleStepControl(componentRef.instance);
            }
        });

        this.dynamicRefs.set(instance, componentRef);
        this.dynamicSubscriptions.set(instance, subscription);
        this.arraySteps.splice(indexToInsert, 0, componentRef.instance);
        this.steps.reset([]);
        this.steps.reset(this.arraySteps);
        return componentRef.instance;
    }

    public removeStep(index: number): void {
        const steps = this.steps.toArray();

        if (index < 1 || index > steps.length - 1) {
            return;
        }

        const stepToRemove = steps[index];

        if (this.currentStep === stepToRemove) {
            this.onBackClick();
        }

        this.onRemoveDynamic(stepToRemove);
        this.arraySteps.splice(index, 1);
        this.steps.reset([]);
        this.steps.reset(this.arraySteps);
        this.stepIndex = this.steps
            .toArray()
            .findIndex((s) => s === this.currentStep);
    }

    public disableStep(step: WizardStepComponent): void {
        const indexOfStep = this.arraySteps.indexOf(step);
        const toDisable = this.arraySteps[indexOfStep];
        toDisable.disabled = true;
        this.changeDetector.detectChanges();
    }

    public enableStep(step: WizardStepComponent): void {
        const indexOfStep = this.arraySteps.indexOf(step);
        const toDisable = this.arraySteps[indexOfStep];
        toDisable.disabled = false;
        this.changeDetector.detectChanges();
    }

    public hideStep(step: WizardStepComponent): void {
        const indexOfStep = this.arraySteps.indexOf(step);
        const toHide = this.arraySteps[indexOfStep];
        toHide.hidden = true;
    }

    public showStep(step: WizardStepComponent): void {
        const indexOfStep = this.arraySteps.indexOf(step);
        const visibleStep = this.arraySteps[indexOfStep];
        visibleStep.hidden = false;
    }

    public resetStep(step: WizardStepComponent): void {
        let index = this.arraySteps.findIndex((s) => s === step);
        const length = this.arraySteps.length;

        for (index; index < length; index++) {
            const stepToReset = this.arraySteps[index];

            stepToReset.visited = false;
            stepToReset.complete = false;
            stepToReset.icon = "step";
        }

        if (this.currentStep) {
            this.currentStep.complete = false;
        }
    }

    public goToStep(stepIndex: number): void {
        this.selectStep(this.arraySteps[stepIndex]);
    }

    public selectStep(step: WizardStepComponent): void {
        if (!step.disabled) {
            this.futureStep = step;
            this.currentStep?.exitStep({
                selectedIndex: this.arraySteps.indexOf(this.futureStep),
                selectedStep: this.futureStep,
                previouslySelectedStep: this.arraySteps[this.stepIndex],
                previouslySelectedIndex: this.stepIndex,
            });
            if (this.navigationControl.value.allowStepChange) {
                this.enterAnotherStep();
            }
        }
    }

    public onBackClick(): void {
        if (!_isUndefined(this.stepIndex)) {
            let previousStep = this.arraySteps[this.stepIndex - 1];
            if (previousStep.hidden || previousStep.disabled) {
                previousStep = _find(
                    this.arraySteps.slice(0).reverse(),
                    (step) => !step.hidden,
                    _findIndex(
                        this.arraySteps.slice(0).reverse(),
                        this.arraySteps[this.stepIndex]
                    ) + 1
                );
            }
            this.selectStep(previousStep);
            this.back.emit();
        }
    }

    public onNextClick(): void {
        let nextStep = this.arraySteps[this.stepIndex + 1];
        this.handleStepControl(this.currentStep);
        this.currentStep?.nextStep({
            selectedIndex: this.stepIndex,
            selectedStep: this.currentStep,
            previouslySelectedStep: this.currentStep,
            previouslySelectedIndex: this.stepIndex,
        });
        if (
            nextStep.hidden ||
            (nextStep.disabled && !_isUndefined(nextStep.stepControl))
        ) {
            // this disabled does not let user to go forward when next is disabled. Needs to be changed after validation
            nextStep = _find(
                this.arraySteps,
                (step) => !step.hidden,
                this.stepIndex + 1
            );
        }
        if (this.currentStep) {
            if (
                _isUndefined(this.currentStep?.stepControl) ||
                this.currentStep?.stepControl
            ) {
                this.currentStep.complete = true;
            }
            if (nextStep.disabled && !nextStep.visited) {
                this.currentStep.complete = false;
            }
        }
        this.selectStep(nextStep);
        this.next.emit();
    }

    public onFinishClick(): void {
        this.finish.emit();
    }

    public onCancelClick(): void {
        this.cancel.emit(
            this.steps.toArray().filter((step) => step.complete).length !== 0
        );
    }

    public enterAnotherStep(): void {
        this.currentStep?.applyExitingStep();
        this.futureStep?.enterStep();
        this.currentStep = this.futureStep;
        this.currentStep?.applyEnteringStep();
        this.stepIndex = this.arraySteps.indexOf(this.currentStep);
        this.selectionEvent = {
            selectedIndex: this.stepIndex,
            selectedStep: this.currentStep,
            previouslySelectedStep: this.arraySteps[this.previousStepIndex],
            previouslySelectedIndex: this.previousStepIndex,
        };
        this.selectionChange.emit(this.selectionEvent);
        this.previousStepIndex = this.stepIndex;
    }

    private disableFollowingSteps(): void {
        this.arraySteps.slice(this.stepIndex + 1).map((item) => {
            item.disabled = true;
        });
    }

    private enableFollowingSteps(): void {
        this.arraySteps.slice(this.stepIndex + 1).map((item) => {
            item.disabled = false;
        });
    }

    private getInputsAndOutputs(compType: IWizardStepComponent): string[] {
        const inputs = compType.inputsList;
        const outputs = Object.keys(compType).filter(
            (key) => compType[key] instanceof EventEmitter
        );
        return [...inputs, ...outputs];
    }

    private handleStepControl(step?: WizardStepComponent) {
        if (!_isUndefined(step?.stepControl)) {
            if (step?.stepControl) {
                this.enableFollowingSteps();
            } else {
                this.disableFollowingSteps();
            }
        }
    }

    private getLargestLabelWidth() {
        const widths = this.stepTitles.map(
            (title) => title.nativeElement.offsetWidth
        );

        return Math.round(Math.max(...widths));
    }

    private onRemoveDynamic(step: WizardStepComponent): void {
        const dynamicSubscription = this.dynamicSubscriptions.get(step);
        const ref = this.dynamicRefs.get(step);

        if (ref) {
            ref.destroy();
        }

        if (dynamicSubscription) {
            dynamicSubscription.unsubscribe();
        }
    }
}
