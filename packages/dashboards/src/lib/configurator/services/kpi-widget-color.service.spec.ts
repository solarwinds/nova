import { KpiWidgetColorService } from "./kpi-widget-color.service";

describe("KpiWidgetColorService", () => {
    let service: KpiWidgetColorService;

    beforeEach(() => {
        service = new KpiWidgetColorService();
    });

    it("should create", () => {
        expect(service).toBeTruthy();
    });
});
