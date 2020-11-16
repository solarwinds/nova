import { HighlightPipe } from "./highlight.pipe";

describe("pipes >", () => {
    describe("highlight pipe >", () => {

        const parametererizedTest = [
            {
                description: "should highlight search text in case of concurrency",
                text: `Hello darkness my old friend`,
                search: `old friend`,
                expectedText: `Hello darkness my <span class="nui-highlighted">old friend</span>`,
            },
            {
                description: "shouldn't highlight search text in case of discrepancy",
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
                expect(subject.transform(paramter.text, paramter.search)).toBe(paramter.expectedText);
            });
        });
    });
});
