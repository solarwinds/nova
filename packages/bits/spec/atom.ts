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

import {browser, by, element, ElementFinder, protractor} from "protractor";
import { By, ILocation } from "selenium-webdriver";
const EC = protractor.ExpectedConditions;

export interface IAtomClass<T extends Atom> {
    new (element: ElementFinder): T;
    CSS_CLASS?: string;
    CSS_SELECTOR?: string;
    findIn<M extends Atom>(
        atomClass: IAtomClass<M>,
        parentElement: ElementFinder,
        index?: number
    ): M;
}

const byCssWithRoot = (selector: string): By => {
    if (!Object.hasOwnProperty.call(by, "cssWithRoot")) {
        by.addLocator(
            "cssWithRoot",
            // This function is executed inside browser, needs to be inline
            (selector: string, rootElement: HTMLElement) => {
                if (!rootElement) {
                    rootElement = window.document.body;
                }
                if (!rootElement) {
                    return;
                }
                if (rootElement.matches(selector)) {
                    return rootElement;
                }
                return rootElement.querySelectorAll(selector);
            }
        );
    }
    return (by as any).cssWithRoot(selector);
};

export class Atom {
    /**
     * Finds given component based on unique css id
     */
    public static find<T extends Atom>(
        atomClass: IAtomClass<T>,
        id: string
    ): T {
        return atomClass.findIn(atomClass, element(by.id(id)));
    }

    public static getSelector<T extends Atom>(
        atomClass: IAtomClass<T>
    ): string {
        if (atomClass.CSS_CLASS) {
            return `.${atomClass.CSS_CLASS}`;
        }
        if (atomClass.CSS_SELECTOR) {
            return atomClass.CSS_SELECTOR;
        }
        throw new ReferenceError(
            `expected atom class ${atomClass.name} to have either CSS_CLASS or CSS_SELECTOR nonempty`
        );
    }

    public static getLocator<T extends Atom>(atomClass: IAtomClass<T>): By {
        return byCssWithRoot(Atom.getSelector(atomClass));
    }

    /**
     * Finds given component inside provided element
     * - Will match provided element directly if it's a component
     * - Will provide a warning if more child components are found
     * - Uses static CSS_CLASS property in component's class
     */
    public static findIn<T extends Atom>(
        atomClass: IAtomClass<T>,
        parentElement: ElementFinder,
        index?: number
    ): T {
        if (atomClass.findIn !== Atom.findIn) {
            return atomClass.findIn(atomClass, parentElement, index);
        }
        const locator = Atom.getLocator(atomClass);
        const create = (root: ElementFinder) => new atomClass(root);
        if (index !== undefined) {
            if (!parentElement) {
                return create(element.all(locator).get(index));
            }
            return create(parentElement.all(locator).get(index));
        }
        if (!parentElement) {
            return create(element(locator));
        }
        return create(parentElement.element(locator));
    }

    public static async findCount<T extends Atom>(
        atomClass: IAtomClass<T>,
        parentElement?: ElementFinder
    ): Promise<number> {
        const locator = Atom.getLocator(atomClass);
        return await (parentElement ?? element).all(locator).count();
    }

    public static async getClasses(el: ElementFinder): Promise<string[]> {
        return (await el.getAttribute("class"))
            .split(/\s+/)
            .filter((name) => !!name);
    }

    public static async hasClass(
        el: ElementFinder,
        className: string
    ): Promise<boolean> {
        const classes = await Atom.getClasses(el);
        return classes.includes(className);
    }

    public static async hasAnyClass(
        el: ElementFinder,
        classNamesToSearch: string[]
    ): Promise<boolean> {
        const classes = await Atom.getClasses(el);
        return classes.some((name) => classNamesToSearch.includes(name));
    }

    public static async wait<T>(
        callback: () => Promise<T>,
        timeout = 5000
    ): Promise<T> {
        return await browser.wait(callback, timeout);
    }

    private element: ElementFinder;

    constructor(element: ElementFinder) {
        this.element = element;
    }

    public async isDisabled(): Promise<boolean> {
        return !(await this.element.isEnabled());
    }

    public async isDisplayed(): Promise<boolean> {
        return this.element.isDisplayed();
    }

    public async isPresent(): Promise<boolean> {
        return this.element.isPresent();
    }

    public async hasClass(className: string): Promise<boolean> {
        return Atom.hasClass(this.element, className);
    }

    public getElement(): ElementFinder {
        return this.element;
    }

    public async waitElementVisible(): Promise<void> {
        await browser.wait(EC.visibilityOf(this.getElement()), 5000, "Element is not visible");
    }

    public async isChildElementPresent(locator: any): Promise<boolean> {
        return await this.element.isElementPresent(locator);
    }

    /**
     * If no arguments are provided, will hover over center of the current element.
     * If only an element argument is provided, will hover over center of provided element.
     * If null element argument and location is provided, will offset from the top left corner of current element.
     * If an element and location is provided, will offset from top left of provided element.
     * @param {ElementFinder} [el] - accepts an element to mouse over center
     * @param {ILocation} [location] - offsets the mouse from top left of element
     */
    public async hover(
        el?: ElementFinder,
        location?: ILocation
    ): Promise<void> {
        return browser
            .actions()
            .mouseMove(el ?? this.getElement(), location)
            .perform();
    }

    public readonly scrollTo = async (
        options?: ScrollIntoViewOptions
    ): Promise<void> =>
        browser.executeScript(
            "arguments[0].scrollIntoView(arguments[1])",
            this.getElement().getWebElement(),
            options || null
        );

    public async wait<T>(
        callback: () => Promise<T>,
        timeout = 5000
    ): Promise<T> {
        return await Atom.wait(callback, timeout);
    }
}
