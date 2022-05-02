export class UrlInteractionService {
    public template(url: string, data: any): string{
        const regex = new RegExp(/\$\{([a-zA-Z0-9.]*)\}/g)
        return url.replace(regex, (match, captured) => this.evaluate(captured.split("."), data));
    }

    private evaluate(expresion: string[], data: any): string {
        return expresion.reduce((result, item) => result[item], data)
    }
}
