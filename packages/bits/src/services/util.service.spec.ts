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

import { BrowserName, UtilService } from "./util.service";

describe("services >", () => {
    describe("utilService >", () => {
        let utilService: UtilService;
        const fakeDocument = <any>{
            defaultView: {
                navigator: {
                    userAgent: "",
                },
            },
        };

        beforeEach(() => {
            utilService = new UtilService(fakeDocument, "browser");
        });

        describe("when sizeof() is called", () => {
            it("should handle string properly", () => {
                const stringExample = "abc";
                const stringLength = stringExample.length * 2;

                expect(utilService.sizeof(stringExample)).toEqual(stringLength);
            });

            it("should handle boolean properly", () => {
                const booleanExample = true;
                const booleanLength = 4;

                expect(utilService.sizeof(booleanExample)).toEqual(
                    booleanLength
                );
            });

            it("should handle number properly", () => {
                const numberExample = 42;
                const numberLength = 8;

                expect(utilService.sizeof(numberExample)).toEqual(numberLength);
            });

            it("should handle object properly", () => {
                const inner = {
                    key: "value",
                };
                const object = {
                    key: inner,
                };
                const objectLength = 2 * 2 * "key".length + 2 * "value".length;

                expect(utilService.sizeof(object)).toEqual(objectLength);
            });
        });

        describe("when nextUid() is called", () => {
            it("should return uid", () => {
                const uid = utilService.nextUid();
                expect(uid.length).toEqual(3);
            });

            it("each call should return new uid", () => {
                const first = utilService.nextUid();
                const second = utilService.nextUid();
                expect(first).not.toEqual(second);
            });
        });

        describe("when formatString() is called", () => {
            it("formats a string with one string argument", () => {
                expect(
                    utilService.formatString("Formatted {0}", "string")
                ).toEqual("Formatted string");
            });

            it("formats a string with two string arguments in reverse order", () => {
                expect(
                    utilService.formatString(
                        "Double-{1} formatted {0}",
                        "string",
                        "argument"
                    )
                ).toEqual("Double-argument formatted string");
            });

            it("formats a string with three string arguments", () => {
                expect(
                    utilService.formatString(
                        "{0}-{1} formatted {2}",
                        "Triple",
                        "argument",
                        "string"
                    )
                ).toEqual("Triple-argument formatted string");
            });

            it("formats a string with three string arguments in reverse order", () => {
                expect(
                    utilService.formatString(
                        "{2}-{1} formatted {0}",
                        "string",
                        "argument",
                        "Triple"
                    )
                ).toEqual("Triple-argument formatted string");
            });

            it("formats a string with one single-digit decimal argument", () => {
                expect(
                    utilService.formatString("Formatted decimal: {0}", 0)
                ).toEqual("Formatted decimal: 0");
            });

            it("formats a string with one multiple-digit decimal argument", () => {
                expect(
                    utilService.formatString(
                        "Formatted triple-digit decimal: {0}",
                        123
                    )
                ).toEqual("Formatted triple-digit decimal: 123");
            });

            it("formats a string with multiple decimal arguments", () => {
                expect(
                    utilService.formatString(
                        "First decimal: {0}, Second decimal: {1}",
                        123,
                        456
                    )
                ).toEqual("First decimal: 123, Second decimal: 456");
            });

            it("formats a string with a single floating point argument", () => {
                expect(
                    utilService.formatString("Floating point: {0}", 1.23)
                ).toEqual("Floating point: 1.23");
            });

            it("formats a string with a multiple floating point arguments", () => {
                expect(
                    utilService.formatString(
                        "First floating point: {0}, Second floating point: {1}",
                        1.23,
                        4.56
                    )
                ).toEqual(
                    "First floating point: 1.23, Second floating point: 4.56"
                );
            });

            it("formats a string with one false boolean argument", () => {
                expect(
                    utilService.formatString("Formatted boolean: {0}", false)
                ).toEqual("Formatted boolean: false");
            });

            it("formats a string with one true boolean argument", () => {
                expect(
                    utilService.formatString("Formatted boolean: {0}", true)
                ).toEqual("Formatted boolean: true");
            });

            it("formats a string with all possible argument types", () => {
                expect(
                    utilService.formatString(
                        `Formatted boolean: {0},
                                                   Formatted decimal: {1},
                                                   Formatted string: {2},
                                                   Formatted floating point: {3}`,
                        true,
                        123,
                        "test",
                        1.23
                    )
                ).toEqual(`Formatted boolean: true,
                                                   Formatted decimal: 123,
                                                   Formatted string: test,
                                                   Formatted floating point: 1.23`);
            });

            it("allows for undefined arguments", () => {
                expect(
                    utilService.formatString("Undefined value: {0}", undefined)
                ).toEqual("Undefined value: ");
            });

            it("allows for null arguments", () => {
                expect(
                    utilService.formatString("Null value: {0}", null)
                ).toEqual("Null value: ");
            });

            it("allows for escaping open and close braces", () => {
                expect(
                    utilService.formatString(
                        "{0} and {1} braces: {{ property: value }}",
                        "Open",
                        "close"
                    )
                ).toEqual("Open and close braces: { property: value }");
            });

            it("allows for escaping open and close braces with an embedded insertion point", () => {
                expect(
                    utilService.formatString(
                        "{0} and {1} braces: {{property: {2}}}",
                        "Open",
                        "close",
                        "value"
                    )
                ).toEqual("Open and close braces: {property: value}");
            });
        });

        describe("getBrowser > ", () => {
            it("should return 'Safari'", () => {
                fakeDocument.defaultView.navigator.userAgent = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13) AppleWebKit/603.1.13
                    (KHTML, like Gecko) Version/10.1 Safari/603.1.13`;
                expect((<any>utilService).getBrowser()).toEqual(
                    BrowserName.Safari
                );
            });

            it("should return 'Edge'", () => {
                fakeDocument.defaultView.navigator.userAgent = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
                    (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299`;
                expect((<any>utilService).getBrowser()).toEqual(
                    BrowserName.Edge
                );
            });

            it("should return 'Firefox'", () => {
                fakeDocument.defaultView.navigator.userAgent = `Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:58.0)
                    Gecko/20100101 Firefox/58.0`;
                expect((<any>utilService).getBrowser()).toEqual(
                    BrowserName.Firefox
                );
            });

            it("should return 'Opera'", () => {
                fakeDocument.defaultView.navigator.userAgent = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
                    (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 OPR/51.0.2830.34`;
                expect((<any>utilService).getBrowser()).toEqual(
                    BrowserName.Opera
                );
            });

            it("should return 'Chrome'", () => {
                fakeDocument.defaultView.navigator.userAgent = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
                    (KHTML, like Gecko) Chrome/64.0.3282.167 Safari/537.36`;
                expect((<any>utilService).getBrowser()).toEqual(
                    BrowserName.Chrome
                );
            });
        });

        describe("getBrowserVersion > ", () => {
            it("should return the correct Safari version", () => {
                fakeDocument.defaultView.navigator.userAgent = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13) AppleWebKit/603.1.13
                (KHTML, like Gecko) Version/10.1 Safari/603.1.13`;
                expect((<any>utilService).getBrowserVersion()).toEqual("10");
            });

            it("should return the correct Edge version", () => {
                fakeDocument.defaultView.navigator.userAgent = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
                    (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299`;
                expect((<any>utilService).getBrowserVersion()).toEqual("16");
            });

            it("should return the correct Firefox version", () => {
                fakeDocument.defaultView.navigator.userAgent = `Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:58.0)
                    Gecko/20100101 Firefox/58.0`;
                expect((<any>utilService).getBrowserVersion()).toEqual("58");
            });

            it("should return the correct Opera version", () => {
                fakeDocument.defaultView.navigator.userAgent = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
                    (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 OPR/51.0.2830.34`;
                expect((<any>utilService).getBrowserVersion()).toEqual("51");
            });

            it("should return the correct Chrome version", () => {
                fakeDocument.defaultView.navigator.userAgent = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
                    (KHTML, like Gecko) Chrome/64.0.3282.167 Safari/537.36`;
                expect((<any>utilService).getBrowserVersion()).toEqual("64");
            });
        });

        describe("mobileDevice > ", () => {
            it("should return true for iOS on iPad", () => {
                fakeDocument.defaultView.navigator.userAgent = `Mozilla/5.0 (iPad; CPU OS 7_0 like Mac OS X) AppleWebKit/537.51.1
                    (KHTML, like Gecko) CriOS/30.0.1599.12 Mobile/11A465 Safari/8536.25
                    (3B92C18B-D9DE-4CB7-A02A-22FD2AF17C8F)`;
                expect(utilService.browser?.mobileDevice.isIOS()).toEqual(true);
            });

            it("should return true for iOS on iPhone", () => {
                fakeDocument.defaultView.navigator.userAgent = `Mozilla/5.0 (iPhone; CPU iPhone OS 6_1_4 like Mac OS X)
                    AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10B350 Safari/8536.25`;
                expect(utilService.browser?.mobileDevice.isIOS()).toEqual(true);
            });

            it("should return false for iOS on Android", () => {
                fakeDocument.defaultView.navigator.userAgent = `Mozilla/5.0 (Linux; U; Android 4.0.3; ko-kr; LG-L160L Build/IML74K)
                    AppleWebkit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30`;
                expect(utilService.browser?.mobileDevice.isIOS()).toEqual(
                    false
                );
            });

            it("should return true for Android", () => {
                fakeDocument.defaultView.navigator.userAgent = `Mozilla/5.0 (Linux; U; Android 4.0.3; ko-kr; LG-L160L Build/IML74K)
                    AppleWebkit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30`;
                expect(utilService.browser?.mobileDevice.isAndroid()).toEqual(
                    true
                );
            });

            it("should return false for Android on iOS", () => {
                fakeDocument.defaultView.navigator.userAgent = `Mozilla/5.0 (iPad; CPU OS 7_0 like Mac OS X) AppleWebKit/537.51.1
                    (KHTML, like Gecko) CriOS/30.0.1599.12 Mobile/11A465 Safari/8536.25
                    (3B92C18B-D9DE-4CB7-A02A-22FD2AF17C8F)`;
                expect(utilService.browser?.mobileDevice.isAndroid()).toEqual(
                    false
                );
            });

            it("should return true for Blackberry", () => {
                fakeDocument.defaultView.navigator.userAgent = `Mozilla/5.0 (BlackBerry; U; BlackBerry 9320; nl) AppleWebKit/534.11+
                    (KHTML, like Gecko) Version/7.1.0.714 Mobile Safari/534.11+`;
                expect(
                    utilService.browser?.mobileDevice.isBlackberry()
                ).toEqual(true);
            });

            it("should return true for Blackberry 10", () => {
                fakeDocument.defaultView.navigator.userAgent = `Mozilla/5.0 (BB10; Kbd) AppleWebKit/537.10+ (KHTML, like Gecko)
                    Version/10.1.0.4633 Mobile Safari/537.10+`;
                expect(
                    utilService.browser?.mobileDevice.isBlackberry()
                ).toEqual(true);
            });

            it("should return false for Blackberry on iOS", () => {
                fakeDocument.defaultView.navigator.userAgent = `Mozilla/5.0 (iPad; CPU OS 7_0 like Mac OS X) AppleWebKit/537.51.1
                    (KHTML, like Gecko) CriOS/30.0.1599.12 Mobile/11A465 Safari/8536.25
                    (3B92C18B-D9DE-4CB7-A02A-22FD2AF17C8F)`;
                expect(
                    utilService.browser?.mobileDevice.isBlackberry()
                ).toEqual(false);
            });

            it("should return true for Opera Mini", () => {
                fakeDocument.defaultView.navigator.userAgent = `Opera/9.80 (J2ME/MIDP; Opera Mini/9.80
                    (S60; SymbOS; Opera Mobi/23.348; U; en) Presto/2.5.25 Version/10.54`;
                expect(utilService.browser?.mobileDevice.isOpera()).toEqual(
                    true
                );
            });

            it("should return false for Opera Mini on iOS", () => {
                fakeDocument.defaultView.navigator.userAgent = `Mozilla/5.0 (iPad; CPU OS 7_0 like Mac OS X) AppleWebKit/537.51.1
                    (KHTML, like Gecko) CriOS/30.0.1599.12 Mobile/11A465 Safari/8536.25
                    (3B92C18B-D9DE-4CB7-A02A-22FD2AF17C8F)`;
                expect(utilService.browser?.mobileDevice.isOpera()).toEqual(
                    false
                );
            });

            it("should return true for any", () => {
                fakeDocument.defaultView.navigator.userAgent = `Mozilla/5.0 (iPhone; CPU iPhone OS 6_1_4 like Mac OS X)
                    AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10B350 Safari/8536.25`;
                expect(utilService.browser?.mobileDevice.isAny()).toEqual(true);
            });

            it("should return false for any", () => {
                fakeDocument.defaultView.navigator.userAgent = `random user agent`;
                expect(utilService.browser?.mobileDevice.isAny()).toEqual(
                    false
                );
            });
        });

        describe("when dateEquals() is called", () => {
            it("returns true for both undefined", () => {
                expect(utilService.dateEquals(undefined, undefined)).toBe(true);
            });

            it("returns true for both null", () => {
                // @ts-ignore: Suppressing error for testing purposes
                expect(utilService.dateEquals(null, null)).toBe(true);
            });

            it("returns false for undefined and null", () => {
                // @ts-ignore: Suppressing error for testing purposes
                expect(utilService.dateEquals(undefined, null)).toBe(false);
            });

            it("returns false for null and undefined", () => {
                // @ts-ignore: Suppressing error for testing purposes
                expect(utilService.dateEquals(null, undefined)).toBe(false);
            });

            it("returns true for same instance", () => {
                const d = new Date();
                expect(utilService.dateEquals(d, d)).toBe(true);
            });

            it("returns false for different values", () => {
                const d1 = new Date();
                const d2 = new Date();
                d2.setHours(0, 0, 0, 0);
                expect(utilService.dateEquals(d1, d2)).toBe(false);
            });
        });
    });
});
