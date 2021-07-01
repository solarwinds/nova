import { DataAccessor, IAccessors } from "../../core/common/types";

export interface IXYDataAccessors {
    /** Accessor for value plotted on the <code>x</code> coordinate */
    x: DataAccessor;
    /** Accessor for value plotted on the <code>y</code> coordinate */
    y: DataAccessor;
    /** Additional custom keys to match the base interface */
    [key: string]: DataAccessor | undefined;
}

export class XYAccessors implements IAccessors {
    /** The default data accessors for using with renderers deriving from XYRenderer */
    public data: IXYDataAccessors = {
        x: (d: any) => d.x,
        y: (d: any) => d.y,
    };
}
