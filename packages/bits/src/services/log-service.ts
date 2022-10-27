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

import { Injectable, Optional } from "@angular/core";
import noop from "lodash/noop";

import { LogLevel, NuiEnvironment } from "../environment";

/**
 * __Name : __
 * Log Service
 *
 * __Usage :__
 * Used to show log messages in the console
 */
/**
 * @ignore
 */
@Injectable({ providedIn: "root" })
export class LoggerService {
    private logLevel: LogLevel = LogLevel.warn;

    constructor(@Optional() env?: NuiEnvironment) {
        if (env && env.logLevel) {
            this.logLevel = env.logLevel;
            this.info("Log level set to " + this.logLevel);
        }
    }

    /**
     *
     * __Description:__ Log to debug
     * @param ...msgs multiple arguments to be logged.
     */
    get debug() {
        if (this.logLevel === LogLevel.debug) {
            // eslint-disable-next-line no-console
            return console.debug.bind(console);
        }
        return noop;
    }

    /**
     *
     * __Description:__ Log to info
     * @param ...msgs multiple arguments to be logged.
     */
    get info() {
        if (
            this.logLevel === LogLevel.debug ||
            this.logLevel === LogLevel.info
        ) {
            // eslint-disable-next-line no-console
            return console.info.bind(console);
        }
        return noop;
    }

    /**
     *
     * __Description:__ Log without specifying log level
     * @param ...msgs multiple arguments to be logged.
     */
    get log() {
        if (
            this.logLevel === LogLevel.debug ||
            this.logLevel === LogLevel.info ||
            this.logLevel === LogLevel.log
        ) {
            return console.log.bind(console);
        }
        return noop;
    }

    /**
     *
     * __Description:__ Log to warn
     * @param ...msgs multiple arguments to be logged.
     */
    get warn() {
        if (
            this.logLevel === LogLevel.debug ||
            this.logLevel === LogLevel.info ||
            this.logLevel === LogLevel.log ||
            this.logLevel === LogLevel.warn
        ) {
            return console.warn.bind(console);
        }
        return noop;
    }

    /**
     *
     * __Description:__ Log to error
     * @param ...msgs multiple arguments to be logged.
     */
    get error() {
        if (
            this.logLevel === LogLevel.debug ||
            this.logLevel === LogLevel.info ||
            this.logLevel === LogLevel.log ||
            this.logLevel === LogLevel.warn ||
            this.logLevel === LogLevel.error
        ) {
            return console.error.bind(console);
        }
        return noop;
    }
}
