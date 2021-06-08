import { DimensionConfig } from "@nova-ui/charts";

describe("dimension-config", ()=> {

    fit("doesn't allow for negative height to be set", ()=> {
        const dc = new DimensionConfig();
        dc.margin.top = 10;
        dc.margin.bottom = 10;
        dc.outerHeight(5);

        expect(dc.height()).toEqual(0);
    });

});
