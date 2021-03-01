import { TestBed } from "@angular/core/testing";
import { FormBuilder, ReactiveFormsModule, ValidatorFn } from "@angular/forms";

import { NuiValidators } from "./nui-validators";

describe("validators >", () => {
    // TODO: Bring back in after NUI-5787
    fdescribe("integerValidator >", () => {
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
            TestBed
                .configureTestingModule({
                    imports: [ReactiveFormsModule],
                });
            formBuilder = TestBed.inject(FormBuilder);
        });

        const executeTestCases = (testCases: Array<{num: string, result: boolean}>, validatorFn: ValidatorFn) => {
            testCases.forEach((test, idx) => {
                it(`integer validation test case ${test.num} should be ${test.result}`, () => {
                    const control = formBuilder.control(test.num, validatorFn);
                    expect(control.valid).toEqual(test.result);
                });
            });
        };

        describe("signed integer validation >", () => {
            const testCases = [
                { num: "-108", result: true },
            ].concat(commonTestCases);
            const validatorFn = NuiValidators.integer();
            executeTestCases(testCases, validatorFn);
        });

        describe("unsigned integer validation >", () => {
            const testCases = [
                { num: "-108", result: false },
            ].concat(commonTestCases);
            const validatorFn = NuiValidators.integer(true);
            executeTestCases(testCases, validatorFn);
        });
    });
});
