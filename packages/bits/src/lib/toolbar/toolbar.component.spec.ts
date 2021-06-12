import { Component, NO_ERRORS_SCHEMA, TRANSLATIONS, TRANSLATIONS_FORMAT } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import noop from "lodash/noop";

import { ButtonComponent } from "../../lib/button/button.component";
import { IconComponent } from "../../lib/icon/icon.component";
import { IconService } from "../../lib/icon/icon.service";
import { LoggerService } from "../../services/log-service";


import { IToolbarSelectionState, ToolbarItemType } from "./public-api";
import { ToolbarGroupComponent } from "./toolbar-group.component";
import { ToolbarItemComponent } from "./toolbar-item.component";
import { ToolbarSplitterComponent } from "./toolbar-splitter.component";
import { ToolbarComponent } from "./toolbar.component";
import { KEYBOARD_CODE } from "../../constants";
import { ToolbarKeyboardService } from "./toolbar-keyboard.service";

@Component({
    selector: "nui-test-cmp",
    template: `
        <nui-toolbar>
            <nui-toolbar-group title="g1">
                <nui-toolbar-item type="primary" icon="edit" title="edit">
                </nui-toolbar-item>
                <nui-toolbar-item type="primary" icon="edit" title="edit">
                </nui-toolbar-item>
                <nui-toolbar-item type="primary" icon="edit" title="edit">
                </nui-toolbar-item>
            </nui-toolbar-group>
            <nui-toolbar-group title="g2">
                <nui-toolbar-item type="primary" icon="add" title="add">
                </nui-toolbar-item>
                <nui-toolbar-item type="secondary" icon="add" title="add">
                </nui-toolbar-item>
                <nui-toolbar-item type="secondary" icon="add" title="add">
                </nui-toolbar-item>
            </nui-toolbar-group>
        </nui-toolbar> `,
})
class TestWrapperComponent { }

describe("components >", () => {
    describe("toolbar >", () => {
        let component: ToolbarComponent;
        let fixture: ComponentFixture<TestWrapperComponent>;
        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [
                    TestWrapperComponent,
                    ButtonComponent,
                    ToolbarComponent,
                    ToolbarItemComponent,
                    ToolbarGroupComponent,
                    ToolbarSplitterComponent,
                    IconComponent,
                ],
                schemas: [NO_ERRORS_SCHEMA],
                providers: [
                    IconService,
                    LoggerService,
                    { provide: TRANSLATIONS_FORMAT, useValue: "xlf" },
                    { provide: TRANSLATIONS, useValue: "" },
                    ToolbarKeyboardService,
                ],
            });
        });

        beforeEach(() => {
            fixture = TestBed.createComponent(TestWrapperComponent);
            component = fixture.debugElement.children[0].componentInstance;
            fixture.detectChanges();
        });

        describe("ngAfterViewInit >", () => {
            it("should add visible group to commandGroups array", () => {
                spyOn(component, "splitToolbarItems").and.callFake(noop);
                spyOn(component, "moveToolbarItems").and.callFake(noop);
                component.ngAfterViewInit();
                fixture.detectChanges();
                expect(component.commandGroups.length).toBe(2);
                expect(component.splitToolbarItems).toHaveBeenCalled();
                expect(component.moveToolbarItems).toHaveBeenCalled();
            });

            it("should visible group contain 3 items", () => {
                spyOn(component, "splitToolbarItems").and.callFake(noop);
                spyOn(component, "moveToolbarItems").and.callFake(noop);
                component.ngAfterViewInit();
                fixture.detectChanges();
                expect(component.commandGroups[0].items.length).toBe(3);
                expect(component.splitToolbarItems).toHaveBeenCalled();
                expect(component.moveToolbarItems).toHaveBeenCalled();
            });
        });
        describe("splitToolbarItems >", () => {
            it("should split items", () => {
                component.commandGroups = [];
                component.menuGroups = [];
                component.splitToolbarItems();
                const allVisibleItems: number
                    = component.commandGroups[0].items.length + component.commandGroups[1].items.length;
                expect(component.menuGroups[0].items.length).toBe(2);
                expect(allVisibleItems).toBe(4);
                expect(component.showMenu).toBeTruthy();
            });
        });
        describe("moveToolbarItems >", () => {
            it("should call splitToolbarItems method", () => {
                spyOn(component, "splitToolbarItems").and.callThrough();
                component.moveToolbarItems();
                expect(component.splitToolbarItems).toHaveBeenCalled();
                expect(component.commandGroups.length).toBe(2);
                expect(component.commandGroups[0].items.length).toBe(3);
                expect(component.menuGroups.length).toBe(1);
                expect(component.menuGroups[0].items.length).toBe(2);
            });
        });
        describe("makeAllItemsVisible >", () => {
            it("should assign true to menuHidden field of all items", () => {
                spyOn(component, "splitToolbarItems").and.callThrough();
                component.makeAllItemsVisible();
                let isAllVisible: boolean = true;
                component.groups.forEach((group: ToolbarGroupComponent) => {
                    group.items.forEach((item: ToolbarItemComponent) => {
                        if (item.type === ToolbarItemType.primary) {
                            isAllVisible = item.menuHidden === false;
                        }
                    });
                });
                expect(component.splitToolbarItems).toHaveBeenCalled();
                expect(isAllVisible).toBeTruthy();
            });
        });
        describe("handleSelectionState >", () => {
            it("should change title to '1 of 23 selected' with selection items", () => {
                component.selectionEnabled = true;
                component.selectedItems = {
                    current: 1,
                    total: 23,
                };
                expect(component.handleSelectionState()).toBe("1 of 23 selected");
            });
            it("should change title to 'All selected' with selection items", () => {
                component.selectionEnabled = true;
                component.selectedItems = {
                    current: 23,
                    total: 23,
                };
                expect(component.handleSelectionState()).toBe("All 23 selected");
            });
            it("should return nothing when isSelected set to false", () => {
                component.selectionEnabled = false;
                expect(component.handleSelectionState()).toBeUndefined();
            });
            it("should return nothing when selected 0 items", () => {
                component.selectedItems = {} as IToolbarSelectionState;
                expect(component.handleSelectionState()).toBeUndefined();
            });
        });

        describe("toolbarKeyboardService >", () => {
            const keyboardEventMock: KeyboardEvent = {
                code: KEYBOARD_CODE.ARROW_LEFT,
                preventDefault: () => {},
            } as KeyboardEvent;

            it("should call keyboardService 'onKeyDown' method", () => {
                const spy = spyOn(component["keyboardService"], "onKeyDown");

                component.onKeyDown(keyboardEventMock);

                expect(spy).toHaveBeenCalledWith(keyboardEventMock);
            });

            it("should call keyboardService 'disableFocusForMoreBtn' and 'initService' on ngAfterViewInit hook", () => {
                const disableFocusForMoreBtnSpy = spyOn(component["keyboardService"], "disableFocusForMoreBtn");
                const initServiceSpy = spyOn(component["keyboardService"], "initService");

                component.ngAfterViewInit();
                expect(disableFocusForMoreBtnSpy).toHaveBeenCalled();
                expect(initServiceSpy).toHaveBeenCalled();
            });
        });
    });
});
