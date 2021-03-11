import { Component } from "@angular/core";

/**
 * TODO: Remove in  - NUI-5835
 * @deprecated
 */
@Component({
    selector: "nui-data-source-example",
    templateUrl: "./data-source-docs.example.component.html",
})
export class DataSourceExampleComponent {
    public subclassCode =
`@Injectable()
export class MyNewClass extends LocalFilteringDataSource<ExampleItem> {
    constructor(@Inject(SearchService) searchService: SearchService) {
        super(searchService);
    }
}`;
}
