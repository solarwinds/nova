import { Observable } from "rxjs";

import { SelectV2OptionComponent } from "./option/select-v2-option.component";

export interface IOptionedComponent {
    multiselect?: boolean;
    valueChanged?: Observable<string>;
    valueSelected?: Observable<any>;
    isTypeaheadEnabled?: boolean;
    selectedOptions: SelectV2OptionComponent[];
    selectOption(option: SelectV2OptionComponent): void;
}

export type InputValueTypes = number | string;

