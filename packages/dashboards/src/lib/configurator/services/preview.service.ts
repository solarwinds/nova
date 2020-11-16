import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { IPizzagnaLayer } from "../../types";

@Injectable()
export class PreviewService {

    private _preview: IPizzagnaLayer;

    public get preview(): IPizzagnaLayer {
        return this._preview;
    }

    public set preview(value: IPizzagnaLayer) {
        this._preview = value;
        this.previewChanged.next(value);
    }

    public previewChanged = new Subject<IPizzagnaLayer>();

}
