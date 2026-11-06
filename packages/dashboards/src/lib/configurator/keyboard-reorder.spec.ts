import { ChangeDetectorRef } from "@angular/core";
import { fakeAsync, flush } from "@angular/core/testing";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { Subject } from "rxjs";

import { DialogService, EventBus, IEvent, LoggerService } from "@nova-ui/bits";

import { PizzagnaService } from "../pizzagna/services/pizzagna.service";
import { KpiColorComparatorsRegistryService } from "../services/kpi-color-comparators-registry.service";
import { TableFormatterRegistryService } from "../services/table-formatter-registry.service";
import { ItemsDynamicComponent } from "./components/items-dynamic/items-dynamic.component";
import { BackgroundColorRulesConfigurationComponent } from "./components/widgets/configurator-items/background-color-rules-configuration/background-color-rules-configuration.component";
import { TableColumnsConfigurationV2Component } from "./components/widgets/table/columns-editor-v2/table-columns-configuration-v2.component";
import { KeyboardReorder } from "./keyboard-reorder";
import { ConfiguratorDataSourceManagerService } from "./services/configurator-data-source-manager.service";

describe("Configurator keyboard reordering", () => {
    let handle: HTMLDivElement;

    beforeEach(() => {
        handle = document.createElement("div");
        handle.tabIndex = 0;
        document.body.appendChild(handle);
    });

    afterEach(() => handle.remove());

    function connect<T>(controller: KeyboardReorder<T>, item: T): void {
        handle.addEventListener("keydown", event =>
            controller.onKeydown(event, item)
        );
        handle.addEventListener("blur", () => controller.finish());
        handle.focus();
    }

    function press(key: string, init: KeyboardEventInit = {}): KeyboardEvent {
        const event = new KeyboardEvent("keydown", {
            key,
            bubbles: true,
            cancelable: true,
            ...init,
        });
        handle.dispatchEvent(event);
        return event;
    }

    describe("shared interaction", () => {
        let items: string[];
        let disabled: boolean;
        let controller: KeyboardReorder<string>;
        let move: jasmine.Spy;

        beforeEach(() => {
            items = ["a", "b", "c"];
            disabled = false;
            move = jasmine
                .createSpy("move")
                .and.callFake((from: number, to: number) => {
                    items.splice(to, 0, ...items.splice(from, 1));
                });
            controller = new KeyboardReorder(
                () => items,
                move,
                () => disabled
            );
            connect(controller, "a");
        });

        it("picks up, moves repeatedly, retains focus and restores the original position", () => {
            press(" ");
            expect(controller.activeItem).toBe("a");
            press("ArrowDown");
            press("ArrowDown");
            expect(items).toEqual(["b", "c", "a"]);
            expect(controller.announcement).toContain("position 3 of 3");
            expect(document.activeElement).toBe(handle);
            press("Escape");
            expect(items).toEqual(["a", "b", "c"]);
            expect(controller.activeItem).toBeUndefined();
            expect(controller.announcement).toContain(
                "Original order restored"
            );
        });

        for (const key of [" ", "Enter"]) {
            it(`finishes with ${key === " " ? "Space" : key}`, () => {
                press(key);
                press("ArrowDown");
                press(key);
                expect(items).toEqual(["b", "a", "c"]);
                expect(controller.activeItem).toBeUndefined();
                expect(controller.announcement).toContain("finished");
            });
        }

        it("ignores repeated activation without dropping or scrolling", () => {
            press(" ");
            expect(press(" ", { repeat: true }).defaultPrevented).toBeTrue();
            expect(controller.activeItem).toBe("a");
            expect(move).not.toHaveBeenCalled();
        });

        it("keeps the moved handle scrolled into view", () => {
            spyOn(handle, "scrollIntoView");
            press("Enter");
            press("ArrowDown");
            expect(handle.scrollIntoView).toHaveBeenCalledWith({
                block: "nearest",
                inline: "nearest",
            });
        });

        it("does not capture arrows before pickup or modified keys", () => {
            expect(press("ArrowDown").defaultPrevented).toBeFalse();
            for (const modifier of ["altKey", "ctrlKey", "metaKey"]) {
                expect(
                    press("Enter", { [modifier]: true }).defaultPrevented
                ).toBeFalse();
            }
            expect(controller.activeItem).toBeUndefined();
        });

        it("ignores key events from nested controls", () => {
            const nested = document.createElement("button");
            handle.appendChild(nested);
            nested.dispatchEvent(
                new KeyboardEvent("keydown", { key: "Enter", bubbles: true })
            );
            expect(controller.activeItem).toBeUndefined();
        });

        it("does not pick up a disabled item or move past a boundary", () => {
            disabled = true;
            press("Enter");
            expect(controller.activeItem).toBeUndefined();
            disabled = false;
            press("Enter");
            press("ArrowUp");
            expect(move).not.toHaveBeenCalled();
            expect(controller.announcement).toContain("already first");
            press("ArrowDown");
            press("ArrowDown");
            press("ArrowDown");
            expect(items).toEqual(["b", "c", "a"]);
            expect(controller.announcement).toContain("already last");
        });

        it("finishes on blur and leaves Escape available to the surrounding dialog", () => {
            press("Enter");
            press("ArrowDown");
            handle.blur();
            expect(controller.activeItem).toBeUndefined();
            expect(items).toEqual(["b", "a", "c"]);
            expect(press("Escape").defaultPrevented).toBeFalse();
        });

        it("does not finish on the temporary blur caused by a DOM move", () => {
            move.and.callFake((from: number, to: number) => {
                handle.blur();
                items.splice(to, 0, ...items.splice(from, 1));
            });
            press("Enter");
            press("ArrowDown");
            expect(controller.activeItem).toBe("a");
            expect(document.activeElement).toBe(handle);
        });

        for (const change of ["remove", "append", "disable", "reorder"]) {
            it(`cancels without reverting external changes: ${change}`, () => {
                press("Enter");
                if (change === "remove") {
                    items.shift();
                } else if (change === "append") {
                    items.push("d");
                } else if (change === "disable") {
                    disabled = true;
                } else {
                    items.reverse();
                }
                const externalOrder = [...items];
                press("Escape");
                expect(items).toEqual(externalOrder);
                expect(move).not.toHaveBeenCalled();
                expect(controller.activeItem).toBeUndefined();
                expect(controller.announcement).toContain(
                    "no longer available"
                );
            });
        }
    });

    for (const kind of ["items", "columns", "rules"]) {
        describe(`${kind} integration`, () => {
            let controller:
                | KeyboardReorder<string>
                | KeyboardReorder<FormGroup>;
            let order: () => string[];
            let remove: () => void;
            let destroy: () => void;
            let disable: () => void;
            let valueEvents: string[][];

            beforeEach(() => {
                const detector = jasmine.createSpyObj<ChangeDetectorRef>(
                    "ChangeDetectorRef",
                    ["markForCheck", "detectChanges"]
                );
                const pizzagna = jasmine.createSpyObj<PizzagnaService>(
                    "PizzagnaService",
                    ["removeComponents"]
                );
                const builder = new FormBuilder();
                valueEvents = [];
                if (kind === "items") {
                    const component = new ItemsDynamicComponent(
                        detector,
                        pizzagna,
                        jasmine.createSpyObj<LoggerService>("LoggerService", [
                            "error",
                        ]),
                        builder
                    );
                    component.ngOnInit();
                    component.nodes = ["a", "b", "c"];
                    component.items = component.nodes.map(id => ({
                        id,
                        componentType: "test",
                    }));
                    component.nodes.forEach(id =>
                        component.form.push(builder.group({ id }))
                    );
                    controller = component.reorder;
                    connect(component.reorder, "a");
                    order = () =>
                        component.form.getRawValue().map(item => item.id);
                    remove = () => component.removeItem(component.items[0], 0);
                    destroy = () => component.ngOnDestroy();
                    disable = () => component.form.disable();
                } else if (kind === "columns") {
                    const manager =
                        jasmine.createSpyObj<ConfiguratorDataSourceManagerService>(
                            "DataSourceManager",
                            [],
                            { error$: new Subject() }
                        );
                    const component = new TableColumnsConfigurationV2Component(
                        builder,
                        detector,
                        jasmine.createSpyObj<DialogService>("DialogService", [
                            "confirm",
                        ]),
                        pizzagna,
                        manager,
                        jasmine.createSpyObj<TableFormatterRegistryService>(
                            "FormatterRegistry",
                            ["getItems", "addItems"]
                        ),
                        new EventBus<IEvent>()
                    );
                    component.updateColumns(
                        ["a", "b", "c"].map(id => ({
                            id,
                            label: id,
                            isActive: true,
                            formatter: {
                                componentType: "RawFormatterComponent",
                                properties: {},
                            },
                        }))
                    );
                    controller = component.reorder;
                    connect(component.reorder, "a");
                    order = () =>
                        component.getColumns().map(column => column.id);
                    remove = () => component.removeItem(0);
                    destroy = () => component.ngOnDestroy();
                    disable = () => component.form.disable();
                } else {
                    const registry =
                        jasmine.createSpyObj<KpiColorComparatorsRegistryService>(
                            "Comparators",
                            ["getComparators"]
                        );
                    registry.getComparators.and.returnValue({});
                    const component =
                        new BackgroundColorRulesConfigurationComponent(
                            detector,
                            builder,
                            registry
                        );
                    component.backgroundColors = [];
                    component.ngOnInit();
                    const rules = component.formLocal.get("rules")
                        ?.value as FormArray<FormGroup>;
                    for (const comparisonType of ["a", "b", "c"]) {
                        component.addRule();
                        rules
                            .at(rules.length - 1)
                            .get("comparisonType")
                            ?.setValue(comparisonType);
                    }
                    controller = component.reorder;
                    connect(component.reorder, rules.at(0));
                    order = () =>
                        component.form
                            .get("rules")
                            ?.value.map(
                                (rule: { comparisonType: string }) =>
                                    rule.comparisonType
                            );
                    remove = () => component.removeRule(0);
                    destroy = () => component.ngOnDestroy();
                    disable = () => rules.disable();
                    component.form
                        .get("rules")
                        ?.valueChanges.subscribe(
                            (rulesValue: { comparisonType: string }[]) =>
                                valueEvents.push(
                                    rulesValue.map(rule => rule.comparisonType)
                                )
                        );
                }
            });

            afterEach(() => destroy());

            if (kind === "rules") {
                it("publishes only the complete new rule order, without transient duplicate controls", () => {
                    press("Enter");
                    press("ArrowDown");
                    expect(valueEvents).toEqual([["b", "a", "c"]]);
                });
            }

            it("does not pick up a disabled row", () => {
                disable();
                press("Enter");
                expect(controller.activeItem).toBeUndefined();
                expect(order()).toEqual(["a", "b", "c"]);
            });

            it("uses the existing move path and restores persisted form order", fakeAsync(() => {
                press("Enter");
                press("ArrowDown");
                press("ArrowDown");
                expect(order()).toEqual(["b", "c", "a"]);
                press("Escape");
                expect(order()).toEqual(["a", "b", "c"]);
                expect(controller.activeItem).toBeUndefined();
                flush();
            }));

            it("retains the chosen form order on drop", fakeAsync(() => {
                press(" ");
                press("ArrowDown");
                press(" ");
                expect(order()).toEqual(["b", "a", "c"]);
                expect(controller.activeItem).toBeUndefined();
                flush();
            }));

            it("cancels the keyboard session when a row is removed", () => {
                press("Enter");
                remove();
                expect(controller.activeItem).toBeUndefined();
                expect(controller.announcement).toContain("cancelled");
            });
        });
    }
});
