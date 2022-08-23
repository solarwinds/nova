import { InjectionToken } from "@angular/core";
import { FormGroup } from "@angular/forms";

import { IPizzagna } from "../../../types";

export const CONFIGURATOR_CONVERTER =
    new InjectionToken<IConfiguratorConverter>("CONFIGURATOR_CONVERTER");

export interface IConfiguratorForm {
    pizzagna: IPizzagna;
    formGroup: FormGroup;
    previousValue: any;
}

export interface IConfiguratorConverter {
    buildForm(): any;

    toPreview(form: FormGroup): any;
}

export interface IConverterFormPartsProperties {
    previewPath: string;
    keys: string[];
    /** In case you need to put data in different place use this property */
    previewOutputPath?: string;
}
