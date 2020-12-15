import { IFilteringParticipants, INovaFilteringOutputs } from "@nova-ui/bits";
import { IDataField } from "@nova-ui/dashboards";
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
