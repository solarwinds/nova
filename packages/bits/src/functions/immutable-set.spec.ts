import { immutableSet } from "./immutable-set";

describe("immutableSet >", () => {
    it("should change the reference of the modified node and all of its parents", () => {
        const object = {
            someProp: { propToUpdate: {} },
            otherProp: {},
        };

        const newObject = immutableSet(object, "someProp.propToUpdate", {});
        expect(newObject.someProp.propToUpdate).not.toBe(object.someProp.propToUpdate);
        expect(newObject.someProp).not.toBe(object.someProp);
        expect(newObject).not.toBe(object);
    });

    it("should not change the references of the unmodified nodes", () => {
        const object = {
            someProp: { propToUpdate: {} },
            otherProp: {},
        };

        const newObject = immutableSet(object, "someProp.propToUpdate", { someProp: {}} );
        expect(newObject.someProp.propToUpdate).not.toBe(object.someProp.propToUpdate);
        expect(newObject.otherProp).toBe(object.otherProp);
    });
});
