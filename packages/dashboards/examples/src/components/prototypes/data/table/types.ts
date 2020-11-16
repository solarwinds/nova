import { IFilteringParticipants, INovaFilteringOutputs } from "@solarwinds/nova-bits";
import { IDataField } from "@solarwinds/nova-dashboards";
import { BehaviorSubject } from "rxjs";

export interface BasicTableModel {
    position: number;
    name: string;
    features: any;
    status: string;
    checks: any;
    "cpu-load": number;
    firstUrl: string;
    firstUrlLabel: string;
    secondUrl: string;
    secondUrlLabel: string;
}

export interface ITableDataSourceOutput extends INovaFilteringOutputs {
    dataFields: IDataField[];
}
