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

import { Injectable, Optional, SkipSelf } from "@angular/core";

export enum LogLevel {
    debug = "debug",
    info = "info",
    log = "log",
    warn = "warn",
    error = "error",
}

/**
 * @ignore
 * To modify nui env from outside please create a new instance of NuiEnvironment and
 * include it in a custom provider
 */
@Injectable()
export class NuiEnvironment {
    public logLevel: LogLevel = LogLevel.warn;
}

/** @ignore */
export function NUI_ENV_PROVIDER_FACTORY(parentEnv: NuiEnvironment) {
    return parentEnv || new NuiEnvironment();
}

/** @ignore */
export const NUI_ENV_PROVIDER = {
    // If there is already an MatPaginatorIntl available, use that. Otherwise, provide a new one.
    provide: NuiEnvironment,
    deps: [[new Optional(), new SkipSelf(), NuiEnvironment]],
    useFactory: NUI_ENV_PROVIDER_FACTORY,
};
