import { pie } from "d3-shape";

import { IGaugeThreshold } from "../../../gauge/types";

export class RadialGaugeRenderingUtil {
    public static generateThresholdData(data: any[]) {
        const arcData: number[] = RadialGaugeRenderingUtil.generateArcData(data);
        const thresholdsData: any[] = [];
        const pieGenerator = pie().sort(null);
        const arcsForMarkers = pieGenerator(arcData);

        arcsForMarkers.forEach((arcDatum: any, i: number) => {
            if (i % 2 === 1) {
                thresholdsData.push(arcDatum);
            }
        });
        return thresholdsData;
    }

    private static generateArcData(data: any[]) {
        // arcs with a value of zero serve as the threshold points
        const arcData: number[] = Array(data.length * 2 - 1).fill(0);
        data.forEach((d: IGaugeThreshold, i: number) => {
            // arcs with a non-zero value serve as the space between the threshold points
            arcData[i * 2] = i === 0 ? d.value : d.value - data[i - 1].value;
        });
        return arcData;
    }
}
