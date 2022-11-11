// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import { Injectable } from "@angular/core";
import { Apollo, gql } from "apollo-angular";
import { DocumentNode } from "graphql";
import isArray from "lodash/isArray";
import isPlainObject from "lodash/isPlainObject";
import { firstValueFrom, Observable, of } from "rxjs";
import { catchError, delay, map } from "rxjs/operators";

import {
    IDataSource,
    INovaFilteringOutputs,
    LoggerService,
    ServerSideDataSource,
} from "@nova-ui/bits";

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
        return firstValueFrom(
            of(data).pipe(
                map((response: IServersCollection) => {
                    const itemsSource = response.Subregion;

                    return {
                        tree: { itemsSource: this.buildTree(itemsSource) },
                    };
                })
            )
        );
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
