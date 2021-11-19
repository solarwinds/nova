import { ElementRef, Injectable } from "@angular/core";
import isNull from "lodash/isNull";

export const focusableElementsCSSSelector = "[tabindex], button, a, input:not([type=hidden])";

interface IFocusableElement {
    nativeElement: Element;
    tabIndex?: string;
}

interface ITabNavigationService {
    disableTabNavigation(domElRef: ElementRef): void;

    restoreTabNavigation(): void;
}

@Injectable()
export class TabNavigationService implements ITabNavigationService {
    // cache to remember the altered DOM elements that will be later restored
    private tabFocusableElements: IFocusableElement[] = [];

    public disableTabNavigation(domElRef: ElementRef): void {
        // dom manipulation to cache the altered elements
        // and do tabIndex=-1 on focusable HTML elements
        this.tabFocusableElements = [];
        domElRef.nativeElement
            .querySelectorAll(focusableElementsCSSSelector)
            .forEach((domEl: Element) => {
                const tabIndex = domEl.getAttribute("tabindex");
                this.tabFocusableElements.push({
                    nativeElement: domEl,
                    tabIndex: isNull(tabIndex) ? undefined : tabIndex,
                });

                // disable focusing element via tab
                domEl.setAttribute("tabindex", "-1");
            });
    }

    public restoreTabNavigation(): void {
        // dom manipulation to restore the tabIndex for the cached elements
        // and remove the tabIndex for those who didn't had it at all
        this.tabFocusableElements.forEach(e => {
            if (e?.tabIndex?.length) {
                e.nativeElement.setAttribute("tabindex", e.tabIndex);
            } else {
                e.nativeElement.removeAttribute("tabindex");
            }
        });
    }
}

