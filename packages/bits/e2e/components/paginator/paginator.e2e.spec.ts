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

import { Page } from "@playwright/test";

import { PaginatorAtom } from "./paginator.atom";
import { Atom } from "../../atom";
import { test, expect, Helpers } from "../../setup";

test.describe("USERCONTROL paginator", () => {
    let basicPaginator: PaginatorAtom;
    let adjacentPaginator: PaginatorAtom;
    let virtualizedPaginator: PaginatorAtom;
    let bodyVirtualizedPaginator: PaginatorAtom;
    const adjacent = 2;
    const itemCount = 1012;
    const expectedItemsPerPage = "25";
    const pageTwenty = 20;
    const virtualizedPageCount = 2000;
    const virtualizedFirstPopupPage = 6;
    const virtualizedLastPopupPage = virtualizedPageCount - 1;

    const getDisplayingText = (
        itemsPerPage: number,
        page: number,
        totalItems: number
    ): string => {
        const endItem = Math.min(itemsPerPage * page, totalItems);
        const startItem = itemsPerPage * (page - 1) + 1;
        return `${startItem}-${endItem} of ${totalItems}`;
    };

    const openVirtualizedPopup = async (page: Page, appendToBody: boolean) => {
        await page
            .locator("#nui-demo-virtualized-paginators")
            .evaluate(element => {
                (element as HTMLElement).style.display = "block";
            });
        const paginator = appendToBody
            ? bodyVirtualizedPaginator
            : virtualizedPaginator;
        const popupRoot = appendToBody
            ? page.locator(".cdk-overlay-container")
            : paginator.getLocator();
        const popupArea = popupRoot.locator(".nui-popup__area:visible").first();
        const trigger = paginator.ellipsisLink(0);

        await trigger.focus();
        await page.keyboard.press("Enter");
        await expect(popupArea).toBeVisible();
        return { paginator, popupRoot, popupArea, trigger };
    };

    const openFocusOutPopup = async (
        page: Page,
        appendToBody: boolean,
        virtualized: boolean
    ) => {
        if (virtualized) {
            return openVirtualizedPopup(page, appendToBody);
        }
        await page.locator("#nui-demo-dynamic-paginators").evaluate(element => {
            (element as HTMLElement).style.display = "block";
        });
        const paginator = Atom.find<PaginatorAtom>(
            PaginatorAtom,
            appendToBody
                ? "nui-demo-body-dynamic-paginator"
                : "nui-demo-dynamic-paginator"
        );
        const popupRoot = appendToBody
            ? page.locator(".cdk-overlay-container")
            : paginator.getLocator();
        const popupArea = popupRoot.locator(".nui-popup__area:visible").first();
        const trigger = paginator.ellipsisLink(0);

        await trigger.focus();
        await page.keyboard.press("Enter");
        await expect(popupArea).toBeVisible();
        return { paginator, popupRoot, popupArea, trigger };
    };

    const updatePaginatorTotal = async (page: Page, virtualized: boolean) => {
        const input = page.locator(
            virtualized
                ? "#nui-demo-virtualized-total"
                : "#nui-demo-dynamic-total"
        );
        await input.evaluate(
            (element, total) => {
                if (!(element instanceof HTMLInputElement)) {
                    throw new Error("Paginator total input was not found.");
                }
                element.value = String(total);
                element.dispatchEvent(new Event("input", { bubbles: true }));
            },
            virtualized ? 20010 : 410
        );
    };

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("paginator/paginator-test", page);
        basicPaginator = Atom.find<PaginatorAtom>(
            PaginatorAtom,
            "nui-demo-basic-paginator"
        );
        adjacentPaginator = Atom.find<PaginatorAtom>(
            PaginatorAtom,
            "nui-demo-adjacent-paginator"
        );
        virtualizedPaginator = Atom.find<PaginatorAtom>(
            PaginatorAtom,
            "nui-demo-virtualized-paginator"
        );
        bodyVirtualizedPaginator = Atom.find<PaginatorAtom>(
            PaginatorAtom,
            "nui-demo-body-virtualized-paginator"
        );
    });

    test("should restore focus after Next becomes disabled inside a shadow root", async ({
        page,
    }) => {
        await page.locator("#nui-demo-dynamic-paginators").evaluate(element => {
            (element as HTMLElement).style.display = "block";
            const paginator = element.querySelector(
                "#nui-demo-dynamic-paginator"
            );
            if (!paginator) {
                throw new Error("Dynamic paginator fixture was not found.");
            }
            const shadowHost = document.createElement("div");
            shadowHost.id = "nui-demo-paginator-shadow-host";
            shadowHost.attachShadow({ mode: "open" }).appendChild(paginator);
            document.body.appendChild(shadowHost);
        });

        const paginator = page
            .locator("#nui-demo-paginator-shadow-host")
            .locator("#nui-demo-dynamic-paginator");
        const trigger = paginator.locator(".nui-paginator__dots").first();
        await trigger.press("Enter");

        const popupArea = paginator.locator(".nui-popup__area:visible").first();
        await expect(popupArea).toBeVisible();
        await popupArea
            .getByRole("button", { name: "Go to page 39", exact: true })
            .click();

        const nextPage = paginator.getByRole("button", {
            name: "Next Page",
            exact: true,
        });
        await nextPage.focus();
        await nextPage.click();

        await expect(nextPage).toBeDisabled();
        const currentPage = paginator.locator("button[aria-current=page]");
        await expect(currentPage).toHaveText("40");
        await expect(currentPage).toBeFocused();
    });

    [false, true].forEach(appendToBody => {
        [false, true].forEach(virtualized => {
            const testParameters = `appendToBody=${appendToBody}, virtualized=${virtualized}`;

            test(`should close the popup when a focused page is removed by a total update with ${testParameters}`, async ({
                page,
            }) => {
                const { paginator, popupArea } = await openFocusOutPopup(
                    page,
                    appendToBody,
                    virtualized
                );
                const pageButton = popupArea.getByRole("button", {
                    name: "Go to page 6",
                    exact: true,
                });
                await pageButton.focus();
                await expect(pageButton).toBeFocused();

                await updatePaginatorTotal(page, virtualized);

                await expect(popupArea).toBeHidden();
                await expect(
                    paginator.getLocator().locator("button[aria-current=page]")
                ).toBeFocused();
            });

            test(`should close the popup without stealing focus when blur has no related target with ${testParameters}`, async ({
                page,
            }) => {
                const { popupArea } = await openFocusOutPopup(
                    page,
                    appendToBody,
                    virtualized
                );
                const pageButton = popupArea.getByRole("button", {
                    name: "Go to page 6",
                    exact: true,
                });
                await pageButton.focus();

                await pageButton.evaluate(element => element.blur());

                await expect(popupArea).toBeHidden();
                await expect(page.locator("body")).toBeFocused();
            });

            test(`should keep the popup open if focus returns inside after blur with ${testParameters}`, async ({
                page,
            }) => {
                const { popupArea } = await openFocusOutPopup(
                    page,
                    appendToBody,
                    virtualized
                );
                const pageButton = popupArea.getByRole("button", {
                    name: "Go to page 6",
                    exact: true,
                });
                const nextPage = popupArea.getByRole("button", {
                    name: "Go to page 7",
                    exact: true,
                });
                await pageButton.focus();

                await popupArea.evaluate(element => {
                    const first = element.querySelector<HTMLButtonElement>(
                        "button[aria-label='Go to page 6']"
                    );
                    const next = element.querySelector<HTMLButtonElement>(
                        "button[aria-label='Go to page 7']"
                    );
                    if (!first || !next) {
                        throw new Error("Popup page buttons were not found.");
                    }
                    first.blur();
                    queueMicrotask(() => next.focus());
                });

                await expect(popupArea).toBeVisible();
                await expect(nextPage).toBeFocused();
            });

            test(`should close the popup and restore focus after selecting a page with ${testParameters}`, async ({
                page,
            }) => {
                const { paginator, popupArea } = await openFocusOutPopup(
                    page,
                    appendToBody,
                    virtualized
                );
                const pageButton = popupArea.getByRole("button", {
                    name: "Go to page 6",
                    exact: true,
                });
                await pageButton.focus();

                await page.keyboard.press("Enter");

                await expect(popupArea).toBeHidden();
                const currentPage = paginator
                    .getLocator()
                    .locator("button[aria-current=page]");
                await expect(currentPage).toHaveText("6");
                await expect(currentPage).toBeFocused();
            });
        });

        test(`should keep the popup open when its trigger retains focus during a total update with appendToBody=${appendToBody}`, async ({
            page,
        }) => {
            const { popupArea, trigger } = await openFocusOutPopup(
                page,
                appendToBody,
                false
            );
            await expect(trigger).toBeFocused();

            await updatePaginatorTotal(page, false);

            await expect(popupArea).toBeVisible();
            await expect(trigger).toBeFocused();
        });
    });

    [false, true].forEach(appendToBody => {
        test(`should keep rapid Tab navigation sequential across the virtualized popup boundary with appendToBody=${appendToBody}`, async ({
            page,
        }) => {
            const { paginator, popupArea } = await openVirtualizedPopup(
                page,
                appendToBody
            );
            const popupPageButtons = popupArea.locator(
                "button[aria-label^='Go to page ']"
            );

            expect(await paginator.pageCount()).toBe(virtualizedPageCount);
            await expect(popupPageButtons.first()).toHaveAttribute(
                "aria-label",
                `Go to page ${virtualizedFirstPopupPage}`
            );

            const initiallyRenderedPageCount = await popupPageButtons.count();
            expect(initiallyRenderedPageCount).toBeGreaterThan(1);
            expect(initiallyRenderedPageCount).toBeLessThan(
                virtualizedLastPopupPage - virtualizedFirstPopupPage + 1
            );

            const lastRenderedPage = popupPageButtons.last();
            await expect(lastRenderedPage).toHaveAttribute(
                "aria-label",
                /^Go to page \d+$/
            );
            const lastRenderedPageLabel = await lastRenderedPage.getAttribute(
                "aria-label"
            );
            const lastRenderedPageNumber = Number(
                lastRenderedPageLabel?.match(/^Go to page (\d+)$/)?.[1]
            );
            expect(lastRenderedPageNumber).toBeLessThan(
                virtualizedLastPopupPage
            );
            const nextLogicalPageNumber = lastRenderedPageNumber + 1;
            const nextLogicalPage = popupArea.getByRole("button", {
                name: `Go to page ${nextLogicalPageNumber}`,
                exact: true,
            });

            await lastRenderedPage.evaluate(element => {
                (element as HTMLElement).focus({ preventScroll: true });
            });
            await expect(lastRenderedPage).toBeFocused();
            await expect(nextLogicalPage).toHaveCount(0);

            await page.keyboard.press("Tab");

            await expect(nextLogicalPage).toBeFocused();
            await expect(popupArea).toBeVisible();

            const newLastRenderedPage = popupPageButtons.last();
            const newLastPageNumber = Number(
                (await newLastRenderedPage.getAttribute("aria-label"))?.match(
                    /\d+$/
                )?.[0]
            );
            await newLastRenderedPage.evaluate(element => {
                (element as HTMLElement).focus({ preventScroll: true });
            });
            await expect(newLastRenderedPage).toBeFocused();
            await expect(
                popupArea.getByRole("button", {
                    name: `Go to page ${newLastPageNumber + 1}`,
                    exact: true,
                })
            ).toHaveCount(0);
            const rapidTabCount = 5;
            for (let step = 0; step < rapidTabCount; step++) {
                await page.keyboard.press("Tab");
            }
            const finalRapidTabPage = popupArea.getByRole("button", {
                name: `Go to page ${newLastPageNumber + rapidTabCount}`,
                exact: true,
            });
            await expect(finalRapidTabPage).toBeFocused();
            await expect(popupArea).toBeVisible();
        });

        test(`should keep Shift+Tab inside the virtualized popup after scrolling in the middle with appendToBody=${appendToBody}`, async ({
            page,
        }) => {
            const { popupArea, popupRoot, trigger } =
                await openVirtualizedPopup(page, appendToBody);

            const viewport = popupArea.locator("cdk-virtual-scroll-viewport");
            await expect(viewport).toBeVisible();
            await viewport.evaluate(element => {
                const scrollViewport = element as HTMLElement;
                scrollViewport.scrollTop = scrollViewport.scrollHeight / 2;
            });
            await expect(
                popupArea.getByRole("button", {
                    name: "Go to page 1000",
                    exact: true,
                })
            ).toBeAttached();

            const firstRenderedPage = popupArea
                .locator(
                    "cdk-virtual-scroll-viewport button[aria-label^='Go to page ']"
                )
                .first();
            const firstRenderedPageLabel = await firstRenderedPage.getAttribute(
                "aria-label"
            );
            const firstRenderedPageNumber = Number(
                firstRenderedPageLabel?.match(/\d+$/)?.[0]
            );
            expect(firstRenderedPageNumber).toBeGreaterThan(500);
            expect(firstRenderedPageNumber).toBeLessThan(1500);

            const previousLogicalPage = popupArea.getByRole("button", {
                name: `Go to page ${firstRenderedPageNumber - 1}`,
                exact: true,
            });
            await firstRenderedPage.evaluate(element => {
                (element as HTMLElement).focus({ preventScroll: true });
            });
            await expect(firstRenderedPage).toBeFocused();

            await page.keyboard.press("Shift+Tab");

            await expect(previousLogicalPage).toBeFocused();
            await expect(popupArea).toBeVisible();

            await page.keyboard.press("Escape");
            await expect(trigger).toBeFocused();
            await expect(popupRoot.locator(".nui-popup__area")).toHaveCount(0);
            await page.keyboard.press("Enter");
            await page.keyboard.press("Tab");
            await expect(
                popupArea.getByRole("button", {
                    name: `Go to page ${virtualizedFirstPopupPage}`,
                    exact: true,
                })
            ).toBeFocused();
        });

        test(`should leave the virtualized popup only at its logical start and end with appendToBody=${appendToBody}`, async ({
            page,
        }) => {
            const { paginator, popupRoot, popupArea, trigger } =
                await openVirtualizedPopup(page, appendToBody);
            await page.keyboard.press("Tab");
            await expect(
                popupArea.getByRole("button", {
                    name: `Go to page ${virtualizedFirstPopupPage}`,
                    exact: true,
                })
            ).toBeFocused();

            await page.keyboard.press("Shift+Tab");
            await expect(trigger).toBeFocused();
            await expect(popupArea).toBeHidden();
            await expect(popupRoot.locator(".nui-popup__area")).toHaveCount(0);

            await page.keyboard.press("Enter");
            await expect(popupArea).toBeVisible();
            const viewport = popupArea.locator("cdk-virtual-scroll-viewport");
            await expect(viewport).toBeVisible();
            await viewport.evaluate(element => {
                const scrollViewport = element as HTMLElement;
                scrollViewport.scrollTop = scrollViewport.scrollHeight;
            });
            const lastPopupPage = popupArea.getByRole("button", {
                name: `Go to page ${virtualizedLastPopupPage}`,
                exact: true,
            });
            const finalPaginatorPage = paginator
                .getLocator()
                .getByRole("button", {
                    name: `Page ${virtualizedPageCount}`,
                    exact: true,
                });
            await expect(lastPopupPage).toBeAttached();
            await lastPopupPage.focus();
            await expect(lastPopupPage).toBeFocused();

            await page.keyboard.press("Tab");

            await expect(popupArea).toBeHidden();
            await expect(finalPaginatorPage).toBeFocused();
        });

        test(`should use the matching viewport when both paginator popups are virtualized with appendToBody=${appendToBody}`, async ({
            page,
        }) => {
            const { paginator, popupRoot, popupArea } =
                await openVirtualizedPopup(page, appendToBody);
            await popupArea
                .locator("cdk-virtual-scroll-viewport")
                .evaluate(element => {
                    const viewport = element as HTMLElement;
                    viewport.scrollTop = viewport.scrollHeight / 2;
                });
            await popupArea
                .getByRole("button", { name: "Go to page 1000", exact: true })
                .click();
            await expect(popupRoot.locator(".nui-popup__area")).toHaveCount(0);

            const secondTrigger = paginator.ellipsisLink(1);
            await expect(secondTrigger).toBeVisible();
            await secondTrigger.focus();
            await page.keyboard.press("Enter");
            await page.keyboard.press("Tab");
            const firstPage = popupArea.getByRole("button", {
                name: "Go to page 1002",
                exact: true,
            });
            await expect(firstPage).toBeFocused();
            await expect(popupArea).toBeVisible();

            const lastRenderedPage = popupArea
                .locator("button[aria-label^='Go to page ']")
                .last();
            const lastPageNumber = Number(
                (await lastRenderedPage.getAttribute("aria-label"))?.match(
                    /\d+$/
                )?.[0]
            );
            expect(lastPageNumber).toBeLessThan(virtualizedLastPopupPage);
            const nextPage = popupArea.getByRole("button", {
                name: `Go to page ${lastPageNumber + 1}`,
                exact: true,
            });
            await lastRenderedPage.evaluate(element => {
                (element as HTMLElement).focus({ preventScroll: true });
            });
            await expect(lastRenderedPage).toBeFocused();
            await expect(nextPage).toHaveCount(0);
            await page.keyboard.press("Tab");

            await expect(nextPage).toBeFocused();
            await expect(popupArea).toBeVisible();
        });
    });

    test(
        "should be " + itemCount + " items in paginator component",
        async () => {
            await expect(basicPaginator.status).toContainText(
                itemCount.toString()
            );
        }
    );

    test("should correctly report items per page", async () => {
        expect(await basicPaginator.getItemsRange()).toBe(expectedItemsPerPage);
    });

    test("should activate the page clicked", async () => {
        expect(await basicPaginator.activePage()).toBe(1);
        expect(await basicPaginator.isActivePage(3)).toBe(false);
        await basicPaginator.pageLinkClick(3);
        expect(await basicPaginator.isActivePage(1)).toBe(false);
        expect(await basicPaginator.isActivePage(3)).toBe(true);
        await basicPaginator.pageLinkClick(4);
        expect(await basicPaginator.isActivePage(1)).toBe(false);
        expect(await basicPaginator.isActivePage(3)).toBe(false);
        expect(await basicPaginator.isActivePage(4)).toBe(true);
        // Return to initial state
        await basicPaginator.pageLinkClick(1);
        expect(await basicPaginator.isActivePage(1)).toBe(true);
    });

    test("should honor 'Items per Page'", async () => {
        await basicPaginator.setItemsPerPage(10);
        expect(await basicPaginator.pageCount()).toEqual(102);
        await expect(basicPaginator.status).toHaveText(
            getDisplayingText(10, 1, itemCount)
        );

        await basicPaginator.pageLinkClick(5);
        await expect(basicPaginator.status).toHaveText(
            getDisplayingText(10, 5, itemCount)
        );

        await basicPaginator.pageLinkClick(5);
        await expect(basicPaginator.status).toHaveText(
            getDisplayingText(10, 6, itemCount)
        );

        await basicPaginator.setItemsPerPage(25);
        expect(await basicPaginator.pageCount()).toEqual(41);
        await expect(basicPaginator.status).toHaveText(
            getDisplayingText(25, 1, itemCount)
        );

        await basicPaginator.pageLinkClick(5);
        await expect(basicPaginator.status).toHaveText(
            getDisplayingText(25, 5, itemCount)
        );

        // Return to initial state
        await basicPaginator.pageLinkClick(1);
        await expect(basicPaginator.status).toHaveText(
            getDisplayingText(25, 1, itemCount)
        );
    });

    test("should display ellipsed page links on ellipsis click", async () => {
        expect(await basicPaginator.activePage()).toBe(1);
        expect(await basicPaginator.isActivePage(pageTwenty)).toBe(false);
        await basicPaginator.ellipsisLinkClick(0);
        await basicPaginator.ellipsedPageLinkClick(pageTwenty);
        expect(await basicPaginator.isActivePage(1)).toBe(false);
        expect(await basicPaginator.isActivePage(pageTwenty)).toBe(true);

        // Return to initial state
        await basicPaginator.pageLinkClick(1);
        expect(await basicPaginator.activePage()).toBe(1);
    });

    test("should display 2 ellipsis links when active page is not an endpoint link", async () => {
        expect(await basicPaginator.activePage()).toBe(1);
        expect(await basicPaginator.ellipsisLinkDisplayed(0)).toBe(true);
        expect(await basicPaginator.ellipsisLinkDisplayed(1)).toBe(false);
        await basicPaginator.ellipsisLinkClick(0);
        await basicPaginator.ellipsedPageLinkClick(pageTwenty);
        expect(await basicPaginator.isActivePage(pageTwenty)).toBe(true);
        expect(await basicPaginator.ellipsisLinkDisplayed(0)).toBe(true);
        expect(await basicPaginator.ellipsisLinkDisplayed(1)).toBe(true);

        // Return to initial state
        await basicPaginator.pageLinkClick(1);
        expect(await basicPaginator.activePage()).toBe(1);
    });

    test(
        "should display 'adjacent' page links on each side of the active page, " +
            "when the active page is not an endpoint link in adjacent paginator",
        async () => {
            await expect(adjacentPaginator.activePageLink).toHaveText("10");
            const pageCountAdjacent = await adjacentPaginator.pageCount();
            await expect(adjacentPaginator.ellipsisLink(1)).toBeVisible();
            await adjacentPaginator.ellipsisLink(1).click();
            await adjacentPaginator.ellipsedPageLinkClick(pageTwenty);

            await expect(adjacentPaginator.activePageLink).toHaveText(
                String(pageTwenty)
            );
            await expect(adjacentPaginator.pageLink(pageTwenty)).toBeVisible();

            // left adjacent
            await expect(
                adjacentPaginator.pageLink(pageTwenty - adjacent)
            ).toBeVisible();
            await expect(adjacentPaginator.pageLink(1)).toBeVisible();
            for (let i = pageTwenty - adjacent - 1; i > 1; --i) {
                await expect(adjacentPaginator.pageLink(i)).toBeHidden();
            }
            // right adjacent
            await expect(
                adjacentPaginator.pageLink(pageTwenty + adjacent)
            ).toBeVisible();
            await expect(
                adjacentPaginator.pageLink(pageCountAdjacent)
            ).toBeVisible();
            for (
                let i = pageTwenty + adjacent + 1;
                i < pageCountAdjacent;
                ++i
            ) {
                await expect(adjacentPaginator.pageLink(i)).toBeHidden();
            }

            // Return to initial state
            await expect(adjacentPaginator.ellipsisLink(0)).toBeVisible();
            await adjacentPaginator.ellipsisLink(0).click();
            await adjacentPaginator.ellipsedPageLinkClick(10);
            await expect(adjacentPaginator.activePageLink).toHaveText("10");
        }
    );

    test(`should click page number 15 from popup dialog and pages
        ${getDisplayingText(
            10,
            15,
            itemCount
        )} should be displayed`, async () => {
        await basicPaginator.setItemsPerPage(10);
        await basicPaginator.ellipsisLink(0).click();
        await basicPaginator.ellipsedPageLinkClick(15);
        // Use status locator for text assertion
        await expect(basicPaginator.status).toHaveText(
            getDisplayingText(10, 15, itemCount)
        );

        // Return to initial state
        await basicPaginator.setItemsPerPage(25);
        await expect(basicPaginator.status).toHaveText(
            getDisplayingText(25, 1, itemCount)
        );
    });

    test("should set the correct page on prev/next click", async () => {
        await basicPaginator.setItemsPerPage(10);
        expect(await basicPaginator.activePage()).toEqual(1);
        await basicPaginator.nextLink().click();
        expect(await basicPaginator.activePage()).toEqual(2);
        await basicPaginator.nextLink().click();
        expect(await basicPaginator.activePage()).toEqual(3);

        await basicPaginator.prevLink().click();
        expect(await basicPaginator.activePage()).toEqual(2);
        await basicPaginator.prevLink().click();
        expect(await basicPaginator.activePage()).toEqual(1);

        // Return to initial state
        await basicPaginator.setItemsPerPage(25);
        await expect(basicPaginator.status).toHaveText(
            getDisplayingText(25, 1, itemCount)
        );
    });

    ["Enter", "Space"].forEach(key => {
        test(`should preserve focus and Tab order after ${key} page and Next activation`, async ({
            page,
        }) => {
            const paginator = basicPaginator.getLocator();
            const pageThree = paginator.getByRole("button", {
                name: "Page 3",
                exact: true,
            });
            const pageFour = paginator.getByRole("button", {
                name: "Page 4",
                exact: true,
            });
            await pageThree.focus();
            await page.keyboard.press(key);

            await expect(pageThree).toHaveAttribute("aria-current", "page");
            await expect(pageThree).toBeFocused();
            await page.keyboard.press("Tab");
            await expect(pageFour).toBeFocused();
            await page.keyboard.press("Shift+Tab");
            await expect(pageThree).toBeFocused();

            const next = basicPaginator.nextLink();
            await next.focus();
            await page.keyboard.press(key);

            await expect(pageFour).toHaveAttribute("aria-current", "page");
            await expect(next).toBeFocused();
            await page.keyboard.press("Shift+Tab");
            await expect(
                paginator.getByRole("button", { name: "Page 41", exact: true })
            ).toBeFocused();
            await page.keyboard.press("Tab");
            await expect(next).toBeFocused();
        });

        test(`should recover focus and Tab order when Next and Previous become disabled using ${key}`, async ({
            page,
        }) => {
            const paginator = basicPaginator.getLocator();
            await paginator
                .getByRole("button", { name: "Page 41", exact: true })
                .press(key);
            const previous = basicPaginator.prevLink();
            const next = basicPaginator.nextLink();
            await previous.focus();
            await page.keyboard.press(key);
            await expect(
                paginator.getByRole("button", { name: "Page 40", exact: true })
            ).toHaveAttribute("aria-current", "page");

            await next.focus();
            await page.keyboard.press(key);
            const lastPage = paginator.getByRole("button", {
                name: "Page 41",
                exact: true,
            });
            await expect(next).toBeDisabled();
            await expect(lastPage).toBeFocused();
            await page.keyboard.press("Shift+Tab");
            await expect(
                paginator.getByRole("button", { name: "Page 40", exact: true })
            ).toBeFocused();
            await page.keyboard.press("Tab");
            await expect(lastPage).toBeFocused();

            await paginator
                .getByRole("button", { name: "Page 1", exact: true })
                .press(key);
            await next.focus();
            await page.keyboard.press(key);
            await expect(
                paginator.getByRole("button", { name: "Page 2", exact: true })
            ).toHaveAttribute("aria-current", "page");

            await previous.focus();
            await page.keyboard.press(key);
            const firstPage = paginator.getByRole("button", {
                name: "Page 1",
                exact: true,
            });
            await expect(previous).toBeDisabled();
            await expect(firstPage).toBeFocused();
            await page.keyboard.press("Tab");
            await expect(
                paginator.getByRole("button", { name: "Page 2", exact: true })
            ).toBeFocused();
            await page.keyboard.press("Shift+Tab");
            await expect(firstPage).toBeFocused();
        });

        [false, true].forEach(appendToBody => {
            test(`should recover focus and Tab order after ${key} popup selection with appendToBody=${appendToBody}`, async ({
                page,
            }) => {
                const paginator = appendToBody
                    ? Atom.find<PaginatorAtom>(
                          PaginatorAtom,
                          "nui-demo-body-paginator"
                      )
                    : basicPaginator;
                await paginator.ellipsisLink(0).focus();
                await page.keyboard.press(key);

                const popupRoot = appendToBody
                    ? page.locator(".cdk-overlay-container")
                    : paginator.getLocator();
                await page.keyboard.press("Tab");
                await expect(
                    popupRoot.getByRole("button", {
                        name: "Go to page 6",
                        exact: true,
                    })
                ).toBeFocused();
                const popupPage = popupRoot.getByRole("button", {
                    name: "Go to page 20",
                    exact: true,
                });
                for (
                    let index = 0;
                    index < 30 &&
                    !(await popupPage.evaluate(
                        element => element === document.activeElement
                    ));
                    index++
                ) {
                    await page.keyboard.press("Tab");
                }
                await expect(popupPage).toBeFocused();
                await page.keyboard.press(key);

                const currentPage = paginator.getLocator().getByRole("button", {
                    name: "Page 20",
                    exact: true,
                });
                await expect(currentPage).toHaveAttribute(
                    "aria-current",
                    "page"
                );
                await expect(currentPage).toBeFocused();
                await page.keyboard.press("Tab");
                await expect(
                    paginator.getLocator().getByRole("button", {
                        name: "Page 21",
                        exact: true,
                    })
                ).toBeFocused();
                await page.keyboard.press("Shift+Tab");
                await expect(currentPage).toBeFocused();
            });

            test(`should close the popup with Escape and return focus to the trigger after ${key} opens it with appendToBody=${appendToBody}`, async ({
                page,
            }) => {
                const paginator = appendToBody
                    ? Atom.find<PaginatorAtom>(
                          PaginatorAtom,
                          "nui-demo-body-paginator"
                      )
                    : basicPaginator;
                const trigger = paginator.ellipsisLink(0);
                const popupRoot = appendToBody
                    ? page.locator(".cdk-overlay-container")
                    : paginator.getLocator();
                // CSS locator: unlike getByRole it still matches while the closing popup is hidden but attached.
                const firstPopupPage = popupRoot.locator(
                    `button[aria-label="Go to page 6"]`
                );

                await trigger.focus();
                await page.keyboard.press(key);
                await page.keyboard.press("Tab");
                await expect(firstPopupPage).toBeFocused();
                await page.keyboard.press("Escape");

                await expect(firstPopupPage).toHaveCount(0);
                await expect(trigger).toBeFocused();

                await page.keyboard.press(key);
                await expect(firstPopupPage).toBeVisible();
                await page.keyboard.press("Escape");
                await expect(firstPopupPage).toHaveCount(0);
                await expect(trigger).toBeFocused();
            });

            test(`should close the popup when focus leaves it after ${key} opens it with appendToBody=${appendToBody}`, async ({
                page,
            }) => {
                const paginator = appendToBody
                    ? Atom.find<PaginatorAtom>(
                          PaginatorAtom,
                          "nui-demo-body-paginator"
                      )
                    : basicPaginator;
                const trigger = paginator.ellipsisLink(0);
                const popupRoot = appendToBody
                    ? page.locator(".cdk-overlay-container")
                    : paginator.getLocator();
                const firstPopupPage = popupRoot.locator(
                    `button[aria-label="Go to page 6"]`
                );

                await trigger.focus();
                await page.keyboard.press(key);
                await expect(firstPopupPage).toBeVisible();
                await page.keyboard.press("Tab");
                await expect(firstPopupPage).toBeFocused();
                await page.keyboard.press("Shift+Tab");
                await expect(trigger).toBeFocused();
                await expect(firstPopupPage).toHaveCount(0);

                await page.keyboard.press(key);
                await expect(firstPopupPage).toBeVisible();
                await paginator.nextLink().focus();
                await expect(firstPopupPage).toHaveCount(0);
            });
        });

        test(`should close an open popup when ${key} opens the popup of another paginator`, async ({
            page,
        }) => {
            const bodyPaginator = Atom.find<PaginatorAtom>(
                PaginatorAtom,
                "nui-demo-body-paginator"
            );
            const basicPopupPage = basicPaginator
                .getLocator()
                .locator(`button[aria-label="Go to page 6"]`);
            const bodyPopupPage = page
                .locator(".cdk-overlay-container")
                .locator(`button[aria-label="Go to page 6"]`);

            await basicPaginator.ellipsisLink(0).focus();
            await page.keyboard.press(key);
            await expect(basicPopupPage).toBeVisible();

            await bodyPaginator.ellipsisLink(0).focus();
            await expect(basicPopupPage).toHaveCount(0);
            await page.keyboard.press(key);

            await expect(bodyPopupPage).toBeVisible();
            await expect(basicPopupPage).toHaveCount(0);
        });
    });
});
