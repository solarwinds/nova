import { Injectable } from "@angular/core";
import { IHeaderLinkProvider } from "./types";

@Injectable()
export class HeaderLinkProvider implements IHeaderLinkProvider {

    public getLink(template: string): string {
        return "http://www.solarwinds.com";
    }

}
