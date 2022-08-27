import { Injectable } from "@angular/core";

import { LoggerService } from "@nova-ui/bits";

@Injectable({
    providedIn: "root",
})
export class UrlInteractionService {
    constructor(private logger: LoggerService) {}

    public template(url: string, data: any): string {
        const regex = new RegExp(/\$\{([a-zA-Z0-9.]*)\}/g);
        return url.replace(regex, (match, captured) => {
            try {
                return this.evaluate(captured.split("."), data) ?? "";
            } catch (e) {
                this.logger.error(e);
                return "";
            }
        });
    }

    private evaluate(expresion: string[], data: any): string {
        return expresion.reduce((result, item) => result[item], data);
    }
}
