import { Injectable } from "@angular/core";
import { defaultFilters, IFilteringOutputs, IFilters, INovaFilters } from "@solarwinds/nova-bits";
import { DataSourceService } from "@solarwinds/nova-bits";
import defaultsDeep from "lodash/defaultsDeep";
import isEqual from "lodash/isEqual";
import omit from "lodash/omit";

import { IQuestionsInput, IQuestionsPayload } from "../types";

import { QuestionService } from "./question.service";


@Injectable()
export class DataSourceFilterService<T> extends DataSourceService<T> {

    private previousFilters: IFilters;

    constructor(private questionService: QuestionService) {
        super();
    }


    public async getFilteredData(filters: IFilters): Promise<IFilteringOutputs> {
        filters = defaultsDeep(filters, defaultFilters);

        const paginationResetHappened = this.paginationResetHappened(filters, this.previousFilters);

        const input: IQuestionsInput = {
            start: filters.paginator.value.start,
            end: filters.paginator.value.end,
            sortBy: filters.sorter.value.sortBy,
            direction: filters.sorter.value.direction,
        };
        if (filters.search) {
            input.searchValue = filters.search.value;
        }

        const questionsPayload: IQuestionsPayload = await this.questionService.getQuestions(input).toPromise();

        this.previousFilters = filters;

        return {
            repeat: {
                itemsSource: questionsPayload && questionsPayload.questions,
            },
            paginator: {
                total: questionsPayload && questionsPayload.total,
                reset: paginationResetHappened,
            },
        };
    }

    private paginationResetHappened(filters: INovaFilters, previousFilters: INovaFilters): boolean {
        let paginationResetHappened = false;
        const paginatorRange = filters && filters.paginator && filters.paginator.value;

        const previousNoPagination = omit(previousFilters, "paginator");
        const currentNoPagination = omit(filters, "paginator");

        if (!isEqual(previousNoPagination, currentNoPagination)) {
            paginatorRange.end -= paginatorRange.start;
            paginatorRange.start = 0;
            filters.paginator.value = paginatorRange;
            paginationResetHappened = true;
        }

        return paginationResetHappened;
    }

}
