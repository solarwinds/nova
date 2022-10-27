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

import { DashwizStepComponent } from "./dashwiz-step.component";

describe("components >", () => {
    describe("wizard-step >", () => {
        let subject: DashwizStepComponent;

        beforeEach(() => {
            subject = new DashwizStepComponent();
        });

        it("should run enterStep and change active, visited and icon params", () => {
            expect(subject.active).toBeFalsy();
            expect(subject.visited).toBeFalsy();
            expect(subject.icon).toBe("step");
            subject.enterStep();
            expect(subject.active).toBeFalsy();
            expect(subject.visited).toBeFalsy();
            expect(subject.icon).toBe("step");
            subject.applyEnteringStep();
            expect(subject.active).toBeTruthy();
            expect(subject.visited).toBeFalsy();
            expect(subject.icon).toBe("step-active");
        });

        it("should run exitStep and change active and icon params", () => {
            subject.applyEnteringStep();
            expect(subject.active).toBeTruthy();
            expect(subject.icon).toBe("step-active");
            subject.exitStep();
            expect(subject.active).toBeTruthy();
            expect(subject.icon).toBe("step-active");
            subject.applyExitingStep();
            expect(subject.active).toBeFalsy();
            expect(subject.icon).toBe("step-complete");
        });
    });
});
