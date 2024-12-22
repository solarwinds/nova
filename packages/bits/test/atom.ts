import { $, browser } from "@wdio/globals";
import { ChainablePromiseElement, ChainablePromiseArray } from "webdriverio";

export interface IAtomClass<T extends Atom> {
    CSS_CLASS?: string;
    CSS_SELECTOR?: string;

    new (element: ChainablePromiseElement): T;

    findIn<M extends Atom>(
        atomClass: IAtomClass<M>,
        parentElement: ChainablePromiseElement,
        index?: number
    ): M;
}

export class Atom {
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

    public static find<T extends Atom>(atomClass: any, id: string): T {
        return atomClass.findIn(atomClass, $(`#${id}`));
    }


    public static async findCount<T extends Atom>(
        atomClass: IAtomClass<T>,
        parentElement?: ChainablePromiseElement
    ): Promise<number> {
        const element = parentElement
            ? Atom.getParentElementByClass(parentElement, atomClass)
            : Atom.getRootElementByClass(atomClass);

        return await (element as ChainablePromiseArray).length;
    }


    /**
     * Finds given component inside provided element
     * - Will match provided element directly if it's a component
     * - Will provide a warning if more child components are found
     * - Uses static CSS_CLASS property in component's class
     * @param atomClass The specific Atom class type.
     * @param parentElement The parent element to search within.
     * @param index (Optional) The index if searching for multiple elements.
     * @returns An instance of the Atom class with the located element.
     */
    public static findIn<T extends Atom>(
        atomClass: new (element: ChainablePromiseElement) => T,
        parentElement?: ChainablePromiseElement,
        index?: number
    ): T {
        // Custom `findIn` method for subclasses
        if ((atomClass as any).findIn !== Atom.findIn) {
            return (atomClass as any).findIn(atomClass, parentElement, index);
        }

        // Get the locator for the specific Atom
        const atomByClassFromRoot = Atom.getRootElementByClass(atomClass);

        const createInstance = (root: ChainablePromiseElement) =>
            new atomClass(root);

        if (index !== undefined) {
            if (!parentElement) {
                return createInstance((atomByClassFromRoot as ChainablePromiseArray)[index]);
            }
            return createInstance((Atom.getParentElementByClass(parentElement, atomClass) as ChainablePromiseArray)[index]);
        }

        if (!parentElement) {
            return createInstance(atomByClassFromRoot as ChainablePromiseElement);
        }
        // parentElement lookup in classes then look up in the child
        // find in parent or self by class
        return createInstance(Atom.getParentElementByClass(parentElement, atomClass) as ChainablePromiseElement);
    }

    public static async getClasses(
        el: ChainablePromiseElement
    ): Promise<string[]> {
        return (await el.getAttribute("class"))
            .split(/\s+/)
            .filter((name) => !!name);
    }

    public static async hasClass(
        el: ChainablePromiseElement,
        className: string
    ): Promise<boolean> {
        const classes = await Atom.getClasses(el);
        return classes.includes(className);
    }

    public static async hasAnyClass(
        el: ChainablePromiseElement,
        classNamesToSearch: string[]
    ): Promise<boolean> {
        const classes = await Atom.getClasses(el);
        return classes.some((name) => classNamesToSearch.includes(name));
    }

    public static async wait<T>(
        callback: () => Promise<T>,
        timeout = 5000
    ): Promise<T> {
        return await browser.waitUntil(callback, { timeout });
    }

    /**
     * Retrieves the locator (CSS or XPath selector) for the Atom class.
     * @param atomClass The Atom class type.
     * @param multiple you can have an array of elements
     * @returns The locator string (e.g., CSS or XPath).
     */
    protected static getRootElementByClass(
        atomClass: any,
        multiple = false
    ): ChainablePromiseElement | ChainablePromiseArray {
        // find from root
        return browser[!multiple ? "custom$":"custom$$"]("cssWithRoot", Atom.getSelector(atomClass));
    }

    /**
     * Retrieves Child or Parent element the same as
     * @Atom.getRootElementByClass but for parent
     */
    protected static getParentElementByClass(
        parentElement: any,
        atomClass: any,
        multiple = false
    ): ChainablePromiseElement |ChainablePromiseArray{
        // find from root
        return parentElement[!multiple ? "custom$":"custom$$"](
            "selfOrChildWithClass",
            Atom.getSelector(atomClass as any)
        );
    }

    protected element: ChainablePromiseElement;

    constructor(element: ChainablePromiseElement) {
        this.element = element;
    }

    public async isDisabled(): Promise<boolean> {
        return !(await this.element.isEnabled());
    }

    public async isDisplayed(): Promise<boolean> {
        return this.element.isDisplayed();
    }

    public async isPresent(): Promise<boolean> {
        return this.element.isExisting();
    }

    public async hasClass(className: string): Promise<boolean> {
        return Atom.hasClass(this.element, className);
    }

    public getElement(): ChainablePromiseElement {
        return this.element;
    }

    //
    // public async isChildElementPresent(locator: any): Promise<boolean> {
    //     return await this.element.isElementPresent(locator);
    // }
    //
    // /**
    //  * If no arguments are provided, will hover over center of the current element.
    //  * If only an element argument is provided, will hover over center of provided element.
    //  * If null element argument and location is provided, will offset from the top left corner of current element.
    //  * If an element and location is provided, will offset from top left of provided element.
    //  * @param {ElementFinder} [el] - accepts an element to mouse over center
    //  * @param {ILocation} [location] - offsets the mouse from top left of element
    //  */
    // public async hover(
    //     el?: ElementFinder,
    //     location?: ILocation
    // ): Promise<void> {
    //     return browser
    //         .actions()
    //         .mouseMove(el ?? this.getElement(), location)
    //         .perform();
    // }
    //
    // public readonly scrollTo = async (
    //     options?: ScrollIntoViewOptions
    // ): Promise<void> =>
    //     browser.executeScript(
    //         "arguments[0].scrollIntoView(arguments[1])",
    //         this.getElement(),
    //         options || null
    //     );
    //
    // public async wait<T>(
    //     callback: () => Promise<T>,
    //     timeout = 5000
    // ): Promise<T> {
    //     return await Atom.wait(callback, timeout);
    // }
}
