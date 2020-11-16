export * from "./table-virtual-scroll/table-virtual-scroll.directive";
export * from "./table-virtual-scroll/table-sticky-header.directive";
export * from "./table-virtual-scroll/slice-range.pipe";

export type TableAlignmentOptions = "right" | "left" | "center";
export type RowHeightOptions = "default" | "compact" | "tiny";
export type ColumnTypes = "icon";
export type NonResizableColumnTypes = "icon";
export interface ClickableRowOptions {
    clickableSelectors: string[];
    ignoredSelectors: string[];
}
