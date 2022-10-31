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

<% if (presentationType === "table" && pagingMode === "virtualScroll") { %>import { ScrollingModule } from "@angular/cdk/scrolling";
<% } %>import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import {
    NuiBusyModule,<%
    if (chips) { %>
    NuiChipsModule,<% } %><%
    if (presentationType === "table") { %>
    NuiIconModule,<% } %>
    NuiPaginatorModule,
    NuiPanelModule,<%
    if (chips) { %>
    NuiPopoverModule,<% } %><%
    if (presentationType === "table" && (pagingMode === "virtualScroll" || dataSource === "serverSide")) { %>
    NuiProgressModule,<% } %>
    NuiRepeatModule,
    NuiSearchModule,
    NuiSorterModule,
    NuiSpinnerModule,<%
    if (presentationType === "table") { %>
    NuiTableModule,<% } %>
} from "@nova-ui/bits";

import { FilterGroupModule } from "./filter-group/filter-group.module";
import { <%= classify(name) %>Component } from "./<%= dasherize(name) %>.component";<% if (presentationType === "list") { %>
import { FilteredViewListComponent } from "./filtered-view-list/filtered-view-list.component";<% } %><% else { %>
import { FilteredViewTableComponent } from "./filtered-view-table/filtered-view-table.component";<% } %>

@NgModule({
    imports: [<%
        if (presentationType === "table" && pagingMode === "virtualScroll") { %>
        ScrollingModule,<% } %>
        CommonModule,
        NuiPaginatorModule,
        NuiPanelModule,<%
        if (presentationType === "table" && (pagingMode === "virtualScroll" || dataSource === "serverSide")) { %>
        NuiProgressModule,<% } %>
        NuiRepeatModule,
        NuiSearchModule,
        NuiSorterModule,<%
        if (presentationType === "table") { %>
        NuiIconModule,<% } %>
        NuiSpinnerModule,<%
        if (presentationType === "table") { %>
        NuiTableModule,<% } %>
        NuiBusyModule,
        FilterGroupModule,<%
        if (chips) { %>
        NuiChipsModule,
        NuiPopoverModule,<% } %>
    ],
    declarations: [
        <%= classify(name) %>Component,
        <% if (presentationType === "list") { %>FilteredViewListComponent<% } %><% else { %>FilteredViewTableComponent<% } %>,
    ],
    exports: [
        <%= classify(name) %>Component,
        <% if (presentationType === "list") { %>FilteredViewListComponent<% } %><% else { %>FilteredViewTableComponent<% } %>,
    ],
})

export class <%= classify(name) %>Module {}
