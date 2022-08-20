import { EventBus, IEvent } from "@nova-ui/bits";

import {
    DATA_SOURCE_DESTROYED,
    DATA_SOURCE_OUTPUT,
} from "../../configurator/types";
import { IPizzagnaProperty } from "../../pizzagna/functions/get-pizzagna-property-path";
import { DynamicComponentCreator } from "../../pizzagna/services/dynamic-component-creator.service";
import { PizzagnaService } from "../../pizzagna/services/pizzagna.service";
import { PizzagnaLayer } from "../../types";

import { KpiStatusContentFallbackAdapter } from "./kpi-status-content-fallback-adapter";
import { IDataSourceError, IDataSourceOutputPayload } from "./types";

describe("KpiStatusContentFallbackAdapter > ", () => {
    let adapter: KpiStatusContentFallbackAdapter;
    let eventBus: EventBus<IEvent>;
    let pizzagnaService: PizzagnaService;
    let dynamicComponentCreator: DynamicComponentCreator;
    let firstSetPropArg: IPizzagnaProperty;

    beforeEach(() => {
        eventBus = new EventBus();
        dynamicComponentCreator = new DynamicComponentCreator();
        pizzagnaService = new PizzagnaService(
            eventBus,
            dynamicComponentCreator
        );
        adapter = new KpiStatusContentFallbackAdapter(
            eventBus,
            pizzagnaService
        );
        (<any>adapter).componentId = "testId";

        firstSetPropArg = {
            componentId: (<any>adapter).componentId,
            propertyPath: ["fallbackKey"],
            pizzagnaKey: PizzagnaLayer.Data,
        };
    });

    describe("in response to a DATA_SOURCE_OUTPUT event", () => {
        it("should invoke PizzagnaService.setProperty with 'undefined' for the 'fallbackKey' if the 'error' property is undefined", () => {
            const event: IEvent<IDataSourceOutputPayload<any>> = {
                payload: {
                    componentId: "kpi1",
                    result: {},
                },
            };

            const spy = spyOn(pizzagnaService, "setProperty");
            eventBus.getStream(DATA_SOURCE_OUTPUT).next(event);
            expect(spy).toHaveBeenCalledWith(firstSetPropArg, undefined);
        });

        it("should invoke PizzagnaService.setProperty with 'undefined' for the 'fallbackKey' if the 'error.type' property is undefined", () => {
            const event: IEvent<IDataSourceOutputPayload<any>> = {
                payload: {
                    componentId: "kpi1",
                    result: {},
                    error: {} as IDataSourceError,
                },
            };

            const spy = spyOn(pizzagnaService, "setProperty");
            eventBus.getStream(DATA_SOURCE_OUTPUT).next(event);
            expect(spy).toHaveBeenCalledWith(firstSetPropArg, undefined);
        });

        it("should invoke PizzagnaService.setProperty with the error type specified for the 'fallbackKey'", () => {
            const expectedError = "404";
            const event: IEvent<IDataSourceOutputPayload<any>> = {
                payload: {
                    componentId: "kpi1",
                    result: {},
                    error: {
                        type: expectedError,
                    },
                },
            };

            const spy = spyOn(pizzagnaService, "setProperty");
            eventBus.getStream(DATA_SOURCE_OUTPUT).next(event);
            expect(spy).toHaveBeenCalledWith(firstSetPropArg, expectedError);
        });

        it("should invoke PizzagnaService.setProperty with a string error type if the error type is a number", () => {
            const event: IEvent<IDataSourceOutputPayload<any>> = {
                payload: {
                    componentId: "kpi1",
                    result: {},
                    error: {
                        type: 404,
                    },
                },
            };

            const spy = spyOn(pizzagnaService, "setProperty");
            eventBus.getStream(DATA_SOURCE_OUTPUT).next(event);
            expect(spy).toHaveBeenCalledWith(
                firstSetPropArg,
                event.payload?.error?.type.toString()
            );
        });

        it(`should invoke PizzagnaService.setProperty with the specified error type if some kpi adapters
        report the same error while the others do not report an error`, () => {
            const expectedError = "404";
            const event: IEvent<IDataSourceOutputPayload<any>> = {
                payload: {
                    componentId: "kpi1",
                    result: {},
                    error: {
                        type: expectedError,
                    },
                },
            };

            if (event.payload) {
                eventBus.getStream(DATA_SOURCE_OUTPUT).next(event);
                event.payload.componentId = "kpi2";
                eventBus.getStream(DATA_SOURCE_OUTPUT).next(event);
                event.payload.componentId = "kpi3";
                event.payload.error = undefined;
            }

            const spy = spyOn(pizzagnaService, "setProperty");
            eventBus.getStream(DATA_SOURCE_OUTPUT).next(event);
            expect(spy).toHaveBeenCalledWith(
                firstSetPropArg,
                expectedError.toString()
            );
        });

        it(`should invoke PizzagnaService.setProperty with the 'multipleErrorFallbackKey' if one kpi adapter
        reports one error while another reports a different error, and other kpi adapters report no error`, () => {
            const event: IEvent<IDataSourceOutputPayload<any>> = {
                payload: {
                    componentId: "kpi1",
                    result: {},
                    error: {
                        type: 404,
                    },
                },
            };

            if (event.payload && event.payload.error?.type) {
                eventBus.getStream(DATA_SOURCE_OUTPUT).next(event);
                event.payload.componentId = "kpi2";
                event.payload.error.type = 405;
                eventBus.getStream(DATA_SOURCE_OUTPUT).next(event);
                event.payload.componentId = "kpi3";
                event.payload.error = undefined;
            }
            const spy = spyOn(pizzagnaService, "setProperty");
            eventBus.getStream(DATA_SOURCE_OUTPUT).next(event);
            expect(spy).toHaveBeenCalledWith(
                firstSetPropArg,
                adapter.multipleErrorFallbackKey
            );
        });

        it("should invoke PizzagnaService.setProperty with the specified error type if all kpi adapters report the same error", () => {
            const expectedError = "404";
            const event: IEvent<IDataSourceOutputPayload<any>> = {
                payload: {
                    componentId: "kpi1",
                    result: {},
                    error: {
                        type: expectedError,
                    },
                },
            };

            eventBus.getStream(DATA_SOURCE_OUTPUT).next(event);
            if (event.payload) {
                event.payload.componentId = "kpi2";
            }
            const spy = spyOn(pizzagnaService, "setProperty");
            eventBus.getStream(DATA_SOURCE_OUTPUT).next(event);
            expect(spy).toHaveBeenCalledWith(firstSetPropArg, expectedError);
        });
    });

    describe("in response to a DATA_SOURCE_DESTROYED event", () => {
        it("should invoke PizzagnaService.setProperty with 'undefined' for the 'fallbackKey' if the last kpi tile is destroyed", () => {
            const event: IEvent<any> = {
                payload: {
                    componentId: "kpi1",
                },
            };

            (<any>adapter).errorMap = { kpi1: "errorCode" };
            const spy = spyOn(pizzagnaService, "setProperty");
            eventBus.getStream(DATA_SOURCE_DESTROYED).next(event);
            expect(spy).toHaveBeenCalledWith(firstSetPropArg, undefined);
        });

        it("should invoke PizzagnaService.setProperty with the last remaining unique error type for the 'fallbackKey'", () => {
            const event: IEvent<any> = {
                payload: {
                    componentId: "kpi3",
                },
            };

            (<any>adapter).errorMap = {
                kpi1: "errorType",
                kpi2: "errorType",
                kpi3: "anotherErrorType",
            };
            const spy = spyOn(pizzagnaService, "setProperty");
            eventBus.getStream(DATA_SOURCE_DESTROYED).next(event);
            expect(spy).toHaveBeenCalledWith(firstSetPropArg, "errorType");
        });

        it("should invoke PizzagnaService.setProperty with the 'multipleErrorFallbackKey' if more than one unique error remains", () => {
            const event: IEvent<any> = {
                payload: {
                    componentId: "kpi2",
                },
            };

            (<any>adapter).errorMap = {
                kpi1: "errorType",
                kpi2: "errorType",
                kpi3: "anotherErrorType",
            };
            const spy = spyOn(pizzagnaService, "setProperty");
            eventBus.getStream(DATA_SOURCE_DESTROYED).next(event);
            expect(spy).toHaveBeenCalledWith(
                firstSetPropArg,
                adapter.multipleErrorFallbackKey
            );
        });
    });
});
