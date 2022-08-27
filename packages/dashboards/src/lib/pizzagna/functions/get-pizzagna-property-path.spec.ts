import {
    getPizzagnaPropertyPath,
    IPizzagnaProperty,
} from "./get-pizzagna-property-path";

describe("getPizzagnaPropertyPath > ", () => {
    it("should get the property path from an IPizzagnaProperty", () => {
        const pizzagnaProperty: IPizzagnaProperty = {
            pizzagnaKey: "testKey",
            componentId: "testComponentId",
            propertyPath: ["testPathSegment1", "testPathSegment2"],
        };

        const expectedPath = [
            pizzagnaProperty.pizzagnaKey,
            pizzagnaProperty.componentId,
            "properties",
            ...pizzagnaProperty.propertyPath,
        ].join(".");

        const path = getPizzagnaPropertyPath(pizzagnaProperty);
        expect(path).toEqual(expectedPath);
    });
});
