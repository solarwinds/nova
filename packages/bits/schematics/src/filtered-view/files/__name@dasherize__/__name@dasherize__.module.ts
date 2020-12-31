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
