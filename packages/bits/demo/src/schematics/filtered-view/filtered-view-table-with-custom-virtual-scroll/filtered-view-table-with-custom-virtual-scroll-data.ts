import { InjectionToken } from "@angular/core";
// number of results to be displayed in the table
export const RESULTS_PER_PAGE = 400;

export const CUSTOM_SCROLL_ITEMS_PER_PAGE: InjectionToken<number> =
    new InjectionToken("CUSTOM_SCROLL_ITEMS_PER_PAGE");
