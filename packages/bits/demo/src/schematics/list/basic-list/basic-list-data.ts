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

import { IServer, ServerStatus } from "./types";

// number of results to be displayed in the list
export const RESULTS_PER_PAGE = 20;

export const LOCAL_DATA: IServer[] = [
    {
        name: "FOCUS-SVR-12345",
        location: "Kyiv",
        status: ServerStatus.active,
    },
    {
        name: "Man-LT-ASD123",
        location: "Brno",
        status: ServerStatus.down,
    },
    {
        name: "Man-LT-DSA331",
        location: "Austin",
        status: ServerStatus.active,
    },
    {
        name: "Man-LT-JKS212",
        location: "Kyiv",
        status: ServerStatus.down,
    },
    {
        name: "ABERN-SVR-ATQU9404",
        location: "Kyiv",
        status: ServerStatus.down,
    },
    {
        name: "Man-LT-433AAD",
        location: "Austin",
        status: ServerStatus.down,
    },
    {
        name: "FOCUS-SVR-098331",
        location: "Kyiv",
        status: ServerStatus.active,
    },
    {
        name: "Man-LT-GHJ882",
        location: "Brno",
        status: ServerStatus.down,
    },
    {
        name: "Man-LT-LLK001",
        location: "Austin",
        status: ServerStatus.down,
    },
    {
        name: "Man-LT-KKJ998",
        location: "Kyiv",
        status: ServerStatus.active,
    },
    {
        name: "FOCUS-SVR-RRR001",
        location: "Brno",
        status: ServerStatus.down,
    },
    {
        name: "Man-LT-LKJF12",
        location: "Austin",
        status: ServerStatus.down,
    },
    {
        name: "Man-LT-882JJS",
        location: "Kyiv",
        status: ServerStatus.down,
    },
    {
        name: "FOCUS-SVR-7733KK",
        location: "Brno",
        status: ServerStatus.active,
    },
    {
        name: "FOCUS-SVR-JSHNSA",
        location: "Austin",
        status: ServerStatus.active,
    },
    {
        name: "FOCUS-SVR-KKAEQWE",
        location: "Kyiv",
        status: ServerStatus.down,
    },
    {
        name: "FOCUS-SVR-123KKNPQ",
        location: "Brno",
        status: ServerStatus.active,
    },
    {
        name: "Man-LT-RRF231",
        location: "Austin",
        status: ServerStatus.down,
    },
];
