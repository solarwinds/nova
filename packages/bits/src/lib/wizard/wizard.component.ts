import {
    AfterContentInit,
    AfterViewChecked,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ContentChildren,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    QueryList,
    ViewChild,
    ViewChildren,
    ViewContainerRef,
    ViewEncapsulation
} from "@angular/core";
import _find from "lodash/find";
import _findIndex from "lodash/findIndex";
import _isUndefined from "lodash/isUndefined";
import { BehaviorSubject } from "rxjs";

import { LoggerService } from "../../services/log-service";

import { IWizardSelectionEvent, IWizardStepComponent, IWizardWaitEvent } from "./public-api";
import { WizardStepComponent } from "./wizard-step.component";

// <example-url>./../examples/index.html#/wizard</example-url>

/**
 * Component that provides wizard functionality.
 */
@Component({
    selector: "nui-wizard",
    templateUrl: "./wizard.component.html",
    styleUrls: ["./wizard.component.less"],
    encapsulation: ViewEncapsulation.None,
})
export class WizardComponent implements OnInit, AfterContentInit, AfterViewChecked, OnDestroy {
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
    @Output() public selectionChange = new EventEmitter<IWizardSelectionEvent>();
    /**
     * Evaluated when the user attempts to cancel the wizard.
     */
    @Output() public cancel = new EventEmitter<boolean>();
    /**
     * Evaluated when the user completes the wizard.
     */
    @Output() public finish = new EventEmitter();
    /**
     * Emits when next button is clicked.
     */
    @Output() public next = new EventEmitter();
    /**
     * Emits when Back button is clicked.
     */
    @Output() public back = new EventEmitter();

    public currentStep?: WizardStepComponent;
    public stepLineWidth: number = 65;
    public navigationControl: BehaviorSubject<IWizardWaitEvent> = new BehaviorSubject<IWizardWaitEvent>({
        busyState: {busy: false},
        allowStepChange: true,
    });
    private selectionEvent: IWizardSelectionEvent;
    private stepIndex: number;
    private previousStepIndex = 0;
    private futureStep?: WizardStepComponent;

    private arraySteps: any[];

    constructor(private changeDetector: ChangeDetectorRef,
        private componentFactoryResolver: ComponentFactoryResolver,
        private logger: LoggerService) { }

    ngOnInit() {
        if (this.finishText === WizardComponent.placeholderFinishText) {
            this.logger.warn(`WizardComponent input "finishText" is using placeholder text
"${WizardComponent.placeholderFinishText}". A value should be specified.`);
        }
    }

    public ngAfterContentInit() {
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
        this.navigationControl.subscribe(value => {
            if (this.currentStep) {
                this.currentStep.busyConfig = value.busyState;
            }
            if (value.allowStepChange && !_isUndefined(this.futureStep) && this.currentStep !== this.futureStep) {
                this.enterAnotherStep();
                this.futureStep = undefined;
            }
        });

    }

    public ngAfterViewChecked() {
        if (this.stretchStepLines) {
            this.stepLineWidth = Math.round(this.getLargestLabelWidth() / 2);
            this.changeDetector.detectChanges();
        }
    }

    public ngOnDestroy() {
        this.steps.toArray().forEach((step: WizardStepComponent) => step.valid.unsubscribe());
        this.navigationControl.unsubscribe();
    }

    public addStepDynamic (wizardStep: IWizardStepComponent, indexToInsert: number) {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(WizardStepComponent);
        const componentRef = this.dynamicStep.createComponent(componentFactory);
        const instance: IWizardStepComponent = componentRef.instance;
        instance.title = wizardStep.title;
        instance.stepTemplate = wizardStep.stepTemplate;
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

        stepToRemove.valid.unsubscribe();
        this.arraySteps.splice(index, 1);
        this.steps.reset([]);
        this.steps.reset(this.arraySteps);
    }

    public disableStep (step: WizardStepComponent) {
        const indexOfStep = this.arraySteps.indexOf(step);
        const toDisable = this.arraySteps[indexOfStep];
        toDisable.disabled = true;
        this.changeDetector.detectChanges();
    }

    public enableStep (step: WizardStepComponent) {
        const indexOfStep = this.arraySteps.indexOf(step);
        const toDisable = this.arraySteps[indexOfStep];
        toDisable.disabled = false;
        this.changeDetector.detectChanges();
    }

    public hideStep (step: WizardStepComponent) {
        const indexOfStep = this.arraySteps.indexOf(step);
        const toHide = this.arraySteps[indexOfStep];
        toHide.hidden = true;
    }

    public showStep (step: WizardStepComponent) {
        const indexOfStep = this.arraySteps.indexOf(step);
        const visibleStep = this.arraySteps[indexOfStep];
        visibleStep.hidden = false;
    }

    public goToStep (stepIndex: number) {
        this.selectStep(this.arraySteps[stepIndex]);
    }

    public selectStep(step: WizardStepComponent) {
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

    public onBackClick() {
        if (!_isUndefined(this.stepIndex)) {
            let previousStep = this.arraySteps[this.stepIndex - 1];
            if (previousStep.hidden || previousStep.disabled) {
                previousStep = _find(this.arraySteps.slice(0).reverse(),
                        step => !step.hidden,
                    _findIndex(this.arraySteps.slice(0).reverse(), this.arraySteps[this.stepIndex]) + 1);
            }
            this.selectStep(previousStep);
            this.back.emit();
        }
    }

    public onNextClick() {
        let nextStep = this.arraySteps[this.stepIndex + 1];
        this.handleStepControl(this.currentStep);
        this.currentStep?.nextStep({
            selectedIndex: this.stepIndex,
            selectedStep: this.currentStep,
            previouslySelectedStep: this.currentStep,
            previouslySelectedIndex: this.stepIndex,
        });
        if (nextStep.hidden || nextStep.disabled && !_isUndefined(nextStep.stepControl)) {
            // this disabled does not let user to go forward when next is disabled. Needs to be changed after validation
            nextStep = _find(this.arraySteps, step => !step.hidden, this.stepIndex + 1);
        }
        if (this.currentStep) {
            if (_isUndefined(this.currentStep?.stepControl) || this.currentStep?.stepControl) {
                this.currentStep.complete = true;
            }
            if (nextStep.disabled && !nextStep.visited) {
                this.currentStep.complete = false;
            }
        }
        this.selectStep(nextStep);
        this.next.emit();
    }

    public onFinishClick() {
        this.finish.emit();
    }

    public onCancelClick() {
        this.cancel.emit(this.steps.toArray().filter(step => step.complete).length !== 0);
    }

    public enterAnotherStep() {
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
        const widths = this.stepTitles.map((title) => title.nativeElement.offsetWidth);

        return Math.round(Math.max(...widths));
    }
}
