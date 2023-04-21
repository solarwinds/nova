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

import { DOCUMENT, isPlatformBrowser } from "@angular/common";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import forOwn from "lodash/forOwn";
import includes from "lodash/includes";
import isBoolean from "lodash/isBoolean";
import isDate from "lodash/isDate";
import isFunction from "lodash/isFunction";
import isNil from "lodash/isNil";
import isNumber from "lodash/isNumber";
import isObject from "lodash/isObject";
import isString from "lodash/isString";

/** @ignore */
enum ByteCount {
    String = 2,
    Boolean = 4,
    Number = 8,
}

/** @ignore */
export enum BrowserName {
    Chrome = "Chrome",
    Edge = "Edge",
    Firefox = "Firefox",
    Opera = "Opera",
    Safari = "Safari",
}

/** @ignore */
export interface BrowserInfo {
    name(): string | undefined;
    version(): string | undefined;
    isChrome(): boolean;
    isEdge(): boolean;
    isFirefox(): boolean;
    isOpera(): boolean;
    isSafari(): boolean;
    mobileDevice: {
        isAndroid(): boolean;
        isBlackberry(): boolean;
        isIOS(): boolean;
        isOpera(): boolean;
        isAny(): boolean;
    };
}

/**
 * Service providing common utilities
 */

/**
 * @dynamic
 * @ignore
 */
@Injectable({ providedIn: "root" })
export class UtilService {
    public static getSvgFromString(s: string): DocumentFragment {
        const div = document.createElementNS(
            "http://www.w3.org/1999/xhtml",
            "div"
        );
        div.innerHTML = `<svg xmlns='http://www.w3.org/2000/svg'>${s}</svg>`;
        const frag = document.createDocumentFragment();
        while (div.firstChild?.firstChild) {
            frag.appendChild(div.firstChild.firstChild);
        }
        return frag;
    }

    public static getEventPath(event: MouseEvent): EventTarget[] {
        if (isFunction(event.composedPath)) {
            return event.composedPath();
        }

        let element: HTMLElement | null = event.target as HTMLElement;

        // Hack for EDGE
        if (!(element as any).path) {
            element = event.currentTarget as HTMLElement;
        }

        const path = [];
        while (element) {
            path.push(element);
            if (element.tagName === "HTML") {
                path.push(document);
                path.push(window);
                return path;
            }
            element = element.parentElement;
        }

        return [];
    }

    private nextUniqueId = ["0", "0", "0"];
    private browserName?: string;

    public isBrowser(): boolean {
        return isPlatformBrowser(this.platformId);
    }

    /**
     * Object for getting information about the browser
     */
    public get browser(): BrowserInfo | undefined {
        if (this.isBrowser()) {
            return {
                name: () => this.browserName,
                version: () => this.getBrowserVersion(),
                isChrome: () => this.browserName === BrowserName.Chrome,
                isEdge: () => this.browserName === BrowserName.Edge,
                isFirefox: () => this.browserName === BrowserName.Firefox,
                isOpera: () => this.browserName === BrowserName.Opera,
                isSafari: () => this.browserName === BrowserName.Safari,
                mobileDevice: {
                    isAndroid: () =>
                        this.document.defaultView?.navigator.userAgent.match(
                            /Android/i
                        ) !== null,
                    isBlackberry: () =>
                        this.document.defaultView?.navigator.userAgent.match(
                            /BlackBerry|BB10/i
                        ) !== null,
                    isIOS: () =>
                        this.document.defaultView?.navigator.userAgent.match(
                            /iPhone|iPad|iPod/i
                        ) !== null,
                    isOpera: () =>
                        this.document.defaultView?.navigator.userAgent.match(
                            /Opera Mini/i
                        ) !== null,
                    isAny: () =>
                        !!(
                            this.browser?.mobileDevice.isIOS() ||
                            this.browser?.mobileDevice.isAndroid() ||
                            this.browser?.mobileDevice.isBlackberry() ||
                            this.browser?.mobileDevice.isOpera()
                        ),
                },
            };
        }
    }

    constructor(
        @Inject(DOCUMENT) private document: Document,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.browserName = this.getBrowser();
    }

