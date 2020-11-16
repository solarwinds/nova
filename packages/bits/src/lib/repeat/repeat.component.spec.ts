import {DragDropModule} from "@angular/cdk/drag-drop";
import { ScrollingModule } from "@angular/cdk/scrolling";
import {ComponentFixture, TestBed} from "@angular/core/testing";
import noop from "lodash/noop";

import {LoggerService} from "../../services/log-service";
import { CheckboxComponent } from "../checkbox/checkbox.component";
import { RadioComponent } from "../radio/radio-group.component";

import { RepeatItemComponent } from "./repeat-item/repeat-item.component";
import { RepeatComponent } from "./repeat.component";
import {IRepeatItem, IRepeatItemConfig, RepeatSelectionMode} from "./types";

interface IColorRepeatItem extends IRepeatItem {
    name: string;
}

describe("components >", () => {
    describe("repeat >", () => {
        let fixture: ComponentFixture<RepeatComponent>;
        let subject: RepeatComponent;
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
            isDraggable: (item) => item.name === BLUE_COLOR.name || item.name === BLACK_COLOR.name,
            isDisabled: item => item.name === GREEN_COLOR.name || item.disabled,
            trackBy: (index, item) => item.name,
        };

        const mockClickEvent = { type: "click" } as Event;

        beforeEach(() => {
            mockItemsSource = [BLUE_COLOR, GREEN_COLOR, BLACK_COLOR];

            TestBed.configureTestingModule({
                imports: [ScrollingModule, DragDropModule],
                providers: [
                    LoggerService,
                ],
                declarations: [
                    RepeatComponent,
                    RepeatItemComponent,
                    RadioComponent,
                    CheckboxComponent,
                ],
            });

            fixture = TestBed.createComponent(RepeatComponent);

            subject = fixture.componentInstance;
            subject.itemsSource = mockItemsSource;
            subject.selection = [];

            warningSpy = spyOnProperty(subject.logger, "warn").and.returnValue(noop); // suppress warnings
        });

        it("correct repeat item should be selected on click when selection mode is 'single'", () => {
            subject.selectionMode = RepeatSelectionMode.single;
            subject.itemClicked(mockClickEvent, subject.itemsSource[1]);
            fixture.detectChanges();

            expect(expect(subject.selection[0].name).toBe("green"));
        });

        it("second repeat item should be selected when selection mode is 'single'", () => {
            subject.selection = [subject.itemsSource[1]];
            subject.selectionMode = RepeatSelectionMode.single;
            fixture.detectChanges();

            expect(subject.isItemSelected(subject.itemsSource[0]))
                .toBe(false);
            expect(subject.isItemSelected(subject.itemsSource[1]))
                .toBe(true);
        });

        it("second and third repeat item should be selected when selection mode is 'multi'", () => {
            subject.selection = [subject.itemsSource[1], subject.itemsSource[2]];
            subject.selectionMode = RepeatSelectionMode.multi;
            fixture.detectChanges();

            expect(subject.isItemSelected(subject.itemsSource[0]))
                .toBe(false);
            expect(subject.isItemSelected(subject.itemsSource[1]))
                .toBe(true);
            expect(subject.isItemSelected(subject.itemsSource[2]))
                .toBe(true);
        });

        it("no repeat items should be selected when selection mode is 'none'", () => {
            subject.selection = [subject.itemsSource[1]];
            fixture.detectChanges();

            expect(subject.isItemSelected(subject.itemsSource[1]))
                .toBe(false);
        });

        it("repeat item should not be selected when it is disabled", () => {
            subject.selectionMode = RepeatSelectionMode.radioWithNonRequiredSelection;
            subject.itemClicked(mockClickEvent, subject.itemsSource[0]);
            fixture.detectChanges();

            expect(subject.isItemSelected(subject.itemsSource[0]))
                .toBe(false);
        });

        it("should select non-selected item when selection mode is 'multi'", () => {
            subject.selectionMode = RepeatSelectionMode.multi;
            subject.multiSelectionChanged(subject.itemsSource[2]);
            fixture.detectChanges();

            expect(subject.selection[0].name).toBe("black");
        });

        it("should generate a different selection set when item is deselected in 'multi' mode", () => {
            const mockSelection = [mockItemsSource[0], mockItemsSource[1]];

            subject.selection = mockSelection;
            subject.selectionMode = RepeatSelectionMode.multi;
            subject.multiSelectionChanged(mockItemsSource[0]);
            fixture.detectChanges();

            // this expect covers immutability of source data
            expect(mockSelection).toEqual([mockItemsSource[0], mockItemsSource[1]]);
            expect(subject.selection).toEqual([mockItemsSource[1]]);
        });

        describe("changeDetection > ", () => {
            it("should be triggered on dataSource items update", () => {

                subject.itemsSource.push({color: "Magenta"});

                const markForCheckSpy = spyOn(subject.changeDetector, "markForCheck");
                fixture.detectChanges();

                expect(markForCheckSpy).toHaveBeenCalledTimes(1);
            });
        });

        describe("getFilters > ", () => {
            it("should report that the selection has changed for single selection modes after an item is clicked", () => {
                Object.values(RepeatSelectionMode).forEach(selectionMode => {
                    if (selectionMode !== RepeatSelectionMode.none && selectionMode !== RepeatSelectionMode.multi) {
                        subject.selectionMode = selectionMode;
                        subject.itemClicked(mockClickEvent, subject.itemsSource[1]);
                        expect(subject.getFilters().value.selectionHasChanged).toEqual(true);
                    }
                });
                expect(subject.getFilters().value.selectionHasChanged).toEqual(false);
            });

            it("should report that the selection has not changed for selection mode 'none' after an item is clicked", () => {
                subject.selectionMode = RepeatSelectionMode.none;
                subject.itemClicked(mockClickEvent, subject.itemsSource[1]);
                expect(subject.getFilters().value.selectionHasChanged).toEqual(false);
            });
        });

        describe("DND", () => {
            describe ("should report correctly disabled items", () => {
                it("> from property", () => {
                    expect(subject.isItemDisabled(BLUE_COLOR)).toBeTruthy();
                    expect(subject.isItemDisabled(GREEN_COLOR)).toBeFalsy();

                    // when disabled property is not specified the item is considered enabled
                    expect(subject.isItemDisabled(BLACK_COLOR)).toBeFalsy();
                });

                it("> from individual item config", () => {
                    subject.itemConfig = mockItemConfig;

                    [BLUE_COLOR, GREEN_COLOR].forEach(color => {
                        expect(subject.isItemDisabled(color)).toBeTruthy(`Color '${color.name}' should be disabled`);
                    });
                    [BLACK_COLOR].forEach(color => {
                        expect(subject.isItemDisabled(color)).toBeFalsy(`Color '${color.name}' should NOT be disabled`);
                    });
                });
            });

            it ("should report item as NOT draggable if the item is disabled", () => {
                const color = {name: "orange", disabled: true};
                expect(subject.isItemDraggable(color)).toBeFalsy(`Color '${color.name}' should NOT be draggable`);
            });

            it ("should report correctly draggable items", () => {
                subject.itemConfig = mockItemConfig;

                [BLUE_COLOR, GREEN_COLOR].forEach(color => {
                    expect(subject.isItemDraggable(color)).toBeFalsy(`Color '${color.name}' should NOT be draggable`);
                });
                [BLACK_COLOR].forEach(color => {
                    expect(subject.isItemDraggable(color)).toBeTruthy(`Color '${color.name}' should be draggable`);
                });
            });

            it("should warn when checking if an item is draggable when the component is NOT draggable", () => {
                subject.draggable = false;
                subject.itemConfig = {
                    isDraggable: () => true,
                };
                subject.isItemDraggable({name: "orange"});

                expect(warningSpy).toHaveBeenCalledTimes(1);
            });

            describe("draggable >", () => {
                it("should initialize CDK DND once when draggable is true WITHOUT virtual scroll", () => {
                    const createDropListSpy = spyOn(subject.dragDropService, "createDropList").and.callThrough();

                    subject.draggable = true;
                    // make sure there's no virtual scroll
                    subject.virtualScroll = false;

                    expect(subject.dropListArea).toBeUndefined();
                    expect(subject.dropListRef).toBeUndefined();

                    fixture.detectChanges();

                    expect(subject.dropListArea).toBeDefined();
                    expect(subject.dropListRef).toBeDefined();

                    expect(createDropListSpy).toHaveBeenCalledTimes(1);
                });

                it("should disable sorting when it becomes NOT draggable", () => {
                    const reorderableChangeSpy = spyOn(subject.reorderableChange, "emit");

                    subject.draggable = true;
                    subject.reorderable = true;
                    fixture.detectChanges();

                    subject.draggable = false;
                    expect(subject.reorderable).toBeFalsy();
                    expect(reorderableChangeSpy).toHaveBeenCalledWith(false);
                });
            });

            describe("reorderable >", () => {
                it("should warn when reorderable=true is specified and the component is NOT draggable", () => {
                    subject.draggable = false;
                    subject.reorderable = true;
                    fixture.detectChanges();

                    expect(warningSpy).toHaveBeenCalledTimes(1);
                    // expect(warningSpy.mostRecentCall.args).toBe(["'reorderable' property must be used only when draggable is true"]);
                });

                it("should enable draggable when reorderable=true is specified", () => {
                    const draggableChangeSpy = spyOn(subject.draggableChange, "emit");
                    expect(subject.draggable).toBeUndefined();

                    subject.reorderable = true;
                    fixture.detectChanges();

                    expect(draggableChangeSpy).toHaveBeenCalledWith(true);
                    expect(subject.draggable).toBeTruthy();
                });

                it("should update CDK droplist sorting when reorderable changes", () => {
                    subject.reorderable = true;
                    fixture.detectChanges();

                    expect(subject.dropListRef.sortingDisabled).toBe(false);

                    subject.reorderable = false;

                    expect(subject.dropListRef.sortingDisabled).toBe(true);
                });
            });

            it ("cleanup CDK when destroyed", () => {
                subject.draggable = true;
                fixture.detectChanges();

                expect(subject.dropListRef).toBeDefined();
                const dropListDisposeSpy = spyOn(subject.dropListRef, "dispose");

                subject.ngOnDestroy();

                expect(dropListDisposeSpy).toHaveBeenCalledTimes(1);
            });
        });
    });
});
