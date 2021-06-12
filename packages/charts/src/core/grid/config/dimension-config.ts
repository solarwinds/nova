import { IAllAround, IDimensionConfig } from "../types";

export class DimensionConfig implements IDimensionConfig {
    private _width: number = 0;
    private _height: number = 0;
    /** See {@link IDimensionConfig#margin} */
    public margin: IAllAround<number> = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    };
    /** See {@link IDimensionConfig#padding} */
    public padding: IAllAround<number> = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    };
    /** See {@link IDimensionConfig#marginLocked} */
    public marginLocked: IAllAround<boolean> = {
        top: false,
        right: false,
        bottom: false,
        left: false,
    };

    /** See {@link IDimensionConfig#autoWidth} */
    public autoWidth = true;
    /** See {@link IDimensionConfig#autoHeight} */
    public autoHeight = true;

    /** See {@link IDimensionConfig#width} */
    public width(): number;
    /** See {@link IDimensionConfig#width} */
    public width(value: number): IDimensionConfig;
    /** See {@link IDimensionConfig#width} */
    public width(value?: number): any {
        if (value === undefined) {
            return this._width;
        }
        this._width = value;
        return this;
    }

    /** See {@link IDimensionConfig#height} */
    public height(): number;
    /** See {@link IDimensionConfig#height} */
    public height(value: number): IDimensionConfig;
    /** See {@link IDimensionConfig#height} */
    public height(value?: number): any {
        if (value === undefined) {
            return this._height;
        }
        this._height = value;
        return this;
    }

    /** See {@link IDimensionConfig#outerWidth} */
    public outerWidth(): number;
    /** See {@link IDimensionConfig#outerWidth} */
    public outerWidth(value: number): IDimensionConfig;
    /** See {@link IDimensionConfig#outerWidth} */
    public outerWidth(value?: number): any {
        const marginsWidth = this.margin.right + this.margin.left;
        if (value === undefined) {
            return this._width + marginsWidth;
        }
        this._width = Math.max(value - marginsWidth, 0);
        return this;
    }

    /** See {@link IDimensionConfig#outerHeight} */
    public outerHeight(): number;
    /** See {@link IDimensionConfig#outerHeight} */
    public outerHeight(value: number): IDimensionConfig;
    /** See {@link IDimensionConfig#outerHeight} */
    public outerHeight(value?: number): any {
        const marginsHeight = this.margin.top + this.margin.bottom;
        if (value === undefined) {
            return this._height + marginsHeight;
        }
        this._height = Math.max(value - marginsHeight, 0);
        return this;
    }
}
