import { EventBus, IEvent } from "@nova-ui/bits";

import { DynamicComponentCreator } from "../../pizzagna/services/dynamic-component-creator.service";
import { PizzagnaService } from "../../pizzagna/services/pizzagna.service";
import { DATA_SOURCE_BUSY } from "../../services/types";
import { PizzagnaLayer } from "../../types";
import { LoadingAdapter } from "./loading-adapter";

describe("LoadingAdapter > ", () => {
    let adapter: LoadingAdapter;
    let eventBus: EventBus<IEvent>;
    let pizzagnaService: PizzagnaService;
    let dynamicComponentCreator: DynamicComponentCreator;

    beforeEach(() => {
        eventBus = new EventBus();
        dynamicComponentCreator = new DynamicComponentCreator();
        pizzagnaService = new PizzagnaService(
            eventBus,
            dynamicComponentCreator
        );
        adapter = new LoadingAdapter(eventBus, pizzagnaService);
        adapter.setComponent(null, "loading");
    });

    it("should set 'active' to 'true' via 'setProperty' when a data source event is busy", () => {
        const spy = spyOn(pizzagnaService, "setProperty");

        // adapter.loading = {};
        eventBus
            .getStream(DATA_SOURCE_BUSY)
            .next({ payload: { componentId: "testing1", busy: true } });
        // adapter.loading = {testing1: true};

        expect(spy).toHaveBeenCalledWith(
            {
                pizzagnaKey: PizzagnaLayer.Data,
                componentId: "loading",
                propertyPath: ["active"],
            },
            true
        );

        eventBus
            .getStream(DATA_SOURCE_BUSY)
            .next({ payload: { componentId: "testing2", busy: true } });
        // adapter.loading = {testing1: true, testing2: true};

        expect(spy).toHaveBeenCalledWith(
            {
                pizzagnaKey: PizzagnaLayer.Data,
                componentId: "loading",
                propertyPath: ["active"],
            },
            true
        );

        eventBus
            .getStream(DATA_SOURCE_BUSY)
            .next({ payload: { componentId: "testing2", busy: false } });
        // adapter.loading = {testing1: true};

        expect(spy).toHaveBeenCalledWith(
            {
                pizzagnaKey: PizzagnaLayer.Data,
                componentId: "loading",
                propertyPath: ["active"],
            },
            true
        );

        eventBus
            .getStream(DATA_SOURCE_BUSY)
            .next({ payload: { componentId: "testing1", busy: false } });
        // adapter.loading = {};

        expect(spy).toHaveBeenCalledWith(
            {
                pizzagnaKey: PizzagnaLayer.Data,
                componentId: "loading",
                propertyPath: ["active"],
            },
            false
        );
    });
});