    /**
     * Formats the target string in the same way as .NET's String.format
     * @param  target the target string
     * @param  params one or more numbers, booleans, or strings to insert
     *     into the target string at the specified location(s)
     * @returns the formatted string
     */
    public formatString(target: string, ...params: Array<any>): string {
        const toString = (obj: any, format: any) => {
            const ctor = ((o: any) => {
                if (typeof o === "number") {
                    return Number;
                } else if (typeof o === "boolean") {
                    return Boolean;
                } else if (typeof o === "string") {
                    return String;
                } else {
                    return o.constructor;
                }
            })(obj);
            const proto = ctor.prototype;
            const formatter =
                typeof obj !== "string"
                    ? proto
                        ? proto.format || proto.toString
                        : obj.format || obj.toString
                    : obj.toString;
            if (formatter) {
                if (typeof format === "undefined" || format === "") {
                    return formatter.call(obj);
                } else {
                    return formatter.call(obj, format);
                }
            } else {
                return "";
            }
        };

        target = target.replace(
            /\{\{|\}\}|\{([^}: ]+?)(?::([^}]*?))?\}/g,
            (match, num, format) => {
                if (match === "{{") {
                    return "{";
                }
                if (match === "}}") {
                    return "}";
                }
                if (
                    typeof params[num] !== "undefined" &&
                    params[num] !== null
                ) {
                    return toString(params[num], format);
                } else {
                    return "";
                }
            }
        );

        return target;
    }

    private getBrowser() {
        if (isPlatformBrowser(this.platformId)) {
            const ua = this.document.defaultView?.navigator.userAgent;

            if (isNil(ua)) {
                throw new Error("UserAgent is not available");
            }

            let tem;
            let M: RegExpMatchArray | [] =
                ua.match(
                    /(edge|opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
                ) || [];
            if (M[1] === "Chrome") {
                tem = ua.match(/\bOPR\/(\d+)/);
                if (tem != null) {
                    return BrowserName.Opera;
                }
                tem = ua.match(/\bEdge\/(\d+)/);
                if (tem != null) {
                    return BrowserName.Edge;
                }
            }
            M = <RegExpMatchArray>(
                (M[2]
                    ? [M[1], M[2]]
                    : [
                          this.document.defaultView?.navigator.appName,
                          this.document.defaultView?.navigator.appVersion,
                          "-?",
                      ])
            );
            if ((tem = ua.match(/version\/(\d+)/i)) != null) {
                M.splice(1, 1, tem[1]);
            }
            return M[0];
        }
    }

    private getBrowserVersion() {
        if (isPlatformBrowser(this.platformId)) {
            const ua = this.document.defaultView?.navigator.userAgent;

            if (isNil(ua)) {
                throw new Error("UserAgent is not available");
            }

            let tem,
                M =
                    ua.match(
                        /(edge|opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
                    ) || [];
            if (/trident/i.test(M[1])) {
                tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
                return tem[1] || "";
            }
            if (M[1] === "Chrome") {
                tem = ua.match(/\bOPR\/(\d+)/);
                if (tem != null) {
                    return tem[1];
                }
                tem = ua.match(/\bEdge\/(\d+)/);
                if (tem != null) {
                    return tem[1];
                }
            }
            M = <RegExpMatchArray>(
                (M[2]
                    ? [M[1], M[2]]
                    : [
                          this.document.defaultView?.navigator.appName,
                          this.document.defaultView?.navigator.appVersion,
                          "-?",
                      ])
            );
            if ((tem = ua.match(/version\/(\d+)/i)) != null) {
                M.splice(1, 1, tem[1]);
            }
            return M[1];
        }
    }

    /**
     * nextUid, from angular.js.
     * A consistent way of creating unique IDs in angular. The ID is a sequence of alpha numeric
     * characters such as "012ABC". The reason why we are not using simply a number counter is that
     * the number string gets longer over time, and it can also overflow, where as the nextId
     * will grow much slower, it is a string, and it will never overflow.
     *

     */
    public nextUid(): string {
        let index = this.nextUniqueId.length;
        let digit: number;

        while (index) {
            index--;
            digit = this.nextUniqueId[index].charCodeAt(0);

            if (digit === 57 /* "9" */) {
                this.nextUniqueId[index] = "A";
                return this.nextUniqueId.join("");
            }
            if (digit === 90 /* "Z" */) {
                this.nextUniqueId[index] = "0";
            } else {
                this.nextUniqueId[index] = String.fromCharCode(digit + 1);
                return this.nextUniqueId.join("");
            }
        }

        this.nextUniqueId.unshift("0");
        return this.nextUniqueId.join("");
    }

    /**
     * Returns the approximate memory footprint (byte count) of the object specified

     */
    public sizeof = (object: any): number => {
        const visitedObjects: any[] = [];
        return this.calculateSizeof(object, visitedObjects);
    };

    private calculateSizeof = (object: any, visitedObjects: any[]): number => {
        if (isString(object)) {
            return object.length * ByteCount.String;
        } else if (isBoolean(object)) {
            return ByteCount.Boolean;
        } else if (isNumber(object)) {
            return ByteCount.Number;
        } else if (isObject(object)) {
            visitedObjects.push(object);
            let bytes = 0;

            forOwn(object, (value: any, key: any) => {
                bytes += this.calculateSizeof(key, visitedObjects);
                // short-circuit circular refs
                if (!includes(visitedObjects, value)) {
                    bytes += this.calculateSizeof(value, visitedObjects);
                }
            });

            return bytes;
        } else {
            return 0;
        }
    };

    public dateEquals(date1?: Date, date2?: Date): boolean {
        if (isNil(date1) && isNil(date2)) {
            return date1 === date2;
        }

        if (!isDate(date1) || !isDate(date2)) {
            return false;
        }

        return date1?.valueOf() === date2?.valueOf();
    }
}
