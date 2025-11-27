import {
    computeA11yForGraphic,
    A11yGraphicOptions,
} from "./a11y-graphics.util";

/** Helper to reduce repetition */
function run(opts: A11yGraphicOptions) {
    return computeA11yForGraphic(opts);
}

describe("computeA11yForGraphic", () => {
    it("defaults to decorative when decorative undefined", () => {
        const r = run({ label: "Server" });
        expect(r.role).toBe("presentation");
        expect(r.ariaHidden).toBe("true");
        expect(r.ariaLabel).toBeNull();
    });

    it("returns img role and aria-label when decorative=false and label present", () => {
        const r = run({
            decorative: false,
            label: "Warning",
            statusParts: ["critical"],
        });
        expect(r.role).toBe("img");
        expect(r.ariaHidden).toBeNull();
        expect(r.ariaLabel).toBe("Warning critical");
    });

    it("omits aria-label when hasAlt=true even if label present", () => {
        const r = run({ decorative: false, label: "Logo", hasAlt: true });
        expect(r.role).toBe("img");
        expect(r.ariaHidden).toBeNull();
        expect(r.ariaLabel).toBeNull();
    });

    it("explicitRole=img without label yields null role (no empty img)", () => {
        const r = run({ decorative: false, explicitRole: "img", label: "" });
        expect(r.role).toBeNull();
        expect(r.ariaHidden).toBe("true");
        expect(r.ariaLabel).toBeNull();
    });

    it("explicitRole=img with label respected", () => {
        const r = run({
            decorative: false,
            explicitRole: "img",
            label: "Battery",
        });
        expect(r.role).toBe("img");
        expect(r.ariaHidden).toBeNull();
        expect(r.ariaLabel).toBe("Battery");
    });

    it("explicitRole=presentation overrides label", () => {
        const r = run({
            decorative: false,
            explicitRole: "presentation",
            label: "Chart",
        });
        expect(r.role).toBe("presentation");
        expect(r.ariaHidden).toBe("true");
        expect(r.ariaLabel).toBeNull();
    });

    it("infers img when hasAlt true even without label", () => {
        const r = run({ decorative: false, hasAlt: true });
        expect(r.role).toBe("img");
        expect(r.ariaHidden).toBeNull();
        expect(r.ariaLabel).toBeNull();
    });

    it("infers presentation when no alt and no label", () => {
        const r = run({ decorative: false });
        expect(r.role).toBe("presentation");
        expect(r.ariaHidden).toBe("true");
        expect(r.ariaLabel).toBeNull();
    });

    it("statusParts ignored if empty strings", () => {
        const r = run({
            decorative: false,
            label: "Node",
            statusParts: ["", " ", null as any],
        });
        expect(r.role).toBe("img");
        expect(r.ariaLabel).toBe("Node");
    });

    it("decorative=true forces presentation regardless of label", () => {
        const r = run({ decorative: true, label: "CPU" });
        expect(r.role).toBe("presentation");
        expect(r.ariaHidden).toBe("true");
        expect(r.ariaLabel).toBeNull();
    });
});
