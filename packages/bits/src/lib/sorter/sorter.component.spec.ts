import { ScrollingModule } from "@angular/cdk/scrolling";
import {
    DebugElement,
    NO_ERRORS_SCHEMA,
    SimpleChange,
    SimpleChanges
} from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import _assign from "lodash/assign";
import cloneDeep from "lodash/cloneDeep";

import { ButtonComponent } from "../../lib/button/button.component";
import { CheckboxComponent } from "../../lib/checkbox/checkbox.component";
import { IconComponent } from "../../lib/icon/icon.component";
import { IconService } from "../../lib/icon/icon.service";
import { ImageComponent } from "../../lib/image/image.component";
import { DomUtilService } from "../../services/dom-util.service";
import { EdgeDetectionService } from "../../services/edge-detection.service";
import { LoggerService } from "../../services/log-service";
import { IMenuItem } from "../menu/public-api";
import { PopupComponent } from "../popup-adapter/popup-adapter.component";
import { PopupAdapterModule } from "../popup-adapter/popup-adapter.module";
import { RadioComponent } from "../radio/radio-group.component";
import { RepeatItemComponent } from "../repeat/repeat-item/repeat-item.component";
import { RepeatComponent } from "../repeat/repeat.component";

import { ISortedItem, SorterDirection } from "./public-api";
import { SorterComponent } from "./sorter.component";
import {OverlayComponent} from "../overlay/overlay-component/overlay.component";

