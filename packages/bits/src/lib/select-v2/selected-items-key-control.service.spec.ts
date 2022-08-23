import { EventEmitter } from "@angular/core";

import { SelectedItemsKeyControlService } from "./selected-items-key-control.service";

const getItemMock = (title: string) => ({
    cdRef: {
        context: {
            item: {
                label: title,
            },
        },
    },
});

describe("components > ", () => {
    const announcerMock = jasmine.createSpyObj("liveAnnouncer", ["announce"]);
    const queryListMock = {
        dirty: false,
        first: undefined,
        last: undefined,
        length: 0,
        _result: [],
        changes: new EventEmitter(),
    };
    const comboboxMock = {
        inputElement: { selectionStart: null },
        manualDropdownControl: false,
        deselectItem: () => {},
        hideDropdown: () => {},
    };
    let testService: SelectedItemsKeyControlService;

    describe("combobox > SelectedItemsKeyControlService", () => {
        beforeEach(() => {
            testService = new SelectedItemsKeyControlService(announcerMock);

            testService.initSelectedItemsKeyManager(
                queryListMock as any,
                comboboxMock as any
            );
        });

        describe("onKeydown", () => {
            const keyBoardEventMock = {
                target: { selectionStart: 0 },
                keyCode: NaN,
            };

            it("should call 'deactivateSelectedItems' if key not allowed", () => {
                const spy = spyOn(testService, "deactivateSelectedItems");
                testService.onKeydown(keyBoardEventMock as any);

                expect(spy).toHaveBeenCalled();
            });

            it("should hide dropdown if no active item and no manualDropdownControl", () => {
                const spy = spyOn(comboboxMock, "hideDropdown");
                const event = { ...keyBoardEventMock, ...{ keyCode: 8 } };
                testService.onKeydown(event as any);

                expect(spy).toHaveBeenCalled();
            });

            it("should call selectedItemsKeyManager 'onKeydown' when left key was pressed ", () => {
                const spy = spyOn(
                    testService["selectedItemsKeyManager"],
                    "onKeydown"
                );
                const event = { ...keyBoardEventMock, ...{ keyCode: 37 } };
                testService.onKeydown(event as any);

                expect(spy).toHaveBeenCalledWith(event as any);
            });

            it("should call liveAnnouncer 'announce' method when left key was pressed", () => {
                const itemTitle = "Item";
                const activeItem = getItemMock(itemTitle);

                spyOnProperty(testService, "activeItem" as any).and.returnValue(
                    activeItem as any
                );

                const event = { ...keyBoardEventMock, ...{ keyCode: 37 } };
                spyOn(testService["selectedItemsKeyManager"], "onKeydown");
                testService.onKeydown(event as any);

                expect(testService.liveAnnouncer.announce).toHaveBeenCalled();
            });

            it("should call handleRightArrow if right arrow was pressed ", () => {
                const itemTitle = "Item";
                const activeItem = getItemMock(itemTitle);

                spyOnProperty(testService, "activeItem" as any).and.returnValue(
                    activeItem as any
                );
                const spy = spyOn(testService, "handleRightArrow" as any);
                const event = { ...keyBoardEventMock, ...{ keyCode: 39 } };
                testService.onKeydown(event as any);

                expect(spy).toHaveBeenCalledWith(event as any);
            });

            it("should call deselect item on backspace press", () => {
                const itemTitle = "Item";
                const activeItem = getItemMock(itemTitle);

                spyOnProperty(testService, "activeItem" as any).and.returnValue(
                    activeItem as any
                );

                const spy = spyOn(testService, "deselectItem" as any);
                const event = { ...keyBoardEventMock, ...{ keyCode: 8 } };

                testService.onKeydown(event as any);

                expect(spy).toHaveBeenCalled();
            });

            it("should call 'calculateActiveSelectedItemIndex' on backspace press", () => {
                const itemTitle = "Item";
                const activeItem = getItemMock(itemTitle);

                spyOnProperty(testService, "activeItem" as any).and.returnValue(
                    activeItem as any
                );
                spyOnProperty(
                    testService["selectedItemsKeyManager"],
                    "activeItemIndex" as any
                ).and.returnValue(1);

                const spy = spyOn(
                    testService,
                    "calculateActiveSelectedItemIndex" as any
                );
                const event = { ...keyBoardEventMock, ...{ keyCode: 8 } };

                testService.onKeydown(event as any);

                expect(spy).toHaveBeenCalled();
            });

            it("should call combobox 'deselectItem' on backspace press", () => {
                const itemTitle = "Item";
                const activeItem = getItemMock(itemTitle);
                const mockIndex = 1;

                spyOnProperty(testService, "activeItem" as any).and.returnValue(
                    activeItem as any
                );
                spyOnProperty(
                    testService["selectedItemsKeyManager"],
                    "activeItemIndex" as any
                ).and.returnValue(mockIndex);

                const spy = spyOn(comboboxMock, "deselectItem" as any);
                const event = { ...keyBoardEventMock, ...{ keyCode: 8 } };

                testService.onKeydown(event as any);

                expect(spy).toHaveBeenCalledWith(mockIndex);
            });
        });

        describe("deactivateSelectedItems", () => {
            it("should call 'setActiveItem' method", () => {
                const spy = spyOn(
                    testService["selectedItemsKeyManager"],
                    "setActiveItem"
                );

                testService.deactivateSelectedItems();

                expect(spy).toHaveBeenCalledWith(-1);
            });

            it("should reset activeSelectedItemIndex to undefined", () => {
                spyOn(testService["selectedItemsKeyManager"], "setActiveItem");

                testService["activeSelectedItemIndex"] = 1;
                testService.deactivateSelectedItems();

                expect(testService["activeSelectedItemIndex"]).toBeUndefined();
            });
        });
    });
});
