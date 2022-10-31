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

import { browser, by, element, ElementFinder } from "protractor";
import { ILocation } from "selenium-webdriver";

export interface IAtomClass<T extends Atom> {
    new (element: ElementFinder): T;
    CSS_CLASS: string;
    findIn<M extends Atom>(
        atomClass: IAtomClass<M>,
        parentElement: ElementFinder,
        index?: number
    ): M;
}

export class Atom {
    public static CSS_CLASS = "UNDEFINED-ATOM-CLASS";

    /**
     * Finds given component based on unique css id
     */
    public static find<T extends Atom>(
        atomClass: IAtomClass<T>,
        id: string
    ): T {
        return atomClass.findIn(atomClass, element(by.id(id)));
    }

    private static addProperLocator() {
        // We need locator which can match root element
        by.addLocator(
            "properClassName",
            // This function is executed inside browser, needs to be inline
            (className: string, rootElement: any) => {
                const classString = rootElement.getAttribute("class");
                if (classString) {
                    const allClasses =
                        " " + classString.replace(/\s+/g, " ") + " ";
                    if (allClasses.indexOf(" " + className + " ") > -1) {
                        // Class is set in root element, let's return it
                        return rootElement;
                    }
                }
                // Return matching sub-elements
                return rootElement.getElementsByClassName(className);
            }
        );
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
        if ((<any>by).properClassName === undefined) {
            Atom.addProperLocator();
        }
        let componentRootElement: ElementFinder;
        if (index !== undefined) {
            if (!parentElement) {
                componentRootElement = element
                    .all(by.className(atomClass.CSS_CLASS))
                    .get(index);
            } else {
                componentRootElement = parentElement
                    .all(by.className(atomClass.CSS_CLASS))
                    .get(index);
            }
        } else {
            if (!parentElement) {
                componentRootElement = element(
                    (<any>by).properClassName(atomClass.CSS_CLASS)
                );
            } else {
                componentRootElement = parentElement.element(
                    (<any>by).properClassName(atomClass.CSS_CLASS)
                );
            }
        }
        return new atomClass(componentRootElement);
    }

    public static async findCount<T extends Atom>(
        atomClass: IAtomClass<T>,
        parentElement?: ElementFinder
    ): Promise<number> {
        if (!parentElement) {
            return <any>element.all(by.className(atomClass.CSS_CLASS)).count();
        }
        return <any>(
            parentElement.all(by.className(atomClass.CSS_CLASS)).count()
        );
    }

    public static async hasClass(
        el: ElementFinder,
        className: string
    ): Promise<boolean> {
        return el
            .getAttribute("class")
            .then(
                (classes: string) =>
                    classes.split(" ").indexOf(className) !== -1
            );
    }

    public static async hasAnyClass(
        el: ElementFinder,
        classNamesToSearch: string[]
    ): Promise<boolean> {
        return el.getAttribute("class").then((classesInElement: string) => {
            let found = false;
            const classesInElementArray = classesInElement.split(" ");
            classNamesToSearch.forEach((name: string) => {
                found = classesInElementArray.indexOf(name) !== -1 || found;
            });
            return found;
        });
    }

    private element: ElementFinder;

    public async isDisabled(): Promise<boolean> {
        return !(await this.element.isEnabled());
    }

    public async isDisplayed(): Promise<boolean> {
        return this.element.isDisplayed();
    }

    public async isPresent(): Promise<boolean> {
        return this.element.isPresent();
    }

    constructor(elementFinder: ElementFinder) {
        this.element = elementFinder;
    }

    public async hasClass(className: string): Promise<boolean> {
        return this.element
            .getAttribute("class")
            .then(
                (classes: string) =>
                    classes.split(" ").indexOf(className) !== -1
            );
    }

    public getElement(): ElementFinder {
        return this.element;
    }

    public async isChildElementPresent(locator: any): Promise<boolean> {
        return <any>this.element.isElementPresent(locator);
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

    public scrollTo = async (options?: ScrollIntoViewOptions) =>
        browser.executeScript(
            "arguments[0].scrollIntoView(arguments[1])",
            this.getElement(),
            options || null
        );
}
