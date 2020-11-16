import isArray from "lodash/isArray";

import { hasInnerScale, IHasInnerScale, IScale } from "../types";

export function domain(scale: IScale<any>, theDomain: any[]) {
    if (!theDomain || theDomain.length === 0) {
        return;
    }

    if (!isArray(theDomain[0])) {
        scale.domain(theDomain);
        return;
    }

    scale.domain(theDomain[0]);

    if (!hasInnerScale(scale)) {
        return;
    }

    const scaleWithInnerScale = scale as IHasInnerScale<any>;

    domain(scaleWithInnerScale.innerScale, theDomain.slice(1));
}
