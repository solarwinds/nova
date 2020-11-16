import { IBorderConfig } from "../types";

/** @ignore */
export class BorderConfig implements IBorderConfig {
    public color: string;
    public width: number;
    public visible = true;

    constructor(public className?: string) {
    }
}
