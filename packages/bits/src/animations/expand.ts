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

import {
    animate,
    state,
    style,
    transition,
    trigger,
    stagger,
    query,
    group,
} from "@angular/animations";

export const expand = trigger("expandedState", [
    state("expanded", style({ height: "*" })),
    state("collapsed", style({ height: 0 })),
    transition("expanded <=> collapsed", [animate("350ms ease-in-out")]),
]);

/**
 * This v2 version of the expand animation respects the animations of elements nested inside the expander's content template.
 *  It is using the special selectors that ngIf and ngFor use on projected content.
 */
export const expandV2 = trigger("expandContent", [
    transition(":enter", [
        group([
            query(
                ":self",
                [
                    style({ height: 0 }),
                    animate("350ms ease-in-out", style({ height: "*" })),
                ],
                { optional: true }
            ),
            query(
                "@*",
                [
                    style({ height: 0 }),
                    stagger(10, [
                        animate("250ms ease-in-out", style({ height: "*" })),
                    ]),
                ],
                { optional: true }
            ),
        ]),
    ]),
    transition(":leave", [
        query(":self", [
            style({ height: "*" }),
            animate("350ms ease-in-out", style({ height: 0 })),
        ]),
    ]),
]);
