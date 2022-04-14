import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class UrlInteractionService {
    public template(url: string, data: any): string{
        const regex = new RegExp(/\$\{([a-zA-Z0-9.]*)\}/g)
        return url.replace(regex, (match, captured) => this.evaluate(captured.split("."), data));
    }

    private evaluate(expresion: string[], data: any): string {
        let result = data;

        expresion.forEach(element => {
            result = result[element];
        });

        return result;
    }
}
