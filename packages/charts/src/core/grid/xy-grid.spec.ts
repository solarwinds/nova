import { fakeAsync, flush, tick } from "@angular/core/testing";
import { select } from "d3";
import find from "lodash/find";
import { Subject } from "rxjs";

import { IGNORE_INTERACTION_CLASS } from "../../constants";
import { LineAccessors } from "../../renderers/line/line-accessors";
import { LineRenderer } from "../../renderers/line/line-renderer";
import { RenderState } from "../../renderers/types";
import { Chart } from "../chart";
import { BandScale } from "../common/scales/band-scale";
import { domain } from "../common/scales/helpers/domain";
import { LinearScale } from "../common/scales/linear-scale";
import { TimeScale } from "../common/scales/time-scale";
import { DomainCalculator, IScale, isDomainWithTicksCalculator, ScalesIndex } from "../common/scales/types";
import { InteractionLabelPlugin } from "../plugins/interaction/interaction-label-plugin";
import { InteractionLinePlugin } from "../plugins/interaction/interaction-line-plugin";
import { MouseInteractiveAreaPlugin } from "../plugins/mouse-interactive-area-plugin";

import { XYGridConfig } from "./config/xy-grid-config";
import { Grid } from "./grid";
import { IXYGridConfig } from "./types";
import { XYGrid } from "./xy-grid";

