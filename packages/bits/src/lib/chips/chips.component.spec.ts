import { NgZone } from "@angular/core";

import { ChipsOverflowService } from "./chips-overflow.service";
import { ChipsComponent } from "./chips.component";
import { IChipsGroup, IChipsItem } from "./public-api";

const flatItemsTwoMembers: IChipsItem[] = [
    {id: "flatId1", label: "Down"},
    {id: "flatId2", label: "Ok"},
];
const flatItemsOneMember: IChipsItem[] = [
    {id: "flatId1", label: "Down"},
];
const groupedItemsTwoGroups: IChipsGroup[] = [
    {id: "groupId1", label: "Status", items: flatItemsTwoMembers},
    {id: "groupId2", label: "Vendor", items: flatItemsOneMember},
];

describe("components >", () => {
    describe("chips >", () => {
        let subject: ChipsComponent;

        beforeEach(() => {
            subject = new ChipsComponent({} as NgZone, {} as ChipsOverflowService);
        });

        describe("getItemsCount()", () => {

            it("should count sum of items correctly", () => {
                subject.itemsSource = {};
                expect(subject.getItemsCount()).toEqual(0, "for empty source {}");
                subject.itemsSource = {flatItems: []};
                expect(subject.getItemsCount()).toEqual(0, "for {flatItems: []}");
                subject.itemsSource = {groupedItems: []};
                expect(subject.getItemsCount()).toEqual(0, "for {groupedItems: []}");
                subject.itemsSource = {flatItems: [], groupedItems: []};
                expect(subject.getItemsCount()).toEqual(0, "for {flatItems: [], groupedItems: []}");
                subject.itemsSource = {flatItems: flatItemsOneMember};
                expect(subject.getItemsCount()).toEqual(1, "for flatItems with single item");
                subject.itemsSource = {flatItems: flatItemsTwoMembers};
                expect(subject.getItemsCount()).toEqual(2, "for flatItems with two items");
                subject.itemsSource = {groupedItems: groupedItemsTwoGroups};
                expect(subject.getItemsCount()).toEqual(3, "for groupedItems");
                subject.itemsSource = {flatItems: flatItemsTwoMembers, groupedItems: groupedItemsTwoGroups};
                expect(subject.getItemsCount()).toEqual(5, "for mixed items source");
            });
        });
        it("should emit remove event", () => {
            const removeEvent = spyOn(subject.chipRemoved, "emit");
            subject.onRemove({item: flatItemsOneMember[0], group: undefined});
            expect(removeEvent).toHaveBeenCalledWith({item: flatItemsOneMember[0], group: undefined});
        });
    });
});
