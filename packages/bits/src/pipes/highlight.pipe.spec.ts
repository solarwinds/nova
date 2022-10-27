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

import { HighlightPipe } from "./highlight.pipe";

describe("pipes >", () => {
    describe("highlight pipe >", () => {
        const parametererizedTest = [
            {
                description:
                    "should highlight search text in case of concurrency",
                text: `Hello darkness my old friend`,
                search: `old friend`,
                expectedText: `Hello darkness my <span class="nui-highlighted">old friend</span>`,
            },
            {
                description:
                    "shouldn't highlight search text in case of discrepancy",
                text: `Within the sound of silence`,
                search: `old friend`,
                expectedText: `Within the sound of silence`,
            },
            {
                description: "will handle inline markup, search outside",
                text: `hello <span class="x">FOO</span> bar`,
                search: `bar`,
                expectedText: `hello &lt;span class=&quot;x&quot;&gt;FOO&lt;/span&gt; <span class="nui-highlighted">bar</span>`,
            },
        ];

        parametererizedTest.forEach((paramter) => {
            it(paramter.description, () => {
                const subject = new HighlightPipe();
                expect(subject.transform(paramter.text, paramter.search)).toBe(
                    paramter.expectedText
                );
            });
        });
    });
});
