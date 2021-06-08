import { DimensionConfig } from "@nova-ui/charts";

describe("dimension-config", ()=> {

    it("doesn't allow for negative width to be set", ()=> {
        const dc = new DimensionConfig();
        dc.margin.left = 10;
        dc.margin.right = 10;
        dc.outerWidth(5);

        expect(dc.width()).toEqual(0);
    });

    it("doesn't allow for negative height to be set", ()=> {
        const dc = new DimensionConfig();
        dc.margin.top = 10;
        dc.margin.bottom = 10;
        dc.outerHeight(5);

        expect(dc.height()).toEqual(0);
    });

});
