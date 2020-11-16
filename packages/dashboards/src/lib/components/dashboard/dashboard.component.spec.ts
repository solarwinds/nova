import { SimpleChange, SimpleChanges } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { GridsterItem } from "angular-gridster2";
import { IDashboard, IWidgets } from "src/lib/types";

import { NuiDashboardsModule } from "../../dashboards.module";
import { WIDGET_POSITION_CHANGE } from "../../services/types";

import { DashboardComponent } from "./dashboard.component";
import { DEFAULT_GRIDSTER_CONFIG } from "./default-gridster-config";

describe("DashboardComponent", () => {
    let component: DashboardComponent;
    let fixture: ComponentFixture<DashboardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [NuiDashboardsModule],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DashboardComponent);
        component = fixture.componentInstance;
        component.gridsterConfig = DEFAULT_GRIDSTER_CONFIG;
        component.dashboard = { widgets: {}, positions: {} };
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should not register an itemChangeCallback by default", () => {
        expect(component.gridsterConfig.itemChangeCallback).toBeUndefined();
    });

    it("should not register an itemResizeCallback by default", () => {
        expect(component.gridsterConfig.itemResizeCallback).toBeUndefined();
    });

    describe("ngOnChanges > ", () => {
        let changes: SimpleChanges;

        beforeAll(() => {
            changes = {
                gridsterConfig: new SimpleChange(undefined, component.gridsterConfig, true),
            };
        });

        it("should register an itemChangeCallback", () => {
            component.ngOnChanges(changes);
            expect(typeof component.gridsterConfig.itemChangeCallback).toEqual("function");
        });

        it("should emit the gridsterConfigChange output", () => {
            spyOn(component.gridsterConfigChange, "emit");
            component.ngOnChanges(changes);
            expect(component.gridsterConfigChange.emit).toHaveBeenCalled();
        });

        it("should invoke optionsChanged on gridsterConfig.api", () => {
            spyOn(component.gridsterConfig.api ?? {}, "optionsChanged");
            component.ngOnChanges(changes);
            expect(component.gridsterConfig.api?.optionsChanged).toHaveBeenCalled();
        });
    });

    describe("orderWidgets > ", () => {

        const testPositions: Record<string, GridsterItem> = {
            widget_1: { x: 2, y: 0, cols: 2, rows: 3 },
            widget_2: { x: 1, y: 0, cols: 2, rows: 3 },
            widget_3: { x: 8, y: 0, cols: 2, rows: 3 },
            widget_4: { x: 2, y: 3, cols: 2, rows: 3 },
            widget_5: { x: 8, y: 2, cols: 2, rows: 3 },
            widget_6: { x: 4, y: 5, cols: 2, rows: 3 },
        };

        const testWidgets: IWidgets = {
            widget_1: { id: "widget_1", type: "myType", pizzagna: {} },
            widget_2: { id: "widget_2", type: "myType", pizzagna: {} },
            widget_3: { id: "widget_3", type: "myType", pizzagna: {} },
            widget_4: { id: "widget_4", type: "myType", pizzagna: {} },
            widget_5: { id: "widget_5", type: "myType", pizzagna: {} },
            widget_6: { id: "widget_6", type: "myType", pizzagna: {} },
        };

        const testDashboard: IDashboard = {
            positions: testPositions,
            widgets: testWidgets,
        };

        it("should return a negative value if the next widget comes before the current widget", () => {
            component.dashboard = testDashboard;
            let result: number;

            result = component.orderWidgets({ key: "widget_2", value: testWidgets.widget_2 }, { key: "widget_1", value: testWidgets.widget_1 });

            expect(result).toBeLessThan(0);

            result = component.orderWidgets({ key: "widget_5", value: testWidgets.widget_5 }, { key: "widget_4", value: testWidgets.widget_4 });

            expect(result).toBeLessThan(0);
        });

        it("should return a positive value if the next widget is already before the current widget", () => {
            component.dashboard = testDashboard;
            let result: number;

            result = component.orderWidgets({ key: "widget_3", value: testWidgets.widget_3 }, { key: "widget_2", value: testWidgets.widget_2 });

            expect(result).toBeGreaterThan(0);

            result = component.orderWidgets({ key: "widget_6", value: testWidgets.widget_6 }, { key: "widget_5", value: testWidgets.widget_5 });

            expect(result).toBeGreaterThan(0);
        });
    });

    describe("updateWidgetPosition > ", () => {
        const testGridsterItem: GridsterItem = {
            x: 0,
            y: 0,
            rows: 10,
            cols: 10,
        };
        const testGridsterComponentInterface = { widgetId: "myId" };
        const expectedArg = {
            widgets: {},
            positions: {
                [testGridsterComponentInterface.widgetId]: testGridsterItem,
            },
        };

        it("should emit the dashboardChange output", () => {
            const spy = spyOn(component.dashboardChange, "emit");
            (<any>component).updateWidgetPosition(testGridsterItem, testGridsterComponentInterface);
            expect(spy).toHaveBeenCalledWith(expectedArg);
        });

        it("should emit WIDGET_POSITION_CHANGE via the eventBus", () => {
            const spy = spyOn(component.eventBus.getStream(WIDGET_POSITION_CHANGE), "next");
            (<any>component).updateWidgetPosition(testGridsterItem, testGridsterComponentInterface);
            expect(spy).toHaveBeenCalledWith({ widgetId: testGridsterComponentInterface.widgetId, payload: testGridsterItem });
        });
    });

    describe("onWidgetChange > ", () => {
        it("should emit the dashboardChange output", () => {
            const testWidget = {
                id: "myId",
                type: "myType",
                pizzagna: {},
            };
            const testPositions = {
                [testWidget.id]: {
                    x: 0,
                    y: 1,
                    cols: 2,
                    rows: 3,
                },
            };
            const expectedArg = {
                widgets: {
                    [testWidget.id]: testWidget,
                },
                positions: testPositions,
            };
            spyOn(component.dashboardChange, "emit");
            component.dashboard.positions = testPositions;
            component.dashboard.widgets = { [testWidget.id]: testWidget };
            component.onWidgetChange(testWidget);
            expect(component.dashboardChange.emit).toHaveBeenCalledWith(expectedArg);
        });

    });

    describe("updateWidget >", () => {
        it("should use the gridsterConfig's default values for row and column count if no position has been stored", () => {
            const testWidget = {
                id: "myId",
                type: "myType",
                pizzagna: {},
            };
            const expectedPositions = {
                x: 0,
                y: 0,
                rows: DEFAULT_GRIDSTER_CONFIG.defaultItemRows,
                cols: DEFAULT_GRIDSTER_CONFIG.defaultItemCols,
            };

            const spy = spyOn(component.gridsterConfig.api ?? {}, "getFirstPossiblePosition");
            
            // component.dashboard.widgets = { [testWidget.id]: testWidget };
            component.updateWidget(testWidget);

            expect(spy).toHaveBeenCalledWith(expectedPositions);
        });
    });

    describe("removeWidget > ", () => {
        it("should remove the specified widget and its position configuration", () => {
            const testWidget = {
                id: "myId",
                type: "myType",
                pizzagna: {},
            };
            const testPositions = {
                [testWidget.id]: {
                    x: 0,
                    y: 1,
                    cols: 2,
                    rows: 3,
                },
            };
            component.dashboard = {
                widgets: {
                    [testWidget.id]: testWidget,
                },
                positions: testPositions,
            };
            const spy = spyOn(component.dashboardChange, "emit");
            component.removeWidget(testWidget.id);
            expect(spy).toHaveBeenCalledWith({ widgets: {}, positions: {} });
        });

        it("should remove the specified widget, but not its position configuration", () => {
            const testWidget = {
                id: "myId",
                type: "myType",
                pizzagna: {},
            };
            const testPositions = {
                [testWidget.id]: {
                    x: 0,
                    y: 1,
                    cols: 2,
                    rows: 3,
                },
            };
            component.dashboard = {
                widgets: {
                    [testWidget.id]: testWidget,
                },
                positions: testPositions,
            };
            const spy = spyOn(component.dashboardChange, "emit");
            component.removeWidget(testWidget.id, false);
            expect(spy).toHaveBeenCalledWith({ widgets: {}, positions: testPositions });
        });
    });
});
