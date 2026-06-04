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
import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
} from "@angular/common/http";
import { Observable, of } from "rxjs";
import { delay } from "rxjs/operators";

/**
 * Intercepts HTTP requests to the Google Books API and returns mock data.
 * This avoids hitting quota limits on the external API during development.
 */
@Injectable()
export class GoogleBooksInterceptor implements HttpInterceptor {
    private static readonly MOCK_BOOKS: Record<string, any> = {
        "5MQFrgEACAAJ": {
            kind: "books#volume",
            id: "5MQFrgEACAAJ",
            volumeInfo: {
                title: "Harry Potter and the Sorcerer's Stone",
                authors: ["J. K. Rowling"],
                averageRating: 4.5,
                ratingsCount: 120,
                pageCount: 309,
                infoLink:
                    "https://books.google.com/books?id=5MQFrgEACAAJ",
            },
        },
        "zpvysRGsBlwC": {
            kind: "books#volume",
            id: "zpvysRGsBlwC",
            volumeInfo: {
                title: "Harry Potter and the Chamber of Secrets",
                authors: ["J. K. Rowling"],
                averageRating: 4.3,
                ratingsCount: 95,
                pageCount: 341,
                infoLink:
                    "https://books.google.com/books?id=zpvysRGsBlwC",
            },
        },
    };

    private static readonly MOCK_SEARCH_RESPONSE = {
        kind: "books#volumes",
        totalItems: 3,
        items: [
            {
                id: "5MQFrgEACAAJ",
                volumeInfo: {
                    title: "Harry Potter and the Sorcerer's Stone",
                    authors: ["J. K. Rowling"],
                    averageRating: 4.5,
                    ratingsCount: 120,
                    pageCount: 309,
                },
            },
            {
                id: "zpvysRGsBlwC",
                volumeInfo: {
                    title: "Harry Potter and the Chamber of Secrets",
                    authors: ["J. K. Rowling"],
                    averageRating: 4.3,
                    ratingsCount: 95,
                    pageCount: 341,
                },
            },
            {
                id: "mockBook3",
                volumeInfo: {
                    title: "Harry Potter and the Prisoner of Azkaban",
                    authors: ["J. K. Rowling"],
                    averageRating: 4.6,
                    ratingsCount: 150,
                    pageCount: 435,
                },
            },
        ],
    };

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        if (!req.url.includes("googleapis.com/books")) {
            return next.handle(req);
        }

        // Match single volume request: /volumes/{id}
        const volumeMatch = req.url.match(/\/volumes\/([^?/]+)$/);
        if (volumeMatch) {
            const id = volumeMatch[1];
            const mockData =
                GoogleBooksInterceptor.MOCK_BOOKS[id] ??
                GoogleBooksInterceptor.MOCK_BOOKS["5MQFrgEACAAJ"];
            return of(
                new HttpResponse({ status: 200, body: mockData })
            ).pipe(delay(300));
        }

        // Match search/list request: /volumes?q=...
        return of(
            new HttpResponse({
                status: 200,
                body: GoogleBooksInterceptor.MOCK_SEARCH_RESPONSE,
            })
        ).pipe(delay(300));
    }
}
