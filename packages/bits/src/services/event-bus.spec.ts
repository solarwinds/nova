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

import { Subject } from "rxjs";

import { EventBus } from "./event-bus";
import { EventDefinition, IEvent } from "./public-api";

describe("EventBus > ", () => {
    let eventBus: EventBus<IEvent>;
    beforeEach(() => {
        eventBus = new EventBus<IEvent>();
    });

    describe("getStream", () => {
        it("should add a stream if it doesn't already exist", () => {
            const newStream = new EventDefinition("new_stream");
            eventBus.getStream(newStream);
            expect(
                (<any>eventBus).streams[newStream.id] instanceof Subject
            ).toEqual(true);
        });

        it("should invoke streamAdded.next", () => {
            const newStream = new EventDefinition("new_stream");
            const spy = spyOn(eventBus.streamAdded, "next");
            eventBus.getStream(newStream);
            expect(spy).toHaveBeenCalledWith(newStream.id);
        });

        it("should not add a stream if it already exists", () => {
            const newStream = new EventDefinition("new_stream");
            eventBus.getStream(newStream);
            expect(Object.keys((<any>eventBus).streams).length).toEqual(1);
            eventBus.getStream(newStream);
            expect(Object.keys((<any>eventBus).streams).length).toEqual(1);
        });
    });

    describe("subject emissions > ", () => {
        it("should include the stream ID", () => {
            const newStream = new EventDefinition("new_stream");
            const spy = jasmine.createSpy();
            eventBus.getStream(newStream).subscribe(spy);
            eventBus.getStream(newStream).next(undefined);
            expect(spy).toHaveBeenCalledWith({ id: newStream.id });
        });
    });

    describe("ngOnDestroy > ", () => {
        it("should complete all of the streams", () => {
            const newStream = new EventDefinition("new_stream");
            const spy = jasmine.createSpy();
            eventBus.getStream(newStream).subscribe(spy);
            eventBus.ngOnDestroy();
            eventBus.getStream(newStream).next(undefined);
            expect(spy).not.toHaveBeenCalled();
        });
    });

    describe("subscribe > ", () => {
        it("should invoke subscribe on the specified stream", () => {
            const newStream = new EventDefinition("new_stream");
            const next = () => "next";
            const error = () => "error";
            const complete = () => "complete";
            const spy = spyOn(eventBus.getStream(newStream), "subscribe");
            eventBus.subscribe(newStream, next, error, complete);
            expect(spy).toHaveBeenCalledWith(next, error, complete);
        });
    });

    describe("next > ", () => {
        it("should invoke next on the specified stream", () => {
            const newStream = new EventDefinition("new_stream");
            const testEventPayload = { payload: "test" };
            const spy = spyOn(
                eventBus.getStream(newStream),
                "next"
            ).and.callThrough();
            eventBus.next(newStream, testEventPayload);
            expect(spy).toHaveBeenCalledWith({
                id: newStream.id,
                ...testEventPayload,
            });
        });
    });
});
