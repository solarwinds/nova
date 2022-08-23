import { DataAccessor } from "../../../core/common/types";
import { IRectangleSeriesAccessors } from "../../accessors/rectangle-accessors";
import { IBarAccessors, IBarDataAccessors } from "./bar-accessors";

export interface IStatusDataAccessors extends IBarDataAccessors {
    status: DataAccessor;
}

export interface IStatusAccessors extends IBarAccessors {
    data: IStatusDataAccessors;
}

export class StatusAccessors implements IStatusAccessors {
    public static STATUS_CATEGORY = "status";
    public static STATUS_DOMAIN = [StatusAccessors.STATUS_CATEGORY];

    public get data(): IStatusDataAccessors {
        return this.barAccessors.data as IStatusDataAccessors;
    }

    public get series(): IRectangleSeriesAccessors {
        return this.barAccessors.series;
    }

    constructor(private barAccessors: IBarAccessors) {
        barAccessors.data.status = (d: any) => d.status;
    }
}
