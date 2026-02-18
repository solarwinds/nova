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

import { browser } from "protractor";
import { ILocation, WebElement } from "selenium-webdriver";

import { Atom } from "../atom";

export class CdkDraggableItemAtom extends Atom {
    public static CSS_CLASS = "cdk-drag";

    public async mouseDown(): Promise<void> {
        await browser.actions().mouseMove(this.getElement()).perform();
        await browser.actions().mouseDown().perform();
    }

    public async mouseUp(): Promise<void> {
        await browser.actions().mouseUp().perform();
    }

    public async dragSelf(offset?: ILocation): Promise<void> {
        await browser.actions().mouseDown(this.getElement()).perform();
        await browser.actions().mouseMove(this.getElement(), offset).perform();
    }

    public async dragTo(
        location: WebElement | ILocation,
        offset?: ILocation
    ): Promise<void> {
        await browser.actions().mouseDown(this.getElement()).perform();
        await browser.actions().mouseMove(location, offset).perform();
    }

    public async move(
        location: WebElement | ILocation,
        offset?: ILocation
    ): Promise<void> {
        await browser.actions().mouseMove(location, offset).perform();
    }
}
