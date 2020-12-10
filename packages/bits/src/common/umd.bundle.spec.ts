describe("UMD bundle tests", () => {
    it("has all dependencies properly specified in ng-package.json", async (done) => {
        const umdFilePath = "base/dist/bundles/nova-ui-bits.umd.js";
        await fetch(umdFilePath).then(async response => {
            if (response.status !== 200) {
                // don't waste time, mark the test as failed
                return done.fail(`Could not load UMD bundle file '${umdFilePath}'.
Status: ${response.statusText} (${response.status}).
Please build it first using 'npm run build-lib:prod'
                `);
            }

            await response.text().then(text => {
                const reg: RegExpExecArray | null = new RegExp("factory\\(\\(global(.*);").exec(text);
                expect((reg ?? [])[0]).not.toContain("null");
                done();
            });
        });
    });
});