fdescribe("components >", () => {
    describe("sorter >", () => {
        let fixture: ComponentFixture<SorterComponent>;
        let component: SorterComponent;
        let debugElement: DebugElement;
        let itemsSource: IMenuItem[];

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ScrollingModule, PopupAdapterModule],
                declarations: [
                    ButtonComponent,
                    SorterComponent,
                    // PopupComponent,
                    OverlayComponent,
                    RepeatComponent,
                    RepeatItemComponent,
                    IconComponent,
                    CheckboxComponent,
                    RadioComponent,
                    ImageComponent,
                ],
                schemas: [NO_ERRORS_SCHEMA],
                providers: [
                    EdgeDetectionService,
                    DomUtilService,
                    LoggerService,
                    IconService,
                ],
            });
            fixture = TestBed.createComponent(SorterComponent);
            component = fixture.componentInstance;
            debugElement = fixture.debugElement;
            itemsSource = [
                {
                    value: "animal",
                    title: "Animal",
                },
                {
                    value: "stone",
                    title: "Stone",
                },
                {
                    value: "fruit",
                    title: "Fruit",
                },
            ];
            component.sortDirection = SorterDirection.ascending;
            component.selectedItem = itemsSource[0].value;
            component.itemsSource = itemsSource;
            component.ngOnChanges({ selectedItem: {} as SimpleChange, itemsSource: {} as SimpleChange });
        });

        describe("ngOnChanges() >", () => {
            it("should populate the popup itemsSource", () => {
                const expectedPopupItemsSource = itemsSource;
                expectedPopupItemsSource[2].isSelected = true;
                component.selectedItem = itemsSource[2].value;
                const changes: SimpleChanges = {
                    itemsSource: { previousValue: {}, currentValue: itemsSource } as SimpleChange,
                };
                component.ngOnChanges(changes);
                expect(component.items[0].itemsSource).toEqual(expectedPopupItemsSource);
            });

            it("should reinitialize the selected item on itemsSource change", () => {
                // @ts-ignore: Suppressing error for testing purposes
                component.selectedItem = undefined;

                const newItemsSource = [{
                    title: "new items source title",
                    value: "new items source value",
                }];
                component.itemsSource = newItemsSource;
                const changes: SimpleChanges = {
                    itemsSource: { previousValue: {}, currentValue: newItemsSource } as SimpleChange,
                };
                component.ngOnChanges(changes);
                expect(component.selectedItem).toEqual(newItemsSource[0].value);
            });

            it("should update the selected item on the popup", () => {
                const expectedPopupItemsSource = cloneDeep(itemsSource);
                expectedPopupItemsSource[1].isSelected = true;
                component.items[0].itemsSource = cloneDeep(expectedPopupItemsSource);
                expectedPopupItemsSource[0].isSelected = false;
                expectedPopupItemsSource[1].isSelected = false;
                expectedPopupItemsSource[2].isSelected = true;

                const newSelectedItem = itemsSource[2].value;
                const changes: SimpleChanges = {
                    selectedItem: { currentValue: newSelectedItem } as SimpleChange,
                };
                component.ngOnChanges(changes);
                expect(component.items[0].itemsSource).toEqual(expectedPopupItemsSource);
            });

            it("should emit the sorterAction when selectedItem changes", () => {
                fixture.detectChanges();
                spyOn(component.sorterAction, "emit");

                const newSelectedItem = itemsSource[2].value;

                const newValue: ISortedItem = { sortBy: newSelectedItem, direction: SorterDirection.ascending };
                const oldValue: ISortedItem = { sortBy: itemsSource[0].value, direction: SorterDirection.ascending };

                const changes: SimpleChanges = {
                    selectedItem: { currentValue: newValue.sortBy, previousValue: oldValue.sortBy } as SimpleChange,
                };

                component.ngOnChanges(changes);

                expect(component.selectedItem).toEqual(newValue.sortBy);
                expect(component.sorterAction.emit).toHaveBeenCalledWith({ newValue, oldValue });
            });
        });

        describe("ngAfterViewInit() >", () => {
            beforeEach(() => {
                component.itemsSource = itemsSource;
                fixture.detectChanges();
            });
            it("should initialize the selectedItem to the first value in the itemsSource if no selectedItem is specified", () => {
                // @ts-ignore: Suppressing error for testing purposes
                component.selectedItem = undefined;
                component.ngAfterViewInit();
                expect(component.selectedItem).toEqual((component.itemsSource[0] as IMenuItem).value);
            });

            it("should initialize the sortDirection to 'asc' if it's set to an invalid value", () => {
                component.sortDirection = "invalid_direction";
                component.ngAfterViewInit();
                expect(component.sortDirection).toEqual(SorterDirection.ascending);
            });

            it("should initialize the sortDirection to 'asc' if no sortDirection is specified", () => {
                component.sortDirection = undefined;
                component.ngAfterViewInit();
                expect(component.sortDirection).toEqual(SorterDirection.ascending);
            });

            it("should initialize the sortConfig", () => {
                const expectedSortConfig = {
                    sortBy: "test",
                    direction: SorterDirection.descending,
                };
                component.selectedItem = expectedSortConfig.sortBy;
                component.sortDirection = expectedSortConfig.direction;
                fixture.detectChanges();
                component.ngAfterViewInit();
                expect((<any>component).sortConfig).toEqual(expectedSortConfig);
            });
        });

        describe("select() >", () => {
            it("should update the sortConfig", () => {
                const expectedSortConfig = {
                    sortBy: "test",
                    direction: SorterDirection.ascending,
                };
                const oldValue = {
                    sortBy: itemsSource[0].value,
                    direction: SorterDirection.ascending,
                };
                component.selectedItem = oldValue.sortBy;
                component.sortDirection = oldValue.direction;
                fixture.detectChanges();

                component.select({ value: expectedSortConfig.sortBy } as IMenuItem);

                expect((<any>component).sortConfig).toEqual(expectedSortConfig);
            });

            it("should emit the sorterAction with the new selection", () => {
                const oldValue = {
                    sortBy: itemsSource[0].value,
                    direction: SorterDirection.ascending,
                };
                component.selectedItem = oldValue.sortBy;
                component.sortDirection = oldValue.direction;
                const item = { title: "Fruits", value: "fruits" };
                const newValue = _assign({}, oldValue, {
                    sortBy: item.value,
                });
                fixture.detectChanges();
                spyOn(component.sorterAction, "emit");

                component.select(item);

                expect(component.sorterAction.emit).toHaveBeenCalledWith({ newValue, oldValue });
            });
        });

        describe("getSelectedItem() >", () => {
            it("should return the correct item", () => {
                component.select(itemsSource[2]);
                expect(component.getSelectedItem()).toEqual(itemsSource[2].value);
            });
        });

        describe("getSortIcon() >", () => {
            it("should sorter contain an arrow icon", () => {
                fixture.detectChanges();
                expect(component.getSortIcon()).toBe("arrow-up");
            });
        });

        describe("toggleSortDirection() >", () => {
            it("should update the sortDirection", () => {
                component.sortDirection = SorterDirection.ascending;
                component.toggleSortDirection();
                expect(component.sortDirection).toEqual(SorterDirection.descending);
            });

            it("should update the sortConfig direction", () => {
                const expectedSortConfigDirection = SorterDirection.descending;
                component.sortDirection = SorterDirection.ascending;
                component.toggleSortDirection();
                expect((<any>component).sortConfig.direction).toEqual(expectedSortConfigDirection);
            });

            it("should emit the sorterAction with the new sorting direction", () => {
                const oldValue = {
                    sortBy: itemsSource[0].value,
                    direction: SorterDirection.ascending,
                };
                const newValue = _assign({}, oldValue, {
                    direction: SorterDirection.descending,
                });
                component.sortDirection = SorterDirection.ascending;
                component.selectedItem = itemsSource[0].value;
                component.select(itemsSource[0]);
                fixture.detectChanges();
                spyOn(component.sorterAction, "emit");

                component.toggleSortDirection();

                expect(component.sorterAction.emit).toHaveBeenCalledWith({ newValue, oldValue });
            });
        });
    });
});
