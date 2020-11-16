import { Atom, PaginatorAtom, RepeatAtom } from "@solarwinds/nova-bits/sdk/atoms";
import { by, element, ElementFinder } from "protractor";

export class SearchResultsItemAtom extends Atom {
    public static CSS_CLASS = "rd-search-results__item";

    public detailLink: ElementFinder;

    constructor(rootElement: ElementFinder) {
        super(rootElement);

        this.detailLink = rootElement.element(by.className("rd-search-results__detail-link"));
    }

    public async openDetail(): Promise<void> {
        return await this.detailLink.click();
    }

    public async getTitle(): Promise<string> {
        return await this.detailLink.getText();
    }
}

export class SearchResultsPage {
    public questionList: RepeatAtom;
    public questionListPaginator: PaginatorAtom;
    public listContainer: ElementFinder;

    constructor() {
        this.listContainer = element(by.className("rd-search-results__list"));
        this.questionList = Atom.findIn(RepeatAtom, this.listContainer);
        this.questionListPaginator = Atom.findIn(PaginatorAtom, this.listContainer);
    }

    public async getQuestionItem(index: number): Promise<SearchResultsItemAtom> {
        const questionElement = await this.questionList.getItem(index);

        return Atom.findIn(SearchResultsItemAtom, questionElement);
    }
}
