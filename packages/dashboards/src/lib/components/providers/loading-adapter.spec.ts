// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import { EventBus, IEvent } from "@nova-ui/bits";

import { LoadingAdapter } from "./loading-adapter";
import { DynamicComponentCreator } from "../../pizzagna/services/dynamic-component-creator.service";
import { PizzagnaService } from "../../pizzagna/services/pizzagna.service";
import { DATA_SOURCE_BUSY } from "../../services/types";
import { PizzagnaLayer } from "../../types";

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
