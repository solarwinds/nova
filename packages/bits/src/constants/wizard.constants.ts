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

import { InjectionToken } from "@angular/core";

import { IWizardConfig, WizardStepStateConfig } from "../lib/wizard-v2/types";

export const WIZARD_CONFIG = new InjectionToken<IWizardConfig>("wizard.conf");

export const WIZARD_STEP_STATE_DEFAULT_CONFIG: WizardStepStateConfig = {
    initial: {
        icon: "step",
        iconColor: "gray",
    },
    visited: {
        icon: "step-complete",
        iconColor: "primary-blue",
    },
    active: {
        icon: "step-active",
        iconColor: "black",
    },
    error: {
        icon: "step-active",
        iconColor: "black",
    },
};

export const WIZARD_CONFIG_DEFAULT: IWizardConfig = {
    stepState: { ...WIZARD_STEP_STATE_DEFAULT_CONFIG },
};
