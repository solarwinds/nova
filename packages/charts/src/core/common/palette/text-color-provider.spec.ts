import { IValueProvider } from "../types";
import { SequentialColorProvider } from "./sequential-color-provider";
import { TextColorProvider } from "./text-color-provider";

describe("SequentialValueProvider >", () => {
    let tcp: IValueProvider<string>;

    beforeEach(() => {
        tcp = new TextColorProvider(
            new SequentialColorProvider([
                "black",
                "white",
                "magenta", // black ratio = 6.69, white ratio = 3.13 => black wins!
            ]),
            {
                light: "white",
                dark: "black",
            }
        );
    });

    describe("get", () => {
        it("picks unique color and calculates best text color option for it, using contrast ratio", () => {
            expect(tcp.get("id1")).toBe("white");
            expect(tcp.get("id2")).toBe("black");
            expect(tcp.get("id3")).toBe("black");
        });
    });
});
