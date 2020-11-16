import { Component } from "@angular/core";

@Component({
    selector: "nui-client-side-data-source-docs",
    templateUrl: "./client-side-data-source-docs.example.component.html",
})
export class ClientSideDataSourceDocsComponent {
    public subclassCode =
`@Injectable()
export class MyNewClass extends ClientSideDataSource<ExampleItem> {
    constructor(@Inject(SearchService) searchService: SearchService) {
        super(searchService);
    }
}`;
}
