import { IValueProvider } from "../types";

import { SequentialValueProvider } from "./sequential-value-provider";

describe("SequentialValueProvider >", () => {

    let svp: IValueProvider<string>;

    beforeEach(() => {
        svp = new SequentialValueProvider(["a", "b", "c"]);
    });

    describe("get", () => {
        it("returns new values for unique keys", () => {
            expect(svp.get("id1")).toBe("a");
            expect(svp.get("id2")).toBe("b");
            expect(svp.get("id3")).toBe("c");

            expect(svp.get("id4")).toBe("a");

            expect(svp.get("id3")).toBe("c");
        });
    });
});
