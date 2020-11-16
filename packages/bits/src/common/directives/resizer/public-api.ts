/**@ignore*/
export enum ResizeDirection {
    left = "left",
    right = "right",
    top = "top",
    bottom = "bottom",
}
/**@ignore*/
export enum ResizeUnit {
    percent = "%",
    pixel = "px",
}
/**@ignore*/
export interface IResizeProperties {
    appendDirection: "left" | "right" | "top" | "bottom";
    borderToCalculate: "left" | "right" | "top" | "bottom";
    cursor: "ew-resize" | "ns-resize";
    sizeToSet: "width" | "height";
    otherSizeProperty: "width" | "height";
    nativeElementSizeProperty: "offsetHeight" | "offsetWidth";
}
/**@ignore*/
export const resizeDirectionHelpers: { [key: string]: IResizeProperties } = {
    right: {
        appendDirection: "left",
        borderToCalculate: "right",
        cursor: "ew-resize",
        sizeToSet: "width",
        otherSizeProperty: "height",
        nativeElementSizeProperty: "offsetWidth",
    },
    left: {
        appendDirection: "right",
        borderToCalculate: "left",
        cursor: "ew-resize",
        sizeToSet: "width",
        otherSizeProperty: "height",
        nativeElementSizeProperty: "offsetWidth",
    },
    top: {
        appendDirection: "bottom",
        borderToCalculate: "top",
        cursor: "ns-resize",
        sizeToSet: "height",
        otherSizeProperty: "width",
        nativeElementSizeProperty: "offsetHeight",
    },
    bottom: {
        appendDirection: "top",
        borderToCalculate: "bottom",
        cursor: "ns-resize",
        sizeToSet: "height",
        otherSizeProperty: "width",
        nativeElementSizeProperty: "offsetHeight",
    },
};
