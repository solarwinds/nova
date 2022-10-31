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

import { TestBed } from "@angular/core/testing";
import isUndefined from "lodash/isUndefined";

import { DragAndDropService } from "./drag-and-drop.service";
import { IDragState } from "./public-api";

describe("directives >", () => {
    describe("dragAndDropService >", () => {
        let sut: DragAndDropService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [DragAndDropService],
            });
            sut = TestBed.inject(DragAndDropService);
        });

        it("#setDragPayload should set dragPayload", () => {
            const event = new DragEvent("dragstart", {
                dataTransfer: new DataTransfer(),
            });
            const payload = {
                property: "value",
            };
            sut.setDragPayload(payload, event);
            const result = sut.getDragPayload(new DragEvent("dragenter"));
            const nativeDragPayloadText = JSON.parse(
                event.dataTransfer?.getData("Text") ?? ""
            );
            const nativeDragPayloadTextPlain = JSON.parse(
                event.dataTransfer?.getData("text/plain") ?? ""
            );
            const expectedResult = {
                data: payload,
                isExternal: false,
            };
            expect(result).toEqual(expectedResult);
            expect(nativeDragPayloadText).toEqual(payload);
            expect(nativeDragPayloadTextPlain).toEqual(payload);
        });

        it("#setDragPayload should emit onDragStateChanged", () => {
            const event = new DragEvent("dragstart", {
                dataTransfer: new DataTransfer(),
            });
            const payload = {
                property: "value",
            };
            let result: IDragState | undefined;
            sut.onDragStateChanged.subscribe((state) => {
                result = state;
            });
            sut.setDragPayload(payload, event);
            expect(result).toEqual({
                payload: payload,
                isInProgress: true,
            });
        });

        it("#resetPayload should set payload to undefined", () => {
            const event = new DragEvent("dragstart", {
                dataTransfer: new DataTransfer(),
            });
            const payload = {
                property: "value",
            };
            sut.setDragPayload(payload, event);
            expect(sut.getDragPayload(new DragEvent("drop"))).toBeDefined();
            sut.resetPayload();
            const result = sut.getDragPayload(
                new DragEvent("drop", { dataTransfer: new DataTransfer() })
            );
            expect(result.data).toBeFalsy();
            expect(result.isExternal).toBe(true);
        });

        it("#resetPayload should emit event", () => {
            let result: IDragState | undefined;
            sut.onDragStateChanged.subscribe((state: IDragState) => {
                result = state;
            });

            sut.resetPayload();

            expect(result).toBeTruthy();

            if (isUndefined(result)) {
                throw new Error("dragState is not defined");
            }

            expect((<IDragState>result).isInProgress).toBe(false);
        });
    });
});