describe("XYGrid >", () => {
    let grid: XYGrid;
    let root: HTMLElement;
    let config: IXYGridConfig;
    let chart: Chart;

    const testBottomScaleId = "testBottomId";
    const testLeftScaleId = "testLeftId";
    const testRightScaleId = "testRightId";
    let testBottomScale: IScale<any>;
    let testLeftScale: IScale<any>;
    let testRightScale: IScale<any>;
    let consoleWarnFn: any;

    function buildAndUpdateAxes() {
        (<any>grid).buildAxes(grid.getLasagna().getLayerContainer(Grid.GRID_ELEMENTS_LAYER_NAME));
        (<any>grid).updateAxes();

        flush();
    }

    const createScale = (scale: IScale<any>) => ({
        index: { [scale.id]: scale },
        list: [scale],
    });

    beforeAll(() => {
        // suppress "invalid scale domain" console warning in render-engine
        consoleWarnFn = console.warn;
        console.warn = () => null;
    });

    afterAll(() => {
        // restore console warning
        console.warn = consoleWarnFn;
    });

    beforeEach(() => {
        grid = new XYGrid();
        config = new XYGridConfig();
        root = document.createElement("div");
        document.body.appendChild(root);

        grid.config(config);

        chart = new Chart(grid);
        chart.build(root);

        testBottomScale = new BandScale(testBottomScaleId);
        testLeftScale = new LinearScale(testLeftScaleId);
        testRightScale = new LinearScale(testRightScaleId);
        grid.scales["x"] = createScale(testBottomScale);
        grid.scales["y"] = {
            index: {
                [testLeftScale.id]: testLeftScale,
                [testRightScale.id]: testRightScale,
            },
            list: [testLeftScale, testRightScale],
        };
        grid.bottomScaleId = testBottomScaleId;
        grid.leftScaleId = testLeftScaleId;
        grid.rightScaleId = testRightScaleId;
    });

    afterEach(() => {
        document.body.removeChild(root);
    });

    describe("plugins", () => {
        describe("interactive", () => {
            it("adds plugins in interactive mode", () => {
                config.interactive = true;

                const plugins = grid.buildPlugins(chart);

                expect(find(plugins, (p) => p instanceof MouseInteractiveAreaPlugin)).toBeDefined();
            });

            it("doesn't add plugins when interactive mode is disabled", () => {
                config.interactive = false;

                const plugins = grid.buildPlugins(chart);

                expect(find(plugins, (p) => p instanceof MouseInteractiveAreaPlugin)).not.toBeDefined();
            });
        });

        describe("interaction plugins", () => {
            it("adds plugins when interactionPlugins is true", () => {
                config.interactionPlugins = true;

                const plugins = grid.buildPlugins(chart);

                expect(find(plugins, (p) => p instanceof InteractionLinePlugin)).toBeDefined();
                expect(find(plugins, (p) => p instanceof InteractionLabelPlugin)).toBeDefined();
            });

            it("doesn't add plugins when interactionPlugins is false", () => {
                config.interactionPlugins = false;

                const plugins = grid.buildPlugins(chart);

                expect(find(plugins, (p) => p instanceof InteractionLinePlugin)).not.toBeDefined();
                expect(find(plugins, (p) => p instanceof InteractionLabelPlugin)).not.toBeDefined();
            });
        });
    });

    describe("x-axis", () => {
        it("should have pointer events disabled", () => {
            const axisLeftNode = (chart.getGrid() as any).axisX.group.node();
            expect(window.getComputedStyle(axisLeftNode).pointerEvents).toEqual("none");
        });
    });

    describe("y-axis", () => {
        it("left axis should have pointer events disabled", () => {
            const axisLeftNode = (chart.getGrid() as any).axisYLeft.group.node();
            expect(window.getComputedStyle(axisLeftNode).pointerEvents).toEqual("none");
        });

        it("right axis should have pointer events disabled", () => {
            const axisLeftNode = (chart.getGrid() as any).axisYRight.group.node();
            expect(window.getComputedStyle(axisLeftNode).pointerEvents).toEqual("none");
        });
    });

    describe("update", () => {
        it("should not invoke updateRanges if the margins do not change", fakeAsync(() => {
            // override updateAxes with a spy since it's irrelevant in the context of this test
            spyOn((<any>grid), "updateAxes");
            grid.update();

            const spy = spyOn(grid, "updateRanges");
            grid.update();

            flush();

            expect(spy).not.toHaveBeenCalled();
        }));

        it("should invoke updateRanges if the left margin changes", fakeAsync(() => {
            // override updateAxes with a spy since it's irrelevant in the context of this test
            spyOn((<any>grid), "updateAxes");

            // grid config setup
            const gridConfig = grid.config() as XYGridConfig;
            gridConfig.axis.left.fit = true;
            gridConfig.dimension.margin.left = 30;

            // mock a change in the left margin
            spyOn((<any>grid), "getMaxTextWidth").and.returnValue(gridConfig.dimension.margin.left + 5);
            const spy = spyOn(grid, "updateRanges");

            grid.update();

            flush();

            expect(spy).toHaveBeenCalled();
        }));

        it("should invoke updateRanges if the right margin changes", fakeAsync(() => {
            // override updateAxes with a spy since it's irrelevant in the context of this test
            spyOn((<any>grid), "updateAxes");

            // grid config setup
            const gridConfig = grid.config() as XYGridConfig;
            gridConfig.axis.right.fit = true;
            gridConfig.axis.right.visible = true;
            gridConfig.dimension.margin.right = 30;

            (<XYGrid>grid).rightScaleId = "testId";

            // mock a change in the right margin
            spyOn((<any>grid), "getMaxTextWidth").and.returnValue(gridConfig.dimension.margin.right + 5);
            const spy = spyOn(grid, "updateRanges");

            grid.update();

            flush();

            expect(spy).toHaveBeenCalled();
        }));

        it("should invoke next on the updateChartDimensionsSubject only once if the right margin changes on repeated update calls", fakeAsync(() => {
            // override updateAxes with a spy since it's irrelevant in the context of this test
            spyOn((<any>grid), "updateAxes");

            // grid config setup
            const gridConfig = grid.config() as XYGridConfig;
            gridConfig.axis.right.fit = true;
            gridConfig.axis.right.visible = true;
            gridConfig.dimension.margin.right = 30;

            (<XYGrid>grid).rightScaleId = "testId";

            const getMaxTextWidthSpy = spyOn((<any>grid), "getMaxTextWidth");
            const updateChartDimensionsSpy = spyOn(grid.updateChartDimensionsSubject as Subject<void>, "next");

            // mock a change in the right margin
            getMaxTextWidthSpy.and.returnValue(gridConfig.dimension.margin.right + 5);

            grid.update();

            // mock a change in the right margin
            getMaxTextWidthSpy.and.returnValue(gridConfig.dimension.margin.right - 5);

            grid.update();

            flush();

            expect(updateChartDimensionsSpy).toHaveBeenCalledTimes(1);
        }));
    });

    describe("adjustAxisTicks", () => {
        it("should set the cursor to 'default'", fakeAsync(() => {
            grid.scales["x"] = createScale(new BandScale(testBottomScaleId));
            domain(grid.scales["x"].index[grid.bottomScaleId as string], ["Q1", "Q2", "Q3"]);
            buildAndUpdateAxes();

            (<any>grid).axisX.labelGroup.attr("cursor", "pointer");

            (<any>grid).adjustAxisTicks((<any>grid).axisX.labelGroup, grid.scales["x"].index[grid.bottomScaleId as string]);

            expect((<any>grid).axisX.labelGroup.attr("cursor")).toEqual("default");

            flush();
        }));

        it("should set pointer-events to true on each label", fakeAsync(() => {
            grid.scales["x"] = createScale(new BandScale(testBottomScaleId));
            domain(grid.scales["x"].index[grid.bottomScaleId as string], ["Q1", "Q2", "Q3"]);
            buildAndUpdateAxes();

            const allAxisLabels = (<any>grid).selectAllAxisLabels((<any>grid).axisX.labelGroup);
            allAxisLabels.forEach((group: HTMLElement) => {
                const groupSelection = select(group);
                groupSelection.classed("pointer-events", false);
            });
            spyOn((<any>grid), "handleTickLabelOverflow"); // use spy to prevent handleTickLabelOverflow from removing the class
            (<any>grid).adjustAxisTicks((<any>grid).axisX.labelGroup, grid.scales["x"].index[grid.bottomScaleId as string]);

            allAxisLabels.forEach((group: HTMLElement) => {
                const groupSelection = select(group);
                expect(groupSelection.classed("pointer-events")).toEqual(true);
            });

            flush();
        }));

        it("should zero-out the x attribute on the text element of each label", fakeAsync(() => {
            grid.scales["x"] = createScale(new BandScale(testBottomScaleId));
            domain(grid.scales["x"].index[grid.bottomScaleId as string], ["Q1", "Q2", "Q3"]);
            buildAndUpdateAxes();

            const allAxisLabels = (<any>grid).selectAllAxisLabels((<any>grid).axisX.labelGroup);
            allAxisLabels.forEach((group: HTMLElement) => {
                const groupSelection = select(group);
                groupSelection.select("text").attr("x", 5);
            });

            (<any>grid).adjustAxisTicks((<any>grid).axisX.labelGroup, grid.scales["x"].index[grid.bottomScaleId as string]);

            allAxisLabels.forEach((group: HTMLElement) => {
                const groupSelection = select(group);
                expect(groupSelection.select("text").attr("x")).toEqual("0");
            });

            flush();
        }));

        it("should add the IGNORE_INTERACTION_CLASS to the text element of each label", fakeAsync(() => {
            grid.scales["x"] = createScale(new BandScale(testBottomScaleId));
            domain(grid.scales["x"].index[grid.bottomScaleId as string], ["Q1", "Q2", "Q3"]);
            buildAndUpdateAxes();

            const allAxisLabels = (<any>grid).selectAllAxisLabels((<any>grid).axisX.labelGroup);
            allAxisLabels.forEach((group: HTMLElement) => {
                const groupSelection = select(group);
                groupSelection.select("text").classed(IGNORE_INTERACTION_CLASS, false);
            });

            (<any>grid).adjustAxisTicks((<any>grid).axisX.labelGroup, grid.scales["x"].index[grid.bottomScaleId as string]);

            allAxisLabels.forEach((group: HTMLElement) => {
                const groupSelection = select(group);
                expect(groupSelection.select("text").classed(IGNORE_INTERACTION_CLASS)).toEqual(true);
            });

            flush();
        }));

        it("should append a title to each text element", fakeAsync(() => {
            config.axis.left.fit = false;
            const scale = grid.scales["y"].index[grid.leftScaleId as string];
            domain(scale, [0, 100]);
            buildAndUpdateAxes();

            const allAxisLabels = (<any>grid).selectAllAxisLabels((<any>grid).axisYLeft.labelGroup);
            (<any>grid).adjustAxisTicks((<any>grid).axisX.labelGroup, scale);
            allAxisLabels.forEach((group: HTMLElement) => {
                const groupSelection = select(group);
                expect(groupSelection.select("title").text()).toEqual(`${groupSelection.data()[0]}`);
            });

            flush();
        }));

        it("should invoke 'handleTickLabelOverflow'", fakeAsync(() => {
            const allAxisLabels = (<any>grid).selectAllAxisLabels((<any>grid).axisX.labelGroup);
            const scale = grid.scales["x"].index[grid.bottomScaleId as string];
            const spy = spyOn((<any>grid), "handleTickLabelOverflow");
            (<any>grid).adjustAxisTicks((<any>grid).axisX.labelGroup, scale);
            expect(spy).toHaveBeenCalledWith((<any>grid).axisX.labelGroup, scale, allAxisLabels);

            flush();
        }));
    });

    describe("handleTickLabelOverflow", () => {
        describe("pointer-events class", () => {
            it("should be absent during the debounce interval", fakeAsync(() => {
                grid.scales["x"] = createScale(new BandScale(testBottomScaleId));
                domain(grid.scales["x"].index[grid.bottomScaleId as string], ["Q1", "Q2", "Q3"]);
                buildAndUpdateAxes();

                const allAxisLabels = (<any>grid).selectAllAxisLabels((<any>grid).axisX.labelGroup);
                allAxisLabels.forEach((group: HTMLElement) => {
                    const groupSelection = select(group);
                    groupSelection.classed("pointer-events", true);
                });
                (<any>grid).handleTickLabelOverflow((<any>grid).axisX.labelGroup, grid.scales["x"].index[grid.bottomScaleId as string], allAxisLabels);
                allAxisLabels.forEach((group: HTMLElement) => {
                    const groupSelection = select(group);
                    expect(groupSelection.classed("pointer-events")).toEqual(false);
                });

                flush();
            }));

            it("should be present after the debounce interval", fakeAsync(() => {
                grid.scales["x"] = createScale(new BandScale(testBottomScaleId));
                domain(grid.scales["x"].index[grid.bottomScaleId as string], ["Q1", "Q2", "Q3"]);
                buildAndUpdateAxes();

                const allAxisLabels = (<any>grid).selectAllAxisLabels((<any>grid).axisX.labelGroup);
                (<any>grid).handleTickLabelOverflow((<any>grid).axisX.labelGroup, grid.scales["x"].index[grid.bottomScaleId as string], allAxisLabels);

                flush();

                allAxisLabels.forEach((group: HTMLElement) => {
                    const groupSelection = select(group);
                    expect(groupSelection.classed("pointer-events")).toEqual(true);
                });
            }));
        });

        describe("tick-hidden-text class", () => {
            it("should be present during the debounce interval", fakeAsync(() => {
                grid.scales["x"] = createScale(new BandScale(testBottomScaleId));
                domain(grid.scales["x"].index[grid.bottomScaleId as string], ["Q1", "Q2", "Q3"]);
                buildAndUpdateAxes();

                const allAxisLabels = (<any>grid).selectAllAxisLabels((<any>grid).axisX.labelGroup);
                (<any>grid).handleTickLabelOverflow((<any>grid).axisX.labelGroup, grid.scales["x"].index[grid.bottomScaleId as string], allAxisLabels);

                expect((<any>grid).axisX.labelGroup.classed("tick-hidden-text")).toEqual(true);

                flush();
            }));

            it("should be absent after the debounce interval", fakeAsync(() => {
                grid.scales["x"] = createScale(new BandScale(testBottomScaleId));
                domain(grid.scales["x"].index[grid.bottomScaleId as string], ["Q1", "Q2", "Q3"]);
                buildAndUpdateAxes();

                const allAxisLabels = (<any>grid).selectAllAxisLabels((<any>grid).axisX.labelGroup);
                (<any>grid).handleTickLabelOverflow((<any>grid).axisX.labelGroup, grid.scales["x"].index[grid.bottomScaleId as string], allAxisLabels);

                flush();

                expect((<any>grid).axisX.labelGroup.classed("tick-hidden-text")).toEqual(false);
            }));
        });

        describe("for the bottom axis", () => {
            it("should not invoke the 'overflowHandler' if the scale is continuous", fakeAsync(() => {
                grid.scales["x"] = createScale(new LinearScale(testBottomScaleId));
                buildAndUpdateAxes();

                const allAxisLabels = (<any>grid).selectAllAxisLabels((<any>grid).axisX.labelGroup);
                const spy = spyOn(config.axis.bottom.tickLabel, "overflowHandler" as never);
                (<any>grid).handleTickLabelOverflow((<any>grid).axisX.labelGroup, grid.scales["x"].index[grid.bottomScaleId as string], allAxisLabels);

                flush();

                expect(spy).not.toHaveBeenCalled();
            }));

            it("should hide some labels if the overflowHandler is undefined", fakeAsync(() => {
                grid.scales["x"] = createScale(new BandScale(testBottomScaleId));
                domain(grid.scales["x"].index[grid.bottomScaleId as string], ["Q1", "Q2", "Q3"]);
                buildAndUpdateAxes();

                const allAxisLabels = (<any>grid).selectAllAxisLabels((<any>grid).axisX.labelGroup);
                config.axis.bottom.tickLabel.overflowHandler = undefined;
                (<any>grid).handleTickLabelOverflow((<any>grid).axisX.labelGroup, grid.scales["x"].index[grid.bottomScaleId as string], allAxisLabels);

                flush();

                expect((<any>grid).axisX.labelGroup.selectAll(".tick-hidden-text").nodes().length).toEqual(2);
            }));

            it("should invoke the 'overflowHandler' if the scale is not continuous", fakeAsync(() => {
                grid.scales["x"] = createScale(new BandScale(testBottomScaleId));
                domain(grid.scales["x"].index[grid.bottomScaleId as string], ["Q1", "Q2", "Q3"]);
                buildAndUpdateAxes();

                const allAxisLabels = (<any>grid).selectAllAxisLabels((<any>grid).axisX.labelGroup);
                let ellipsisWidth = 0;
                if ((<any>grid).axisX.labelGroup.select(".sample-ellipsis").empty()) {
                    const testText = (<any>grid).axisX.labelGroup.append("text");
                    const ellipsis = testText.classed("sample-ellipsis", true).attr("opacity", 0).append("tspan").text("...");
                    ellipsisWidth = ellipsis.node()?.getComputedTextLength() || 0;
                    testText.remove();
                }

                const widthLimit = (grid.scales["x"].index[grid.bottomScaleId as string] as BandScale).bandwidth();
                const horizontalPadding = config.axis.bottom.tickLabel.horizontalPadding;

                spyOn(config.axis.bottom.tickLabel, "overflowHandler" as never);
                (<any>grid).handleTickLabelOverflow((<any>grid).axisX.labelGroup, grid.scales["x"].index[grid.bottomScaleId as string], allAxisLabels);

                flush();

                // using jasmine.anything() as a stand-in for the text element
                expect(config.axis.bottom.tickLabel.overflowHandler).toHaveBeenCalledWith(
                    jasmine.anything() as never, { widthLimit, horizontalPadding, ellipsisWidth });
            }));
        });

        describe("for the left axis", () => {
            it("should invoke the 'overflowHandler' if 'fit' is false", fakeAsync(() => {
                config.axis.left.fit = false;
                domain(grid.scales["y"].index[grid.leftScaleId as string], [0, 100]);
                buildAndUpdateAxes();

                const allAxisLabels = (<any>grid).selectAllAxisLabels((<any>grid).axisYLeft.labelGroup);
                let ellipsisWidth = 0;
                if ((<any>grid).axisYLeft.labelGroup.select(".sample-ellipsis").empty()) {
                    const testText = (<any>grid).axisYLeft.labelGroup.append("text");
                    const ellipsis = testText.classed("sample-ellipsis", true).attr("opacity", 0).append("tspan").text("...");
                    ellipsisWidth = ellipsis.node()?.getComputedTextLength() || 0;
                    testText.remove();
                }

                const widthLimit = config.dimension.margin.left - config.axis.left.padding - config.axis.left.tickSize;
                const horizontalPadding = config.axis.left.tickLabel.horizontalPadding;

                spyOn(config.axis.left.tickLabel, "overflowHandler" as never);
                (<any>grid).handleTickLabelOverflow((<any>grid).axisYLeft.labelGroup, grid.scales["y"].index[grid.leftScaleId as string], allAxisLabels);

                flush();

                // using jasmine.anything() as a stand-in for the text element
                expect(config.axis.left.tickLabel.overflowHandler).toHaveBeenCalledWith(
                    jasmine.anything() as never, { widthLimit, horizontalPadding, ellipsisWidth });
            }));

            it("should not invoke the 'overflowHandler' if 'fit' is true", fakeAsync(() => {
                config.axis.left.fit = true;
                domain(grid.scales["y"].index[grid.leftScaleId as string], [0, 100]);
                buildAndUpdateAxes();

                const allAxisLabels = (<any>grid).selectAllAxisLabels((<any>grid).axisYLeft.labelGroup);
                const spy = spyOn(config.axis.left.tickLabel, "overflowHandler" as never);
                (<any>grid).handleTickLabelOverflow((<any>grid).axisYLeft.labelGroup, grid.scales["y"].index[grid.leftScaleId as string], allAxisLabels);

                flush();

                expect(spy).not.toHaveBeenCalled();
            }));
        });

        describe("for the right axis", () => {
            it("should invoke the 'overflowHandler' if 'fit' is false", fakeAsync(() => {
                config.axis.right.fit = false;
                domain(grid.scales["y"].index[grid.rightScaleId as string], [0, 100]);
                buildAndUpdateAxes();

                const allAxisLabels = (<any>grid).selectAllAxisLabels((<any>grid).axisYRight.labelGroup);
                let ellipsisWidth = 0;
                if ((<any>grid).axisYRight.labelGroup.select(".sample-ellipsis").empty()) {
                    const testText = (<any>grid).axisYRight.labelGroup.append("text");
                    const ellipsis = testText.classed("sample-ellipsis", true).attr("opacity", 0).append("tspan").text("...");
                    ellipsisWidth = ellipsis.node()?.getComputedTextLength() || 0;
                    testText.remove();
                }

                const widthLimit = config.dimension.margin.right - config.axis.right.padding - config.axis.right.tickSize;
                const horizontalPadding = config.axis.right.tickLabel.horizontalPadding;

                spyOn(config.axis.right.tickLabel, "overflowHandler" as never);
                (<any>grid).handleTickLabelOverflow((<any>grid).axisYRight.labelGroup, grid.scales["y"].index[grid.rightScaleId as string], allAxisLabels);

                flush();

                // using jasmine.anything() as a stand-in for the text element
                expect(config.axis.right.tickLabel.overflowHandler).toHaveBeenCalledWith(
                    jasmine.anything() as never, { widthLimit, horizontalPadding, ellipsisWidth });
            }));

            it("should not invoke the 'overflowHandler' if 'fit' is true", fakeAsync(() => {
                config.axis.right.fit = true;
                domain(grid.scales["y"].index[grid.rightScaleId as string], [0, 100]);
                buildAndUpdateAxes();

                const allAxisLabels = (<any>grid).selectAllAxisLabels((<any>grid).axisYRight.labelGroup);
                const spy = spyOn(config.axis.right.tickLabel, "overflowHandler" as never);
                (<any>grid).handleTickLabelOverflow((<any>grid).axisYRight.labelGroup, grid.scales["y"].index[grid.rightScaleId as string], allAxisLabels);

                flush();

                expect(spy).not.toHaveBeenCalled();
            }));
        });

        describe("debounce", () => {
            it("should prevent multiple calls within the TICK_LABEL_OVERFLOW_DEBOUNCE_INTERVAL", fakeAsync(() => {
                grid.scales["x"] = createScale(new BandScale(testBottomScaleId));
                domain(grid.scales["x"].index[grid.bottomScaleId as string], ["Q1", "Q2", "Q3"]);
                buildAndUpdateAxes();

                const allAxisLabels = (<any>grid).selectAllAxisLabels((<any>grid).axisX.labelGroup);
                const spy = spyOn(config.axis.bottom.tickLabel, "overflowHandler" as never);
                (<any>grid).handleTickLabelOverflow((<any>grid).axisX.labelGroup, grid.scales["x"].index[grid.bottomScaleId as string], allAxisLabels);
                (<any>grid).handleTickLabelOverflow((<any>grid).axisX.labelGroup, grid.scales["x"].index[grid.bottomScaleId as string], allAxisLabels);

                tick(XYGrid.TICK_LABEL_OVERFLOW_DEBOUNCE_INTERVAL);

                expect(spy).toHaveBeenCalledTimes(allAxisLabels.length);

                flush();
            }));
        });

    });

    describe("fitBottomAxis", () => {
        it("should not change the right margin if the label for the last tick on the bottom axis doesn't exist", () => {
            const mockTextSelection = { node: () => null };
            const expectedRightMargin = 50;
            grid.config().dimension.margin.right = expectedRightMargin;
            grid.scales.x = {
                list: [{
                    d3Scale: () => {
                    },
                } as unknown as IScale<any>],
            } as any;
            spyOn((<any>grid).axisX.labelGroup, "select").and.returnValue(mockTextSelection);

            (<any>grid).fitBottomAxis(grid.config().dimension);

            expect(grid.config().dimension.margin.right).toEqual(expectedRightMargin);
        });

        it("should not throw if 'scales.x' is undefined", () => {
            grid.scales = {};
            expect(() => (<any>grid).fitBottomAxis(grid.config().dimension)).not.toThrow();
        });

        it("should not throw if 'scales' is undefined", () => {
            grid.scales = undefined as unknown as ScalesIndex;
            expect(() => (<any>grid).fitBottomAxis(grid.config().dimension)).not.toThrow();
        });

        it("should change the right margin based on the width of the right-most tick label on the bottom axis", () => {
            const mockTextSelection = {
                node: () => ({
                    getBoundingClientRect: () => ({ width: 5 }),
                    innerHtml: "test label",
                }),
            };

            const d3Scale = () => 3;
            d3Scale.range = () => [0, 5];
            const expectedRightMargin = (mockTextSelection.node().getBoundingClientRect().width / 2) - (Math.abs(d3Scale.range()[1] - d3Scale()) / 2);
            grid.config().dimension.margin.right = expectedRightMargin + 1;
            grid.scales = { x: { list: [{ d3Scale }] } } as unknown as ScalesIndex;
            spyOn((<any>grid).axisX.labelGroup, "select").and.returnValue(mockTextSelection);

            (<any>grid).fitBottomAxis(grid.config().dimension);

            expect(grid.config().dimension.margin.right).toEqual(expectedRightMargin);
        });
    });

    describe("scales", () => {
        it("should set the scales domain calculator to getAutomaticDomainWithTicks if it is linear", () => {
            config.axis.bottom.gridTicks = true;
            config.axis.left.gridTicks = true;
            grid.scales = {
                x: {
                    list: [new LinearScale(), new TimeScale()],
                    index: {},
                },
                y: {
                    list: [new LinearScale()],
                    index: {},
                },
            };

            expect(grid?.scales?.x?.list[0]?.__domainCalculatedWithTicks).toBeTruthy();
            expect(grid?.scales?.x?.list[1]?.__domainCalculatedWithTicks).toBeFalsy();
            expect(grid?.scales?.y?.list[0]?.__domainCalculatedWithTicks).toBeTruthy();
        });

        it("should not set the scales domain calculator to getAutomaticDomainWithTicks if the config gridTicks is false", () => {
            config.axis.bottom.gridTicks = false;
            config.axis.left.gridTicks = false;
            grid.scales = {
                x: {
                    list: [new LinearScale(), new TimeScale()],
                    index: {},
                },
                y: {
                    list: [new LinearScale()],
                    index: {},
                },
            };

            expect(grid?.scales?.x?.list[0]?.__domainCalculatedWithTicks).toBeFalsy();
            expect(grid?.scales?.x?.list[1]?.__domainCalculatedWithTicks).toBeFalsy();
            expect(grid?.scales?.y?.list[0]?.__domainCalculatedWithTicks).toBeFalsy();
        });

        it("should wrap the the scales domain calculator to getAutomaticDomainWithTicks if the domain calculator is not getAutomaticDomain", () => {
            config.axis.left.gridTicks = true;
            const yScale = new LinearScale();
            // @ts-ignore
            yScale.domainCalculator = () => () => [0, 0] as DomainCalculator;
            grid.scales = {
                y: {
                    list: [yScale],
                    index: {},
                },

            };
            expect(isDomainWithTicksCalculator(yScale.domainCalculator)).toBe(true);
        });
    });

    describe("axes highlighting", () => {

        it("highlights axes", () => {
            const seriesSet = [
                {
                    id: "series1",
                    name: "Series 1",
                    data: [],
                    renderer: new LineRenderer(),
                    accessors: new LineAccessors(),
                    scales: {
                        x: testBottomScale,
                        y: testLeftScale,
                    },
                },
                {
                    id: "series2",
                    name: "Series 2",
                    data: [],
                    renderer: new LineRenderer(),
                    accessors: new LineAccessors(),
                    scales: {
                        x: testBottomScale,
                        y: testRightScale,
                    },
                },
            ];

            chart.update(seriesSet);
            chart.setSeriesStates([
                {
                    series: seriesSet[0],
                    state: RenderState.emphasized,
                    seriesId: seriesSet[0].id,
                },
                {
                    series: seriesSet[1],
                    state: RenderState.deemphasized,
                    seriesId: seriesSet[1].id,
                },
            ]);

            // @ts-ignore
            expect(grid.axisYLeft.group.attr("opacity")).toBe("1");
            // @ts-ignore
            expect(grid.axisYRight.group.attr("opacity")).toBe("0.1");
        });
    });
});
