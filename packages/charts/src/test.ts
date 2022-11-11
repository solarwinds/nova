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

// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import "zone.js/testing"; // this file always has to be on top
import { getTestBed } from "@angular/core/testing";
import {
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import "d3-selection-multi";

declare const require: any;

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
    [BrowserDynamicTestingModule, NoopAnimationsModule],
    platformBrowserDynamicTesting(),
    {
        teardown: { destroyAfterEach: false },
    }
);
// Then we find all the tests.
const context = require.context("./", true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
