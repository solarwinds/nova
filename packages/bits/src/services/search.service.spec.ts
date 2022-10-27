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

import { DatePipe } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import noop from "lodash/noop";

import { LoggerService } from "./log-service";
import { SearchService } from "./search.service";

describe("services >", () => {
    describe("search >", () => {
        const bieberDate: Date = new Date("1994/03/01"); // The birth date of Justin Bieber
        const betterWorld: Date = new Date("1994/02/01");
        const punishedWorld: Date = new Date("1994/03/02");
        const items: any[] = [
            {
                stringValue: "abc789",
                extraStringField: "xxx",
                numValue: 123,
                dateValue: betterWorld,
            },
            {
                stringValue: "abcdef",
                numValue: 123456,
                dateValue: bieberDate,
            },
            {
                stringValue: "abcdefghi",
                numValue: 123456789,
                dateValue: punishedWorld,
            },
        ];
        let subject: SearchService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [
                    SearchService,
                    LoggerService,
                    { provide: DatePipe, useValue: new DatePipe("en") },
                ],
                schemas: [CUSTOM_ELEMENTS_SCHEMA],
            });

            subject = TestBed.inject(SearchService);

            const logger = TestBed.inject(LoggerService);
            spyOnProperty(logger, "error").and.returnValue(noop);
            spyOnProperty(logger, "warn").and.returnValue(noop);
        });

        describe("search() ", () => {
            it("should return the whole array if no properties specified", () => {
                const result: any[] = subject.search(items, [], "abc");
                expect(result.length).toBe(3);
            });
            it("should return the whole array if null or empty searchValue specified", () => {
                const result: any[] = subject.search(
                    items,
                    ["stringValue"],
                    ""
                );
                expect(result.length).toBe(3);
            });
            it("should not throw error if property does not exist on the items and return empty result", () => {
                const result: any[] = subject.search(
                    items,
                    ["nonexisting"],
                    "abc"
                );
                expect(result.length).toBe(0);
            });
            it("should work also with only 1 property of 1 item contains the value", () => {
                const result: any[] = subject.search(
                    items,
                    ["extraStringField"],
                    "xxx"
                );
                expect(result.length).toBe(1);
            });
            it("should work also with only 1 property of 1 item contains the value and fields not specified", () => {
                const result: any[] = subject.search(items, [], "xxx");
                expect(result.length).toBe(1);
            });
            it("should return expected items searched by a string type prop", () => {
                const resultOf1: any[] = subject.search(
                    items,
                    ["stringValue"],
                    "ghi"
                );
                const resultOf2: any[] = subject.search(
                    items,
                    ["stringValue"],
                    "def"
                );
                const resultOf3: any[] = subject.search(
                    items,
                    ["stringValue"],
                    "abc"
                );

                expect(resultOf1.length).toBe(1);
                expect(resultOf2.length).toBe(2);
                expect(resultOf3.length).toBe(3);
            });
            it("should return expected items searched by a number type prop", () => {
                const resultOf1: any[] = subject.search(
                    items,
                    ["numValue"],
                    789
                );
                const resultOf2: any[] = subject.search(
                    items,
                    ["numValue"],
                    456
                );
                const resultOf3: any[] = subject.search(
                    items,
                    ["numValue"],
                    123
                );

                expect(resultOf1.length).toBe(1);
                expect(resultOf2.length).toBe(2);
                expect(resultOf3.length).toBe(3);
            });
            it("should return expected items searched by a date type prop", () => {
                const resultOf1: any[] = subject.search(
                    items,
                    ["dateValue"],
                    bieberDate
                );
                const resultOf2: any[] = subject.search(
                    items,
                    ["dateValue"],
                    "mar"
                );
                const resultOf3: any[] = subject.search(
                    items,
                    ["dateValue"],
                    1994
                );

                expect(resultOf1.length).toBe(1);
                expect(resultOf2.length).toBe(2);
                expect(resultOf3.length).toBe(3);
            });
            it("should return expected items searched by combined props", () => {
                const resultOf0: any[] = subject.search(
                    items,
                    ["stringValue", "dateValue"],
                    123
                );
                const resultOf1: any[] = subject.search(
                    items,
                    ["stringValue", "numValue"],
                    "ghi"
                );
                const resultOf2: any[] = subject.search(
                    items,
                    ["stringValue", "numValue"],
                    789
                );
                const resultOf3: any[] = subject.search(
                    items,
                    ["dateValue", "numValue"],
                    1994
                );

                expect(resultOf0.length).toBe(0);
                expect(resultOf1.length).toBe(1);
                expect(resultOf2.length).toBe(2);
                expect(resultOf3.length).toBe(3);
            });
            it("should return expected items searched by a date type prop with custom set date format", () => {
                const resultOf0: any[] = subject.search(
                    items,
                    ["dateValue"],
                    "march"
                );
                const resultOf1: any[] = subject.search(
                    items,
                    ["dateValue"],
                    bieberDate,
                    "longDate"
                );
                const resultOf2: any[] = subject.search(
                    items,
                    ["dateValue"],
                    "march",
                    "longDate"
                );
                const resultOf3: any[] = subject.search(
                    items,
                    ["dateValue"],
                    1994,
                    "longDate"
                );

                expect(resultOf0.length).toBe(0);
                expect(resultOf1.length).toBe(1);
                expect(resultOf2.length).toBe(2);
                expect(resultOf3.length).toBe(3);
            });
        });
    });
});
