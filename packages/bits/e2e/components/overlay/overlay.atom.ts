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

import { Locator } from "playwright-core";

import { Atom } from "../../atom";
import { Helpers, expect } from "../../setup";

export class OverlayAtom extends Atom {
    get cdkContainerPane(): Locator {
        return Helpers.page.locator(`.${OverlayAtom.CDK_CONTAINER_PANE}`);
    }
    get cdkContainerBox(): Locator {
        return Helpers.page.locator(`.${OverlayAtom.CDK_CONTAINER_BOX}`);
    }
    get cdkContainer(): Locator {
        return Helpers.page.locator(`.${OverlayAtom.CDK_CONTAINER}`);
    }

    public static CSS_CLASS = "nui-overlay";
    public static CDK_CONTAINER = "cdk-overlay-container";
    public static CDK_CONTAINER_BOX =
        "cdk-overlay-connected-position-bounding-box";
    public static CDK_CONTAINER_PANE = "cdk-overlay-pane";

    public async isOpened(): Promise<boolean> {
        return this.cdkContainerPane.isVisible();
    }

    public async toBeOpened(): Promise<void> {
        await expect(this.cdkContainerPane).toBeVisible();
    }
    public async toNotBeOpened(): Promise<boolean> {
        return this.cdkContainerPane.isHidden();
    }
}
