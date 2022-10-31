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

import { NgZone } from "@angular/core";

import { ChipsOverflowService } from "./chips-overflow.service";
import { ChipsComponent } from "./chips.component";
import { IChipsGroup, IChipsItem } from "./public-api";

const flatItemsTwoMembers: IChipsItem[] = [
    { id: "flatId1", label: "Down" },
    { id: "flatId2", label: "Ok" },
];
const flatItemsOneMember: IChipsItem[] = [{ id: "flatId1", label: "Down" }];
const groupedItemsTwoGroups: IChipsGroup[] = [
    { id: "groupId1", label: "Status", items: flatItemsTwoMembers },
    { id: "groupId2", label: "Vendor", items: flatItemsOneMember },
];

describe("components >", () => {
    describe("chips >", () => {
        let subject: ChipsComponent;

        beforeEach(() => {
            subject = new ChipsComponent(
                {} as NgZone,
                {} as ChipsOverflowService
            );
        });

        describe("getItemsCount()", () => {
            it("should count sum of items correctly", () => {
                subject.itemsSource = {};
                expect(subject.getItemsCount()).toEqual(
                    0,
                    "for empty source {}"
                );
                subject.itemsSource = { flatItems: [] };
                expect(subject.getItemsCount()).toEqual(
                    0,
                    "for {flatItems: []}"
                );
                subject.itemsSource = { groupedItems: [] };
                expect(subject.getItemsCount()).toEqual(
                    0,
                    "for {groupedItems: []}"
                );
                subject.itemsSource = { flatItems: [], groupedItems: [] };
                expect(subject.getItemsCount()).toEqual(
                    0,
                    "for {flatItems: [], groupedItems: []}"
                );
                subject.itemsSource = { flatItems: flatItemsOneMember };
                expect(subject.getItemsCount()).toEqual(
                    1,
                    "for flatItems with single item"
                );
                subject.itemsSource = { flatItems: flatItemsTwoMembers };
                expect(subject.getItemsCount()).toEqual(
                    2,
                    "for flatItems with two items"
                );
                subject.itemsSource = { groupedItems: groupedItemsTwoGroups };
                expect(subject.getItemsCount()).toEqual(3, "for groupedItems");
                subject.itemsSource = {
                    flatItems: flatItemsTwoMembers,
                    groupedItems: groupedItemsTwoGroups,
                };
                expect(subject.getItemsCount()).toEqual(
                    5,
                    "for mixed items source"
                );
            });
        });
        it("should emit remove event", () => {
            const removeEvent = spyOn(subject.chipRemoved, "emit");
            subject.onRemove({ item: flatItemsOneMember[0], group: undefined });
            expect(removeEvent).toHaveBeenCalledWith({
                item: flatItemsOneMember[0],
                group: undefined,
            });
        });
    });
});
