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

import { EventEmitter, TemplateRef } from "@angular/core";

import { IBusyConfig } from "../busy/public-api";

export interface IWizardSelectionEvent {
    /** Index of the step now selected. */
    selectedIndex: number;

    /** Index of the step previously selected. */
    previouslySelectedIndex?: number;

    /** The step instance now selected. */
    selectedStep: any;

    /** The step instance previously selected. */
    previouslySelectedStep?: any;
}

export interface IWizardWaitEvent {
    busyState: IBusyConfig;
    allowStepChange: boolean;
}

export interface IWizardStepComponent extends Record<string, any> {
    title: string;
    stepTemplate: TemplateRef<any>;
    stepControl?: boolean;
    shortTitle?: string;
    description?: string;
    nextText?: string;
    disabled?: boolean;
    hidden?: boolean;
    enter?: EventEmitter<IWizardSelectionEvent | void>;
    exit?: EventEmitter<IWizardSelectionEvent | void>;
    next?: EventEmitter<IWizardSelectionEvent | void>;
    valid?: EventEmitter<boolean>;
}
