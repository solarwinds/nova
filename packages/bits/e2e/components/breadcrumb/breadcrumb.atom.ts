import { Locator } from "playwright-core";

import { Atom } from "../../atom";
import { Helpers } from "../../setup";

export class BreadcrumbAtom extends Atom {
    public static CSS_CLASS = "nui-breadcrumb";

    public getAllItems(): Locator {
        return super
            .getLocator()
            .locator(Helpers.page.locator(".nui-breadcrumb__wrapper"));
    }

    public getLink(link: Locator): Locator {
        return link.locator(".nui-breadcrumb__crumb");
    }

    public getUrlState(): string {
        const fullUrl = Helpers.page.url();
        return fullUrl.split("#")[1];
    }
}
