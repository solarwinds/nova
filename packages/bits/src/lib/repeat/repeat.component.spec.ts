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

import { DragDropModule } from "@angular/cdk/drag-drop";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import noop from "lodash/noop";

import { LoggerService } from "../../services/log-service";
import { CheckboxComponent } from "../checkbox/checkbox.component";
import { RadioComponent } from "../radio/radio-group.component";
import { RepeatItemComponent } from "./repeat-item/repeat-item.component";
import { RepeatComponent } from "./repeat.component";
import { IRepeatItem, IRepeatItemConfig, RepeatSelectionMode } from "./types";

interface IColorRepeatItem extends IRepeatItem {
    name: string;
}

describe("components >", () => {
    describe("repeat >", () => {
        let fixture: ComponentFixture<RepeatComponent<IColorRepeatItem>>;
        let component: RepeatComponent<IColorRepeatItem>;
        let mockItemsSource: IColorRepeatItem[];
        let warningSpy: jasmine.Spy;

        const BLUE_COLOR: IColorRepeatItem = {
            name: "blue",
            disabled: true,
        };
        const GREEN_COLOR: IColorRepeatItem = {
            name: "green",
        };
        const BLACK_COLOR: IColorRepeatItem = {
            name: "black",
        };

        const mockItemConfig: IRepeatItemConfig<IColorRepeatItem> = {
            isDraggable: (item) =>
                item.name === BLUE_COLOR.name || item.name === BLACK_COLOR.name,
            isDisabled: (item) =>
                item.name === GREEN_COLOR.name || item.disabled,
            trackBy: (index, item) => item.name,
        };

        const mockClickEvent = new MouseEvent("click");

        beforeEach(() => {
            mockItemsSource = [BLUE_COLOR, GREEN_COLOR, BLACK_COLOR];

            TestBed.configureTestingModule({
                imports: [ScrollingModule, DragDropModule],
                providers: [LoggerService],
                declarations: [
                    RepeatComponent,
                    RepeatItemComponent,
                    RadioComponent,
                    CheckboxComponent,
                ],
            });

            fixture =
                TestBed.createComponent<RepeatComponent<IColorRepeatItem>>(
                    RepeatComponent
                );

            component = fixture.componentInstance;
            component.itemsSource = mockItemsSource;
            component.selection = [];

            warningSpy = spyOnProperty(
                component.logger,
                "warn"
            ).and.returnValue(noop); // suppress warnings
        });

        it("correct repeat item should be selected on click when selection mode is 'single'", () => {
            component.selectionMode = RepeatSelectionMode.single;
            component.itemClicked(mockClickEvent, component.itemsSource[1]);
            fixture.detectChanges();

            expect(expect(component.selection[0].name).toBe("green"));
        });

        it("second repeat item should be selected when selection mode is 'single'", () => {
            component.selection = [component.itemsSource[1]];
            component.selectionMode = RepeatSelectionMode.single;
            fixture.detectChanges();

            expect(component.isItemSelected(component.itemsSource[0])).toBe(
                false
            );
            expect(component.isItemSelected(component.itemsSource[1])).toBe(
                true
            );
        });

        it("second and third repeat item should be selected when selection mode is 'multi'", () => {
            component.selection = [
                component.itemsSource[1],
                component.itemsSource[2],
            ];
            component.selectionMode = RepeatSelectionMode.multi;
            fixture.detectChanges();

            expect(component.isItemSelected(component.itemsSource[0])).toBe(
                false
            );
            expect(component.isItemSelected(component.itemsSource[1])).toBe(
                true
            );
            expect(component.isItemSelected(component.itemsSource[2])).toBe(
                true
            );
        });

        it("no repeat items should be selected when selection mode is 'none'", () => {
            component.selection = [component.itemsSource[1]];
            fixture.detectChanges();

            expect(component.isItemSelected(component.itemsSource[1])).toBe(
                false
            );
        });

        it("repeat item should not be selected when it is disabled", () => {
            component.selectionMode =
                RepeatSelectionMode.radioWithNonRequiredSelection;
            component.itemClicked(mockClickEvent, component.itemsSource[0]);
            fixture.detectChanges();

            expect(component.isItemSelected(component.itemsSource[0])).toBe(
                false
            );
        });

        it("should select non-selected item when selection mode is 'multi'", () => {
            component.selectionMode = RepeatSelectionMode.multi;
            component.multiSelectionChanged(component.itemsSource[2]);
            fixture.detectChanges();

            expect(component.selection[0].name).toBe("black");
        });

        it("should generate a different selection set when item is deselected in 'multi' mode", () => {
            const mockSelection = [mockItemsSource[0], mockItemsSource[1]];

            component.selection = mockSelection;
            component.selectionMode = RepeatSelectionMode.multi;
            component.multiSelectionChanged(mockItemsSource[0]);
            fixture.detectChanges();

            // this expect covers immutability of source data
            expect(mockSelection).toEqual([
                mockItemsSource[0],
                mockItemsSource[1],
            ]);
            expect(component.selection).toEqual([mockItemsSource[1]]);
        });

        describe("changeDetection > ", () => {
            it("should be triggered on dataSource items update", () => {
                component.itemsSource.push({
                    name: "Magenta Color",
                    color: "Magenta",
                });

                const markForCheckSpy = spyOn(
                    component.changeDetector,
                    "markForCheck"
                );
                fixture.detectChanges();

                expect(markForCheckSpy).toHaveBeenCalledTimes(1);
            });
        });

        describe("getFilters > ", () => {
            it("should report that the selection has changed for single selection modes after an item is clicked", () => {
                Object.values(RepeatSelectionMode).forEach((selectionMode) => {
                    if (
                        selectionMode !== RepeatSelectionMode.none &&
                        selectionMode !== RepeatSelectionMode.multi
                    ) {
                        component.selectionMode = selectionMode;
                        component.itemClicked(
                            mockClickEvent,
                            component.itemsSource[1]
                        );
                        expect(
                            component.getFilters().value.selectionHasChanged
                        ).toEqual(true);
                    }
                });
                expect(
                    component.getFilters().value.selectionHasChanged
                ).toEqual(false);
            });

            it("should report that the selection has not changed for selection mode 'none' after an item is clicked", () => {
                component.selectionMode = RepeatSelectionMode.none;
                component.itemClicked(mockClickEvent, component.itemsSource[1]);
                expect(
                    component.getFilters().value.selectionHasChanged
                ).toEqual(false);
            });
        });

        describe("DND", () => {
            describe("should report correctly disabled items", () => {
                it("> from property", () => {
                    expect(component.isItemDisabled(BLUE_COLOR)).toBeTruthy();
                    expect(component.isItemDisabled(GREEN_COLOR)).toBeFalsy();

                    // when disabled property is not specified the item is considered enabled
                    expect(component.isItemDisabled(BLACK_COLOR)).toBeFalsy();
                });

                it("> from individual item config", () => {
                    component.itemConfig = mockItemConfig;

                    [BLUE_COLOR, GREEN_COLOR].forEach((color) => {
                        expect(component.isItemDisabled(color)).toBeTruthy(
                            `Color '${color.name}' should be disabled`
                        );
                    });
                    [BLACK_COLOR].forEach((color) => {
                        expect(component.isItemDisabled(color)).toBeFalsy(
                            `Color '${color.name}' should NOT be disabled`
                        );
                    });
                });
            });

            it("should report item as NOT draggable if the item is disabled", () => {
                const color = { name: "orange", disabled: true };
                expect(component.isItemDraggable(color)).toBeFalsy(
                    `Color '${color.name}' should NOT be draggable`
                );
            });

            it("should report correctly draggable items", () => {
                component.itemConfig = mockItemConfig;

                [BLUE_COLOR, GREEN_COLOR].forEach((color) => {
                    expect(component.isItemDraggable(color)).toBeFalsy(
                        `Color '${color.name}' should NOT be draggable`
                    );
                });
                [BLACK_COLOR].forEach((color) => {
                    expect(component.isItemDraggable(color)).toBeTruthy(
                        `Color '${color.name}' should be draggable`
                    );
                });
            });

            it("should warn when checking if an item is draggable when the component is NOT draggable", () => {
                component.draggable = false;
                component.itemConfig = {
                    isDraggable: () => true,
                };
                component.isItemDraggable({ name: "orange" });

                expect(warningSpy).toHaveBeenCalledTimes(1);
            });

            describe("draggable >", () => {
                it("should initialize CDK DND once when draggable is true WITHOUT virtual scroll", () => {
                    const createDropListSpy = spyOn(
                        component.dragDropService,
                        "createDropList"
                    ).and.callThrough();

                    component.draggable = true;
                    // make sure there's no virtual scroll
                    component.virtualScroll = false;

                    expect(component.dropListArea).toBeUndefined();
                    expect(component.dropListRef).toBeUndefined();

                    fixture.detectChanges();

                    expect(component.dropListArea).toBeDefined();
                    expect(component.dropListRef).toBeDefined();

                    expect(createDropListSpy).toHaveBeenCalledTimes(1);
                });

                it("should disable sorting when it becomes NOT draggable", () => {
                    const reorderableChangeSpy = spyOn(
                        component.reorderableChange,
                        "emit"
                    );

                    component.draggable = true;
                    component.reorderable = true;
                    fixture.detectChanges();

                    component.draggable = false;
                    expect(component.reorderable).toBeFalsy();
                    expect(reorderableChangeSpy).toHaveBeenCalledWith(false);
                });
            });

            describe("reorderable >", () => {
                it("should warn when reorderable=true is specified and the component is NOT draggable", () => {
                    component.draggable = false;
                    component.reorderable = true;
                    fixture.detectChanges();

                    expect(warningSpy).toHaveBeenCalledTimes(1);
                    // expect(warningSpy.mostRecentCall.args).toBe(["'reorderable' property must be used only when draggable is true"]);
                });

                it("should enable draggable when reorderable=true is specified", () => {
                    const draggableChangeSpy = spyOn(
                        component.draggableChange,
                        "emit"
                    );
                    expect(component.draggable).toBeUndefined();

                    component.reorderable = true;
                    fixture.detectChanges();

                    expect(draggableChangeSpy).toHaveBeenCalledWith(true);
                    expect(component.draggable).toBeTruthy();
                });

                it("should update CDK droplist sorting when reorderable changes", () => {
                    component.reorderable = true;
                    fixture.detectChanges();

                    expect(component.dropListRef.sortingDisabled).toBe(false);

                    component.reorderable = false;

                    expect(component.dropListRef.sortingDisabled).toBe(true);
                });
            });

            it("cleanup CDK when destroyed", () => {
                component.draggable = true;
                fixture.detectChanges();

                expect(component.dropListRef).toBeDefined();
                const dropListDisposeSpy = spyOn(
                    component.dropListRef,
                    "dispose"
                );

                component.ngOnDestroy();

                expect(dropListDisposeSpy).toHaveBeenCalledTimes(1);
            });
        });
    });
});
