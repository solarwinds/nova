export interface IChartRangeSliderPoint {
    x: number;
    y: number;
}

export interface IChartRangeSliderSeries {
    id: string;
    data: IChartRangeSliderPoint[];
    color?: string;
    active?: boolean;
}

export interface IChartRangeSliderRange {
    startIndex: number;
    endIndex: number;
    startValue?: number;
    endValue?: number;
}
