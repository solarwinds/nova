import { Injectable } from "@angular/core";

@Injectable()
export class PopupContainerService {
    get parent(): any {
        return this._parent;
    }

    set parent(value: any) {
        this._parent = value;
    }

    private _parent: any;
}
