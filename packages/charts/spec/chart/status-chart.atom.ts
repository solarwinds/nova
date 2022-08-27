import { Atom } from "@nova-ui/bits/sdk/atoms";

import { ChartAtom } from "./atoms/chart.atom";
import { SeriesAtom } from "./atoms/series.atom";
import { StatusBarDataPointAtom } from "./atoms/status-bar-data-point.atom";

export class StatusChartAtom extends ChartAtom {
    public async getStatusBarDataPointByIndex(
        seriesID: string,
        barIndex: number
    ): Promise<StatusBarDataPointAtom> {
        const series: SeriesAtom | undefined = await this.getDataSeriesById(
            SeriesAtom,
            seriesID
        );

        if (!series) {
            throw new Error("series are not defined");
        }

        return Atom.findIn(
            StatusBarDataPointAtom,
            series.getElement(),
            barIndex
        );
    }

    public async getAllBarDataPointsBySeriesID(
        seriesID: string
    ): Promise<StatusBarDataPointAtom[]> {
        const allBarDataPoints = [];
        const seriesByIndex: SeriesAtom | undefined =
            await this.getDataSeriesById(SeriesAtom, seriesID);
        if (!seriesByIndex) {
            throw new Error("seriesByIndex are not defined");
        }
        for (
            let i = 0;
            i <
            (await Atom.findCount(
                StatusBarDataPointAtom,
                seriesByIndex.getElement()
            ));
            i++
        ) {
            allBarDataPoints.push(
                Atom.findIn(
                    StatusBarDataPointAtom,
                    seriesByIndex.getElement(),
                    i
                )
            );
        }
        return allBarDataPoints;
    }
}
