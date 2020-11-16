import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { CreateQuestionComponent } from "./create-question/create-question.component";
import { LoginComponent } from "./login/login.component";
import { QuestionDetailComponent } from "./question-detail/question-detail.component";
import { QuestionListComponent } from "./question-list/question-list.component";
import { SearchResultsComponent } from "./search-results/search-results.component";
import { UserRolesComponent } from "./user-roles/user-roles.component";
import { NotFoundComponent } from "./views/not-found/not-found.component";

const routes: Routes = [
    {
        path: "plugin",
        loadChildren: () => import("app/plugin/plugin.module").then(m => m.PluginModule),
    },
    {
        path: "login",
        component: LoginComponent,
    },
    {
        path: "questions",
        component: QuestionListComponent,
    },
    {
        path: "admin/user-roles",
        component: UserRolesComponent,
    },
    {
        path: "",
        redirectTo: "questions",
        pathMatch: "full",
    },
    {
        path: "question/ask",
        component: CreateQuestionComponent,
    },
    {
        path: "question/:id",
        component: QuestionDetailComponent,
    },
    {
        path: "search/:globalSearchQuery",
        component: SearchResultsComponent,
    },
    {
        path: "404",
        component: NotFoundComponent,
    },
    {
        path: "**",
        redirectTo: "/404",
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
