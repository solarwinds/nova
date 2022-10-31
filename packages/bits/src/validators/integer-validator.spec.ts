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

import { TestBed } from "@angular/core/testing";
import { FormBuilder, ReactiveFormsModule, ValidatorFn } from "@angular/forms";

import { NuiValidators } from "./nui-validators";

describe("validators >", () => {
    describe("integerValidator >", () => {
        let formBuilder: FormBuilder;
        const commonTestCases = [
            { num: "0", result: true },
            { num: "108", result: true },
            { num: "0108", result: false },
            { num: "10.8", result: false },
            { num: "-10.8", result: false },
            { num: "0.8", result: false },
        ];
        beforeAll(() => {
            TestBed.configureTestingModule({
                imports: [ReactiveFormsModule],
            });
            formBuilder = TestBed.inject(FormBuilder);
        });

        const executeTestCases = (
            testCases: Array<{ num: string; result: boolean }>,
            validatorFn: ValidatorFn
        ) => {
            testCases.forEach((test, idx) => {
                it(`integer validation test case ${test.num} should be ${test.result}`, () => {
                    const control = formBuilder.control(test.num, validatorFn);
                    expect(control.valid).toEqual(test.result);
                });
            });
        };

        describe("signed integer validation >", () => {
            const testCases = [{ num: "-108", result: true }].concat(
                commonTestCases
            );
            const validatorFn = NuiValidators.integer();
            executeTestCases(testCases, validatorFn);
        });

        describe("unsigned integer validation >", () => {
            const testCases = [{ num: "-108", result: false }].concat(
                commonTestCases
            );
            const validatorFn = NuiValidators.integer(true);
            executeTestCases(testCases, validatorFn);
        });
    });
});
