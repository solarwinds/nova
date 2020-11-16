import { browser } from "protractor";
import { ISize } from "selenium-webdriver";

import { Atom } from "../../atom";
import { ResizerAtom } from "../../directives/public_api";
import { Animations, Helpers } from "../../helpers";
import { PanelAtom } from "../public_api";

describe("USERCONTROL Panel", () => {
    const pageToken = "panel";

    describe("Basic", () => {
        const panel = Atom.find(PanelAtom, "nui-demo-basic-panel");

        beforeAll(async () => {
            await Helpers.prepareBrowser(`${pageToken}/basic`);
        });

        it("Check that components are correctly transcluded into the panel", async () => {
            expect(await panel.isDisplayed()).toBe(true);
        });

        it("Should not display button when isCollapsible is false", async () => {
            expect(await panel.isToggleIconPresent()).toBe(false);
        });
    });

    describe("Collapsible", () => {
        const panel = Atom.find(PanelAtom, "nui-demo-collapsible-panel");

        beforeAll(async () => {
            await Helpers.prepareBrowser(`${pageToken}/collapsible`);
        });

        it("Should toggle panel css class upon icon click ", async () => {
            await browser.wait(async () => await panel.isCollapsed(), 1000);

            expect(await panel.isExpanded()).toBe(false, "initial state of panel to be collapsed");
            expect(await panel.isCollapsed()).toBe(true, "initial state of panel to be collapsed");

            await panel.toggleExpanded();

            expect(await panel.isCollapsed()).toBe(false, "check if panel is expanded upon click");
            expect(await panel.isExpanded()).toBe(true, "check if panel is expanded upon click");

            await panel.toggleExpanded();

            expect(await panel.isCollapsed()).toBe(true, "check if panel is collapsed upon second click");
            expect(await panel.isExpanded()).toBe(false, "check if panel is collapsed upon second click");
        });
    });

    describe("Hidden", () => {
        const panel = Atom.find(PanelAtom, "nui-demo-hidden-panel");

        beforeAll(async () => {
            await Helpers.prepareBrowser(`${pageToken}/hidden`);
        });

        describe("Check embedded content", () => {
            it("Should display footer", async () => {
                expect(await panel.isFooterDisplayed()).toEqual(true);
            });

            it("Should display header", async () => {
                expect(await panel.isHeaderDisplayed()).toEqual(true);
            });
        });

        it("should hide/unhide the left pane when hideLeftPane is toggled", async () => {
            expect(await panel.isPaneDisplayed("left")).toEqual(true);
            await panel.closeSidePane();
            expect(await panel.isPaneDisplayed("left")).toEqual(false);
        });

    });

    describe("Floating", () => {
        const panel = Atom.find(PanelAtom, "nui-demo-floating-panel");

        beforeEach(async () => {
            await Helpers.prepareBrowser(`${pageToken}/floating`);
        });

        it("should not change width of center pane while displaying floating panel", async () => {
            const oldCenterPaneSize: ISize = await panel.getCenterPaneElementSize();
            await panel.hoverOnSidePane();
            const newCenterPaneSize: ISize = await panel.getCenterPaneElementSize();
            expect(oldCenterPaneSize.width).toEqual(newCenterPaneSize.width);
        });

    });

    describe("Resize", () => {
        const panel = Atom.find(PanelAtom, "nui-demo-resizable-panel");
        const gutter = Atom.find(ResizerAtom, "nui-demo-resizable-panel");

        beforeEach(async () => {
            await Helpers.prepareBrowser(`${pageToken}/resize`);
            await Helpers.disableCSSAnimations(Animations.ALL);
        });

        it("should have horizontal resize direction", async () => {
            expect(await gutter.getResizeDirection()).toEqual("horizontal", "should have correct resize direction");
        });

        it("should make side panel bigger", async () => {
            const oldCenterPaneSize = await panel.getCenterPaneElementSize();
            await gutter.moveRight(300);
            const newCenterPaneSize = await panel.getCenterPaneElementSize();
            await expect(oldCenterPaneSize.width).toEqual(newCenterPaneSize.width + 300);
        });

        it("should make side panel smaller", async () => {
            const oldCenterPaneSize = await panel.getCenterPaneElementSize();
            await gutter.moveLeft(100);
            const newCenterPaneSize = await panel.getCenterPaneElementSize();
            await expect(oldCenterPaneSize.width).toEqual(newCenterPaneSize.width - 100);
        });

        it("should not resize when panel is collapsed", async () => {
            await panel.toggleExpanded();
            await expect(await panel.isCollapsed()).toBe(true);

            await panel.toggleExpanded();
            await expect(await panel.isCollapsed()).toBe(false);
            const oldExpandedCenterPaneSize = await panel.getCenterPaneElementSize();
            await gutter.moveRight(300);

            const newExpandedCenterPaneSize = await panel.getCenterPaneElementSize();
            await expect(oldExpandedCenterPaneSize.width).toBeGreaterThan(newExpandedCenterPaneSize.width);
        });

        it("should correctly resize panel when it's size was set in percents and window size was changed", async () => {
            // await browser.refresh();
            const originalSize = await browser.manage().window().getSize();

            try {
                await browser.manage().window().setSize(600, 880);

                const oldSidePaneSize = await panel.getSidePaneElementSize();
                await gutter.moveRight(200);
                const newSidePaneSize = await panel.getSidePaneElementSize();
                await expect(newSidePaneSize.width).toBeGreaterThan(oldSidePaneSize.width);

                await browser.manage().window().setSize(1200, 880);
                const oldSidePaneSizeResized = await panel.getSidePaneElementSize();
                await gutter.moveLeft(200);
                const newSidePaneSizeResized = await panel.getSidePaneElementSize();
                await expect(oldSidePaneSizeResized.width).toBeGreaterThan(newSidePaneSizeResized.width);

            } finally {
                // Restoring the initial window size
                await browser.manage().window().setSize(originalSize.width, originalSize.height);
            }
        });
    });
});
