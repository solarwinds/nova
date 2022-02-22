import { Injectable } from "@angular/core";

import { IDashwizComponent } from "./model";

@Injectable({
    providedIn: "root",
})
export class DashwizService {
    public component: IDashwizComponent | undefined;

    constructor() { }

}
