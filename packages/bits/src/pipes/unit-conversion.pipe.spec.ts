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

import { LoggerService } from "../services/log-service";
import { UnitConversionService } from "../services/unit-conversion.service";
import { UnitConversionPipe } from "./unit-conversion.pipe";

describe("pipes >", () => {
    describe("unit conversion pipe >", () => {
        let pipe: UnitConversionPipe;

        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [LoggerService, UnitConversionService],
            });

            pipe = new UnitConversionPipe(
                TestBed.inject(UnitConversionService)
            );
        });

        it(`should use UnitBase.Bytes for the 'bytes' unit`, () => {
            expect(pipe.transform(1024, 2, false, "bytes")).toEqual("1 KB");
        });

        it(`should use UnitBase.Standard for units other than 'bytes'`, () => {
            expect(pipe.transform(1024, 2, false, "generic")).toEqual("1.02K");
        });
    });
});
