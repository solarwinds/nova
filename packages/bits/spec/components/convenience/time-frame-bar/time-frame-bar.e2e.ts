import moment from "moment/moment";

import { Animations, Helpers } from "../../../helpers";
import { TimeFrameBarTestPage } from "./time-frame-bar-test.po";

describe("CONVENIENCE COMPONENTS", () => {
    describe("TimeFrameBar", () => {
        const page = new TimeFrameBarTestPage();
        const baseDate = moment([2018, 5, 1, 15, 0, 0]);
        const minDate = baseDate.clone().subtract(1, "month");
        const maxDate = moment([2050]);

        beforeAll(async () => {
            await Helpers.prepareBrowser("convenience/time-frame-bar/test");
            await Helpers.disableCSSAnimations(Animations.ALL);
        });

        beforeEach(async () => {
            await page.reset();
        });

        it("should have 'prev' and 'next' buttons enabled by default", async () => {
            expect(await page.timeFrameBar.nextButton.isDisabled()).toEqual(
                false
            );
            expect(await page.timeFrameBar.prevButton.isDisabled()).toEqual(
                false
            );
        });

        it("should not show 'undo' and 'clear' buttons by default", async () => {
            expect(await page.timeFrameBar.undoButton.isPresent()).toEqual(
                false
            );
            expect(await page.timeFrameBar.clearButton.isPresent()).toEqual(
                false
            );
        });

        it("should show just 'clear' button after zoom in once", async () => {
            await page.zoomIn();

            expect(await page.timeFrameBar.undoButton.isPresent()).toEqual(
                false
            );
            expect(await page.timeFrameBar.clearButton.isDisplayed()).toEqual(
                true
            );
        });

        it("should show both 'undo' and 'clear' buttons after zoom in twice", async () => {
            await page.zoomIn();
            await page.zoomIn();

            expect(await page.timeFrameBar.undoButton.isDisplayed()).toEqual(
                true
            );
            expect(await page.timeFrameBar.clearButton.isDisplayed()).toEqual(
                true
            );
        });

        describe("should reset zoom after", () => {
            beforeEach(async () => {
                await page.zoomIn();
                await page.zoomIn();

                expect(
                    await page.timeFrameBar.undoButton.isDisplayed()
                ).toEqual(true);
                expect(
                    await page.timeFrameBar.clearButton.isDisplayed()
                ).toEqual(true);
            });

            afterEach(async () => {
                expect(await page.timeFrameBar.undoButton.isPresent()).toEqual(
                    false
                );
                expect(await page.timeFrameBar.clearButton.isPresent()).toEqual(
                    false
                );
            });

            it("shifting to earlier time frame", async () => {
                await page.timeFrameBar.prevButton.click();
            });

            it("shifting to later time frame", async () => {
                await page.timeFrameBar.nextButton.click();
            });

            it("selecting new preset from quick picker", async () => {
                await page.timeFrameBar.quickPickPreset("Last 7 days");
            });

            it("setting new time range with time frame picker", async () => {
                await page.timeFrameBar.pickTimeFrame(
                    baseDate.clone().subtract(3, "weeks"),
                    baseDate.clone()
                );
            });
        });

        describe("when time frame is out of limits", () => {
            it("should disable 'prev' button", async () => {
                await page.timeFrameBar.pickTimeFrame(
                    minDate,
                    baseDate.clone()
                );

                expect(await page.timeFrameBar.prevButton.isDisabled()).toEqual(
                    true
                );
                expect(await page.timeFrameBar.nextButton.isDisabled()).toEqual(
                    false
                );
            });

            it("should disable 'next' button", async () => {
                await page.timeFrameBar.pickTimeFrame(
                    baseDate.clone(),
                    maxDate
                );

                expect(await page.timeFrameBar.nextButton.isDisabled()).toEqual(
                    true
                );
                expect(await page.timeFrameBar.prevButton.isDisabled()).toEqual(
                    false
                );
            });
        });
    });
});
