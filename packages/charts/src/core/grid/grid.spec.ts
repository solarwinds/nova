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

import { select } from "d3-selection";
import cloneDeep from "lodash/cloneDeep";

import { ScalesIndex } from "../common/scales/types";
import { D3Selection } from "../common/types";
import { BorderConfig } from "./config/border-config";
import { GridConfig } from "./config/grid-config";
import { Grid } from "./grid";
import { IBorderConfig, IGrid } from "./types";

class MockDerivedGrid extends Grid {}

describe("Grid >", () => {
    let grid: IGrid;
    const testBorderConfig: IBorderConfig = {
        className: "border-test-class",
        color: "blue",
        width: 5,
    };
    const testScalesIndex: ScalesIndex = {
        x: {
            index: {},
            list: [],
        },
        y: {
            index: {},
            list: [],
        },
    };

    beforeEach(() => {
        grid = new MockDerivedGrid();
        const root = document.createElement("div");
        // @ts-ignore: Disabled for testing purposes
        grid.target(select(root).append("svg"));
    });

    describe("build", () => {
        it("should create a configuration if one isn't provided", () => {
            expect(grid.config()).toBeUndefined();
            grid.build();
            expect(grid.config()).toBeDefined();
        });

        it("should not overwrite the configuration if one is provided", () => {
            const config = new GridConfig();
            config.borders.top = new BorderConfig();
            const expectedConfig = cloneDeep(config);
            grid.config(config);
            grid.build();
            expect(grid.config()).toEqual(expectedConfig);
        });

        it("should append a rendering area clip path", () => {
            let clipPath = grid.target().selectAll("clipPath");
            expect(clipPath.nodes().length).toEqual(0);
            grid.build();
            clipPath = grid.target().selectAll("clipPath");
            expect(clipPath.nodes().length).toEqual(1);
            expect(clipPath.selectAll("rect").nodes().length).toEqual(1);
            expect(
                (clipPath.nodes()[0] as HTMLElement).id.startsWith(
                    Grid.RENDERING_AREA_CLIP_PATH_PREFIX
                )
            ).toEqual(true);
        });

        it("should append a container for the grid", () => {
            let gridContainer = grid
                .target()
                .selectAll(`g.${Grid.GRID_CLASS_NAME}`);
            expect(gridContainer.nodes().length).toEqual(0);
            grid.build();
            gridContainer = grid
                .target()
                .selectAll(`g.${Grid.GRID_CLASS_NAME}`);
            expect(gridContainer.nodes().length).toEqual(1);
        });

        it("should instantiate the lasagna", () => {
            expect(grid.getLasagna()).toBeUndefined();
            grid.build();
            expect(grid.getLasagna()).toBeDefined();
        });

        it(`should add a "${Grid.GRID_ELEMENTS_LAYER_NAME}" layer`, () => {
            grid.build();
            expect(
                grid
                    .getLasagna()
                    .getLayerContainer(Grid.GRID_ELEMENTS_LAYER_NAME)
                    .nodes().length
            ).toEqual(1);
        });

        it(`should add a "${Grid.RENDERING_AREA_LAYER_NAME}" layer`, () => {
            grid.build();
            const renderingAreaLayer = grid
                .getLasagna()
                .getLayerContainer(Grid.RENDERING_AREA_LAYER_NAME);
            const renderingAreaLayerRect = renderingAreaLayer.selectAll("rect");
            expect(renderingAreaLayer.nodes().length).toEqual(1);
            expect(renderingAreaLayerRect.nodes().length).toEqual(1);
            expect(renderingAreaLayerRect.attr("pointer-events")).toEqual(
                "all"
            );
            expect(renderingAreaLayerRect.attr("fill")).toEqual("transparent");
        });

        it("should build borders as configured", () => {
            const config = new GridConfig();
            config.borders.top = cloneDeep(testBorderConfig);
            config.borders.right = cloneDeep(testBorderConfig);
            config.borders.bottom = cloneDeep(testBorderConfig);
            config.borders.left = cloneDeep(testBorderConfig);
            grid.config(config);

            grid.build();
            const gridElementsLayer = grid
                .getLasagna()
                .getLayerContainer(Grid.GRID_ELEMENTS_LAYER_NAME);
            const borderSelections: D3Selection = gridElementsLayer.selectAll(
                `.${testBorderConfig.className}`
            );
            expect(borderSelections.nodes().length).toEqual(4);
            borderSelections.nodes().forEach((borderNode) => {
                // @ts-ignore: Disabled for testing purposes
                expect(borderNode.style.stroke).toEqual(testBorderConfig.color);
                expect(borderNode.style.strokeWidth).toEqual(
                    `${testBorderConfig.width}`
                );
            });
        });

        it("should not create borders if they aren't configured", () => {
            grid.build();
            const gridElementsLayer = grid
                .getLasagna()
                .getLayerContainer(Grid.GRID_ELEMENTS_LAYER_NAME);
            const borderSelections = gridElementsLayer.selectAll(
                `.${Grid.DEFAULT_BORDER_CLASS_NAME}`
            );
            expect(borderSelections.nodes().length).toEqual(0);
        });

        it("should only create borders that are actually configured", () => {
            const config = new GridConfig();
            config.borders.top = new BorderConfig();
            config.borders.right = new BorderConfig();
            config.borders.left = new BorderConfig();
            grid.config(config);

            grid.build();
            const gridElementsLayer = grid
                .getLasagna()
                .getLayerContainer(Grid.GRID_ELEMENTS_LAYER_NAME);
            const borderSelections = gridElementsLayer.selectAll(
                `.${Grid.DEFAULT_BORDER_CLASS_NAME}`
            );
            expect(borderSelections.nodes().length).toEqual(3);
        });

        it("should create borders whose 'visible' property is set to 'false'", () => {
            const config = new GridConfig();
            config.borders.left = new BorderConfig();
            config.borders.left.visible = false;
            grid.config(config);

            grid.build();
            const gridElementsLayer = grid
                .getLasagna()
                .getLayerContainer(Grid.GRID_ELEMENTS_LAYER_NAME);
            const borderSelections = gridElementsLayer.selectAll(
                `.${Grid.DEFAULT_BORDER_CLASS_NAME}`
            );
            expect(borderSelections.nodes().length).toEqual(1);
        });

        it("should use the default border class name if a custom name isn't specified", () => {
            const config = new GridConfig();
            config.borders.top = new BorderConfig();
            grid.config(config);

            grid.build();
            const gridElementsLayer = grid
                .getLasagna()
                .getLayerContainer(Grid.GRID_ELEMENTS_LAYER_NAME);
            const borderSelections = gridElementsLayer.selectAll(
                `.${Grid.DEFAULT_BORDER_CLASS_NAME}`
            );
            expect(borderSelections.nodes().length).toEqual(1);
        });

        it("should adjust the clip path and rendering area according to the configured width and height", () => {
            const gridWidth = 10;
            const gridHeight = 20;
            const expectedClipPathWidth = gridWidth;
            const expectedClipPathHeight =
                gridHeight + Grid.RENDER_AREA_HEIGHT_CORRECTION;
            const expectedRenderAreaWidth =
                gridWidth - Grid.RENDER_AREA_WIDTH_CORRECTION;
            const expectedRenderAreaHeight =
                gridHeight + Grid.RENDER_AREA_HEIGHT_CORRECTION;
            const config = new GridConfig();
            config.dimension.width(gridWidth);
            config.dimension.height(gridHeight);
            grid.config(config);

            grid.build();
            const clipPathRect = grid.target().selectAll("clipPath rect");
            expect(clipPathRect.attr("width")).toEqual(
                `${expectedClipPathWidth}`
            );
            expect(clipPathRect.attr("height")).toEqual(
                `${expectedClipPathHeight}`
            );
            expect(clipPathRect.attr("y")).toEqual(
                `${-Grid.RENDER_AREA_HEIGHT_CORRECTION}`
            );

            const renderingAreaLayer = grid
                .getLasagna()
                .getLayerContainer(Grid.RENDERING_AREA_LAYER_NAME);
            const renderingArea = renderingAreaLayer.select("rect");
            expect(renderingArea.attr("width")).toEqual(
                `${expectedRenderAreaWidth}`
            );
            expect(renderingArea.attr("height")).toEqual(
                `${expectedRenderAreaHeight}`
            );
            expect(renderingArea.attr("y")).toEqual(
                `${-Grid.RENDER_AREA_HEIGHT_CORRECTION}`
            );
        });

        it("should not allow the clip path and rendering area to have negative dimensions", () => {
            const gridWidth = 0.5;
            const gridHeight = 0.5;
            const expectedClipPathWidth = gridWidth;
            const expectedClipPathHeight =
                gridHeight + Grid.RENDER_AREA_HEIGHT_CORRECTION;
            const expectedRenderAreaWidth = 0;
            const expectedRenderAreaHeight =
                gridHeight + Grid.RENDER_AREA_HEIGHT_CORRECTION;
            const config = new GridConfig();
            config.dimension.width(gridWidth);
            config.dimension.height(gridHeight);
            grid.config(config);

            grid.build();

            const clipPathRect = grid.target().selectAll("clipPath rect");
            expect(clipPathRect.attr("width")).toEqual(
                `${expectedClipPathWidth}`
            );
            expect(clipPathRect.attr("height")).toEqual(
                `${expectedClipPathHeight}`
            );
            expect(clipPathRect.attr("y")).toEqual(
                `${-Grid.RENDER_AREA_HEIGHT_CORRECTION}`
            );

            const renderingAreaLayer = grid
                .getLasagna()
                .getLayerContainer(Grid.RENDERING_AREA_LAYER_NAME);
            const renderingArea = renderingAreaLayer.select("rect");
            expect(renderingArea.attr("width")).toEqual(
                `${expectedRenderAreaWidth}`
            );
            expect(renderingArea.attr("height")).toEqual(
                `${expectedRenderAreaHeight}`
            );
            expect(renderingArea.attr("y")).toEqual(
                `${-Grid.RENDER_AREA_HEIGHT_CORRECTION}`
            );
        });

        it(`should not apply disabled dimension corrections when adjusting the clip path
            and rendering area according to the configured width and height`, () => {
            const gridWidth = 10;
            const gridHeight = 20;
            const expectedClipPathWidth = gridWidth;
            const expectedClipPathHeight = gridHeight;
            const expectedRenderAreaWidth = gridWidth;
            const expectedRenderAreaHeight = gridHeight;
            const config = new GridConfig();

            // disable the dimension corrections
            config.disableRenderAreaHeightCorrection = true;
            config.disableRenderAreaWidthCorrection = true;

            config.dimension.width(gridWidth);
            config.dimension.height(gridHeight);
            grid.config(config);

            grid.build();
            const clipPathRect = grid.target().selectAll("clipPath rect");
            expect(clipPathRect.attr("width")).toEqual(
                `${expectedClipPathWidth}`
            );
            expect(clipPathRect.attr("height")).toEqual(
                `${expectedClipPathHeight}`
            );
            expect(clipPathRect.attr("y") === null).toEqual(true);

            const renderingAreaLayer = grid
                .getLasagna()
                .getLayerContainer(Grid.RENDERING_AREA_LAYER_NAME);
            const renderingArea = renderingAreaLayer.select("rect");
            expect(renderingArea.attr("width")).toEqual(
                `${expectedRenderAreaWidth}`
            );
            expect(renderingArea.attr("height")).toEqual(
                `${expectedRenderAreaHeight}`
            );
            expect(renderingArea.attr("y") === null).toEqual(true);
        });

        it("should return the grid instance", () => {
            const gridInstance = grid.build();
            expect(gridInstance instanceof Grid).toEqual(true);
        });
    });

    describe("update", () => {
        it("should not update the borders if the scales are empty", () => {
            const config = new GridConfig();
            config.borders.top = cloneDeep(testBorderConfig);
            config.borders.right = cloneDeep(testBorderConfig);
            config.borders.bottom = cloneDeep(testBorderConfig);
            config.borders.left = cloneDeep(testBorderConfig);
            grid.scales = {};
            grid.config(config);

            grid.build();
            grid.update();

            const gridElementsLayer = grid
                .getLasagna()
                .getLayerContainer(Grid.GRID_ELEMENTS_LAYER_NAME);
            const borderSelections: D3Selection = gridElementsLayer.selectAll(
                `.${testBorderConfig.className}`
            );
            expect(borderSelections.nodes().length).toEqual(4);
            borderSelections.nodes().forEach((borderNode: Element) => {
                expect(borderNode.getAttribute("x1")).toBeNull();
                expect(borderNode.getAttribute("y1")).toBeNull();
                expect(borderNode.getAttribute("x2")).toBeNull();
                expect(borderNode.getAttribute("y2")).toBeNull();
                expect(borderNode.getAttribute("class")).not.toContain(
                    "hidden"
                );
            });
        });

        it("should update the borders if the scales are not empty", () => {
            const config = new GridConfig();
            config.borders.top = cloneDeep(testBorderConfig);
            config.borders.right = cloneDeep(testBorderConfig);
            config.borders.bottom = cloneDeep(testBorderConfig);
            config.borders.left = cloneDeep(testBorderConfig);
            grid.config(config);
            grid.scales = testScalesIndex;

            grid.build();
            grid.update();

            const gridElementsLayer = grid
                .getLasagna()
                .getLayerContainer(Grid.GRID_ELEMENTS_LAYER_NAME);
            const borderSelections: D3Selection = gridElementsLayer.selectAll(
                `.${testBorderConfig.className}`
            );
            expect(borderSelections.nodes().length).toEqual(4);
            borderSelections.nodes().forEach((borderNode: Element) => {
                expect(borderNode.getAttribute("x1")).not.toBeNull();
                expect(borderNode.getAttribute("y1")).not.toBeNull();
                expect(borderNode.getAttribute("x2")).not.toBeNull();
                expect(borderNode.getAttribute("y2")).not.toBeNull();
                expect(borderNode.getAttribute("class")).toContain("hidden");
            });
        });

        it("should not adjust the clip path or rendering area if the scales are empty", () => {
            const gridWidth = 10;
            const gridHeight = 20;
            const config = new GridConfig();
            config.dimension.width(gridWidth);
            config.dimension.height(gridHeight);
            grid.config(config);

            grid.build();
            let clipPathRect = grid.target().selectAll("clipPath rect");
            expect(clipPathRect.attr("width")).toEqual(`${gridWidth}`);
            expect(clipPathRect.attr("height")).toEqual(
                `${gridHeight + Grid.RENDER_AREA_HEIGHT_CORRECTION}`
            );
            expect(clipPathRect.attr("y")).toEqual(
                `${-Grid.RENDER_AREA_HEIGHT_CORRECTION}`
            );

            const renderingAreaLayer = grid
                .getLasagna()
                .getLayerContainer(Grid.RENDERING_AREA_LAYER_NAME);
            let renderingArea = renderingAreaLayer.select("rect");
            expect(renderingArea.attr("width")).toEqual(
                `${gridWidth - Grid.RENDER_AREA_WIDTH_CORRECTION}`
            );
            expect(renderingArea.attr("height")).toEqual(
                `${gridHeight + Grid.RENDER_AREA_HEIGHT_CORRECTION}`
            );
            expect(renderingArea.attr("y")).toEqual(
                `${-Grid.RENDER_AREA_HEIGHT_CORRECTION}`
            );

            config.dimension.width(gridWidth + 1);
            config.dimension.height(gridHeight + 1);
            grid.config(config);

            grid.update();

            clipPathRect = grid.target().selectAll("clipPath rect");
            expect(clipPathRect.attr("width")).toEqual(`${gridWidth}`);
            expect(clipPathRect.attr("height")).toEqual(
                `${gridHeight + Grid.RENDER_AREA_HEIGHT_CORRECTION}`
            );
            expect(clipPathRect.attr("y")).toEqual(
                `${-Grid.RENDER_AREA_HEIGHT_CORRECTION}`
            );

            renderingArea = renderingAreaLayer.select("rect");
            expect(renderingArea.attr("width")).toEqual(
                `${gridWidth - Grid.RENDER_AREA_WIDTH_CORRECTION}`
            );
            expect(renderingArea.attr("height")).toEqual(
                `${gridHeight + Grid.RENDER_AREA_HEIGHT_CORRECTION}`
            );
            expect(renderingArea.attr("y")).toEqual(
                `${-Grid.RENDER_AREA_HEIGHT_CORRECTION}`
            );
        });

        it("should adjust the clip path and rendering area if the scales are not empty", () => {
            const originalGridWidth = 10;
            const originalGridHeight = 20;
            const config = new GridConfig();
            config.dimension.width(originalGridWidth);
            config.dimension.height(originalGridHeight);
            grid.config(config);

            grid.build();
            let clipPathRect = grid.target().selectAll("clipPath rect");
            expect(clipPathRect.attr("width")).toEqual(`${originalGridWidth}`);
            expect(clipPathRect.attr("height")).toEqual(
                `${originalGridHeight + Grid.RENDER_AREA_HEIGHT_CORRECTION}`
            );
            expect(clipPathRect.attr("y")).toEqual(
                `${-Grid.RENDER_AREA_HEIGHT_CORRECTION}`
            );

            const renderingAreaLayer = grid
                .getLasagna()
                .getLayerContainer(Grid.RENDERING_AREA_LAYER_NAME);
            let renderingArea = renderingAreaLayer.select("rect");
            expect(renderingArea.attr("width")).toEqual(
                `${originalGridWidth - Grid.RENDER_AREA_WIDTH_CORRECTION}`
            );
            expect(renderingArea.attr("height")).toEqual(
                `${originalGridHeight + Grid.RENDER_AREA_HEIGHT_CORRECTION}`
            );
            expect(renderingArea.attr("y")).toEqual(
                `${-Grid.RENDER_AREA_HEIGHT_CORRECTION}`
            );

            config.dimension.width(originalGridWidth + 1);
            config.dimension.height(originalGridHeight + 1);
            grid.config(config);
            grid.scales = testScalesIndex;

            grid.update();

            clipPathRect = grid.target().selectAll("clipPath rect");
            expect(clipPathRect.attr("width")).toEqual(
                `${originalGridWidth + 1}`
            );
            expect(clipPathRect.attr("height")).toEqual(
                `${originalGridHeight + Grid.RENDER_AREA_HEIGHT_CORRECTION + 1}`
            );
            expect(clipPathRect.attr("y")).toEqual(
                `${-Grid.RENDER_AREA_HEIGHT_CORRECTION}`
            );

            renderingArea = renderingAreaLayer.select("rect");
            expect(renderingArea.attr("width")).toEqual(
                `${originalGridWidth - Grid.RENDER_AREA_WIDTH_CORRECTION + 1}`
            );
            expect(renderingArea.attr("height")).toEqual(
                `${originalGridHeight + Grid.RENDER_AREA_HEIGHT_CORRECTION + 1}`
            );
            expect(renderingArea.attr("y")).toEqual(
                `${-Grid.RENDER_AREA_HEIGHT_CORRECTION}`
            );
        });

        it("should return the grid instance if the scales are empty", () => {
            const gridInstance = grid.update();
            expect(gridInstance instanceof Grid).toEqual(true);
        });

        it("should return the grid instance if the scales are not empty", () => {
            grid.scales = testScalesIndex;
            grid.build();
            const gridInstance = grid.update();
            expect(gridInstance instanceof Grid).toEqual(true);
        });
    });

    describe("updateDimensions", () => {
        it("should update the dimension config outer width", () => {
            const expectedWidth = 4;
            grid.build();

            grid.updateDimensions({ width: expectedWidth });

            expect(grid.config().dimension.outerHeight()).toEqual(0);
            expect(grid.config().dimension.outerWidth()).toEqual(
                expectedWidth - Grid.TICK_DIMENSION_CORRECTION
            );
        });

        it("should update the dimension config outer height", () => {
            const expectedHeight = 4;
            grid.build();

            grid.updateDimensions({ height: expectedHeight });

            expect(grid.config().dimension.outerWidth()).toEqual(0);
            expect(grid.config().dimension.outerHeight()).toEqual(
                expectedHeight
            );
        });

        it("should update the clip path dimensions", () => {
            const expectedHeight = 4;
            const expectedWidth = 8;
            grid.build();

            let clipPathRect = grid.target().selectAll("clipPath rect");
            expect(clipPathRect.attr("width")).toEqual("0");
            expect(clipPathRect.attr("height")).toEqual(
                `${0 + Grid.RENDER_AREA_HEIGHT_CORRECTION}`
            );
            expect(clipPathRect.attr("y")).toEqual(
                `${-Grid.RENDER_AREA_HEIGHT_CORRECTION}`
            );

            grid.updateDimensions({
                height: expectedHeight,
                width: expectedWidth,
            });

            clipPathRect = grid.target().selectAll("clipPath rect");
            expect(clipPathRect.attr("height")).toEqual(
                `${expectedHeight + Grid.RENDER_AREA_HEIGHT_CORRECTION}`
            );
            expect(clipPathRect.attr("width")).toEqual(
                `${expectedWidth - Grid.TICK_DIMENSION_CORRECTION}`
            );
            expect(clipPathRect.attr("y")).toEqual(
                `${-Grid.RENDER_AREA_HEIGHT_CORRECTION}`
            );
        });

        it("should update the rendering area dimensions", () => {
            const expectedHeight = 4;
            const expectedWidth = 8;
            grid.build();

            const renderingAreaLayer = grid
                .getLasagna()
                .getLayerContainer(Grid.RENDERING_AREA_LAYER_NAME);
            let renderingArea = renderingAreaLayer.select("rect");
            expect(renderingArea.attr("width")).toEqual("0");
            expect(renderingArea.attr("height")).toEqual(
                `${Grid.RENDER_AREA_HEIGHT_CORRECTION}`
            );
            expect(renderingArea.attr("y")).toEqual(
                `${-Grid.RENDER_AREA_HEIGHT_CORRECTION}`
            );

            grid.updateDimensions({
                height: expectedHeight,
                width: expectedWidth,
            });

            renderingArea = renderingAreaLayer.select("rect");
            expect(renderingArea.attr("height")).toEqual(
                `${expectedHeight + Grid.RENDER_AREA_HEIGHT_CORRECTION}`
            );
            expect(renderingArea.attr("width")).toEqual(
                `${
                    expectedWidth -
                    Grid.TICK_DIMENSION_CORRECTION -
                    Grid.RENDER_AREA_WIDTH_CORRECTION
                }`
            );
            expect(renderingArea.attr("y")).toEqual(
                `${-Grid.RENDER_AREA_HEIGHT_CORRECTION}`
            );
        });

        it("should invoke updateRanges", () => {
            grid.build();

            spyOn(grid, "updateRanges");
            grid.updateDimensions({ height: 1 });

            expect(grid.updateRanges).toHaveBeenCalled();
        });

        it("should return the grid instance", () => {
            grid.build();
            const gridInstance = grid.updateDimensions({ height: 1 });
            expect(gridInstance instanceof Grid).toEqual(true);
        });
    });

    describe("updateRanges", () => {
        it("should invoke update", () => {
            spyOn(grid, "update");
            grid.updateRanges();
            expect(grid.update).toHaveBeenCalled();
        });

        it("should return the grid instance", () => {
            const gridInstance = grid.updateRanges();
            expect(gridInstance instanceof Grid).toEqual(true);
        });
    });
});
