import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class UrlInteractionService {
    public template(url: string, data: any): string{
        const regex = new RegExp(/(\$\{[a-zA-Z0-9.]*\})/g)
        let propertyArray: string[] = [];
        
        let interpolations = url.match(regex) || [];
        if (interpolations.length === 0) {
            return url;
        }

        interpolations.forEach(element => {
            propertyArray.push(element.slice(2,-1))
        });

        let evaluatedUrl = url;
        for (let i = 0; i < propertyArray.length; i++) {
            const evaluation = this.evaluate(propertyArray[i].split("."), data);
            evaluatedUrl = evaluatedUrl.replace(interpolations[i], evaluation)
        }

        return evaluatedUrl;
    }

    private evaluate(properties: string[], data: any): string {
        let result = data;

        properties.forEach(element => {
            result = result[element];
        });

        return result;
    }
}
