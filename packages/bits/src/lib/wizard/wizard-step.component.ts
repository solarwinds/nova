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
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    TemplateRef,
} from "@angular/core";

import { IBusyConfig } from "../busy/public-api";
import { IWizardSelectionEvent, IWizardStepComponent } from "./public-api";

/**
 * Component that provides wizard step functionality.
 */
@Component({
    selector: "nui-wizard-step",
    templateUrl: "./wizard-step.component.html",
})
export class WizardStepComponent
    implements IWizardStepComponent, OnInit, OnChanges
{
    /**
     * Template for step.
     */
    @Input() public stepTemplate: TemplateRef<any>;
    /**
     * Check is form inside step valid.
     */
    @Input() public stepControl?: boolean;

    /**
     * The title of the step.
     */
    @Input() public title: string;

    /**
     * A more compact form of the title (ex: "EULA").
     */
    @Input() public shortTitle?: string;

    /**
     * The description of the step.
     */
    @Input() public description?: string;

    /**
     * Default:'Next'. Text for the Next button.
     */
    @Input() public nextText: string;
    /**
     * Hide step
     */
    @Input() public hidden = false;
    /**
     * Disables step
     */
    @Input() public disabled?: boolean;
    /**
     * Evaluated when the step is entered.
     */
    @Output() public enter = new EventEmitter<IWizardSelectionEvent | void>();
    /**
     * Evaluated when validity of the step is changed.
     */
    @Output() public valid = new EventEmitter<boolean>();

    /**
     * Evaluated when the step is exited.
     */
    @Output() public exit = new EventEmitter<IWizardSelectionEvent | void>();
    /**
     * Evaluated when trying to go to the next step.
     */
    @Output() public next = new EventEmitter<IWizardSelectionEvent | void>();

    /**
     *
     * Options for busy state. Default: no busy state, with clear empty busy component when set to true
     */
    public busyConfig: IBusyConfig = {
        busy: false,
    };

    public visited = false;
    public active = false;
    public complete = false;
    public icon = "step";
    public iconColor = "";
    public inputsList: string[] = [];

    constructor() {}

    public ngOnInit(): void {
        this.nextText = this.nextText || $localize`Next`;
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (this.inputsList.length === 0) {
            this.inputsList = Object.keys(changes);
        }
        if (changes["stepControl"]) {
            this.valid.emit(this.stepControl);
        }
    }

    /**
     * Set flags for step entering and emits enter event
     */
    public enterStep = (event?: IWizardSelectionEvent): void => {
        this.enter.emit(event);
    };

    /**
     * Set flags for step exiting and emits exit event
     */
    public exitStep = (event?: IWizardSelectionEvent): void => {
        this.exit.emit(event);
    };

    public nextStep = (event?: IWizardSelectionEvent): void => {
        this.next.emit(event);
    };

    public applyEnteringStep = (): void => {
        this.active = true;
        this.icon = "step-active";
        this.iconColor = "black";
    };

    public applyExitingStep = (): void => {
        this.active = false;
        this.visited = true;
        this.icon = "step-complete";
        this.iconColor = "";
    };
}
