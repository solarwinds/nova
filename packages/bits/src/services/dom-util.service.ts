import { DOCUMENT } from "@angular/common";
import { Inject, Injectable } from "@angular/core";

// TODO: Refactor class to use strongly typed values
/**
 * Service providing DOM utilities
 */
/**
 * @ignore
 */
@Injectable({ providedIn: "root" })
export class DomUtilService {
    constructor(@Inject(DOCUMENT) private document: any) {}

    /**
     * Gets the closest parent element matching the specified selector
     * @param elem the source element
     * @param selector the selector to match
     * @returns the matching element
     */
    public getClosest = (
        elem: HTMLElement | undefined,
        selector: string
    ): HTMLElement | null => {
        // Element.matches() polyfill
        if (!Element.prototype.matches) {
            Element.prototype.matches =
                (Element.prototype as any).msMatchesSelector ||
                Element.prototype.webkitMatchesSelector ||
                function (slctr: string): boolean {
                    // prettier-ignore
                    const matches = (
                        // @ts-ignore: 'this' implicitly has type 'any' because it does not have a type annotation.
                        // An outer value of 'this' is shadowed by this container.
                        this.document || this.ownerDocument
                    ).querySelectorAll(slctr);
                    let index = matches.length - 1;
                    // @ts-ignore: 'this' implicitly has type 'any' because it does not have a type annotation.
                    // An outer value of 'this' is shadowed by this container.
                    while (index >= 0 && matches.item(index) !== this) {
                        --index;
                    }
                    return index > -1;
                };
        }

        // Get the closest matching element
        for (
            ;
            elem && elem !== this.document;
            elem = elem.parentElement ?? undefined
        ) {
            if (elem?.matches(selector)) {
                return elem;
            }
        }
        return null;
    };
}
