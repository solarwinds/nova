export interface IPaginatorItem {
    title: string;
    value?: any;
    page?: number;
    iconName?: string;
    pageRows?: number[][];
    style?: string;
    action?: (event: any) => boolean;
    popupWidth?: number;
    useVirtualScroll?: boolean;
}
