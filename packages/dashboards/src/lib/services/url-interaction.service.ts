import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class UrlInteractionService {
    public template(url: string, data: any): string{
        const regex = new RegExp(/(\$\{[a-zA-Z0-9.]*\})/g)
        return url.replace(regex, (captured) => this.evaluate(captured, data));
    }

    private evaluate(expresion: string, data: any): string {
        let result = data;

        expresion.slice(2,-1).split(".").forEach(element => {
            result = result[element];
        });

        return result;
    }
}
