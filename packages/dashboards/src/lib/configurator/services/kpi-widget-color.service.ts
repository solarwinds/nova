import { Injectable } from "@angular/core";
import { SequentialColorProvider, TextColorProvider } from "@nova-ui/charts";


@Injectable()
export class KpiWidgetColorService {

    /**
     *
     * @param color Background color
     * @return Calculated text color based on background color
     */
    public static getTextColor(color: string) {
        const colorProvider = new TextColorProvider(new SequentialColorProvider([color]), {
            light: "white",
            dark: "black",
        });
        return colorProvider.get(color);
    }
}
