import { IAccessors } from "../../core/common/types";

export interface INoopAccessors extends IAccessors {
    data: any;
    /** Series level accessors - e.g. for colors, markers, etc. */
    series: any;
}

export class NoopAccessors implements INoopAccessors {
    public series: any;
    public data: any;

    constructor() {
        this.series = undefined;
        this.data = undefined;
    }
}
