import { Apollo, gql } from "apollo-angular";
import { Injectable } from "@angular/core";
import {
    IDataSource,
    INovaFilteringOutputs,
    LoggerService,
    ServerSideDataSource,
} from "@nova-ui/bits";

import { DocumentNode } from "graphql";

import isArray from "lodash/isArray";
import isPlainObject from "lodash/isPlainObject";
import { Observable, of } from "rxjs";
import { catchError, delay, map } from "rxjs/operators";

import {
    IServerFilters,
    IServersCollection,
    ISubregion,
    ITreeNode,
} from "./types";

const nameFieldsProperties = ["name", "code", "__typename"];

/**
 * Example of a ServerSide DataSourceService which is using the Nova Backend API
 * to fetch data
 */
@Injectable()
export class FilteredViewWithTreeDataSource<T>
    extends ServerSideDataSource<T>
    implements IDataSource
{
    constructor(private logger: LoggerService, private apollo: Apollo) {
        super();
    }

    public async getFilteredData(
        data: IServersCollection
    ): Promise<INovaFilteringOutputs> {
        return of(data)
            .pipe(
                map((response: IServersCollection) => {
                    const itemsSource = response.Subregion;

                    return {
                        tree: { itemsSource: this.buildTree(itemsSource) },
                    };
                })
            )
            .toPromise();
    }

    // This method is expected to return all data needed for repeat/paginator/filterGroups in order to work.
    // In case of custom filtering participants feel free to extend INovaFilteringOutputs.
    protected getBackendData(filters: IServerFilters): Observable<ISubregion> {
        const mainRequest = this.apollo.query<ISubregion>({
            query: this.generateQuery(filters),
        });

        return mainRequest.pipe(
            // since API being used sends the response almost immediately,
            // we need to fake it takes longer to be able the show the spinner component
            // while the data is being received
            // PS: NOT to be used in real examples
            delay(300),

            // transform backend API response (IServersApiResponse)
            // to our frontend items collection (IServersCollection)
            map((mainResponse) => mainResponse.data),

            // error handle in case of any error
            catchError((e) => {
                this.logger.error(e);
                return of({} as ISubregion);
            })
        );
    }

    private generateQuery(filters: IServerFilters): DocumentNode {
        let languages = "";
        let currencies = "";
        let subregion = "";

        filters.language?.value.forEach(
            (i) => (languages += `{officialLanguages_some: {name: "${i}"}},`)
        );
        filters.currency?.value.forEach(
            (i) => (currencies += `{currencies_some: {code: "${i}"}},`)
        );
        filters.subregion?.value.forEach(
            (i) => (subregion += `{name: "${i}"},`)
        );

        const queryString = `query {
          Subregion(filter: {AND: [{region: {name: "Americas"}}], ${
              subregion ? "OR: [" + subregion + "]" : ""
          }}) {
            name,
            countries${
                languages || currencies
                    ? "(filter: {AND: [" + languages + currencies + "]})"
                    : ""
            } {
              name,
              population,
              officialLanguages {
                name
              },
              currencies {
                code
              }
            }
          }
        }`;

        return gql`
            ${queryString}
        `;
    }

    private buildTree(value: any): ITreeNode[] {
        const data: ITreeNode[] = [];

        for (const k in value) {
            if (value.hasOwnProperty(k) && k !== "__typename") {
                const nodeValue: ITreeNode = value[k];
                const node: ITreeNode = {} as ITreeNode;

                if (isArray(nodeValue)) {
                    node.name = `${k}`;
                    node.children = this.buildTree(nodeValue);
                } else if (isPlainObject(nodeValue)) {
                    node.name = nodeValue.name || nodeValue.code || `${k}`;
                    const hasChildren = Object.keys(nodeValue).filter(
                        (key: any) => !nameFieldsProperties.includes(key)
                    ).length;
                    if (hasChildren) {
                        node.children = this.buildTree(nodeValue);
                    }
                } else {
                    if (!nameFieldsProperties.includes(k)) {
                        node.name = `${k}`;
                        node.children = [{ name: nodeValue }];
                    }
                }

                if (Object.keys(node).length) {
                    data.push(node);
                }
            }
        }

        return data;
    }
}
