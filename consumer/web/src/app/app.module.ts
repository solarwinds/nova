import { DatePipe } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { MissingTranslationStrategy, NgModule, TRANSLATIONS, TRANSLATIONS_FORMAT } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MISSING_TRANSLATION_STRATEGY } from "@ngx-translate/i18n-polyfill";
import { NuiModule, ToastService } from "@solarwinds/nova-bits";
import { Apollo, ApolloModule } from "apollo-angular";
import { InMemoryCache } from "apollo-cache-inmemory";
import { onError } from "apollo-link-error";
import { createHttpLink } from "apollo-link-http";

import { environment, translationLibrary } from "../environments/environment";

import { AnswerComponent } from "./answer/answer.component";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CreateQuestionComponent } from "./create-question/create-question.component";
import { DemoWizardComponent } from "./demo-wizard/demo-wizard.component";
import { InlineWizardDemoComponent } from "./demo-wizard/inline-wizard-demo.component";
import { LoginComponent } from "./login/login.component";
import { FromNowPipe } from "./pipes/from-now.pipe";
import { PostFormComponent } from "./post-form/post-form.component";
import { PostComponent } from "./post/post.component";
import { QuestionDetailComponent } from "./question-detail/question-detail.component";
import { QuestionListComponent } from "./question-list/question-list.component";
import { SearchResultsComponent } from "./search-results/search-results.component";
import { PostService } from "./services/post.service";
import { QuestionService } from "./services/question.service";
import { VoteService } from "./services/vote.service";
import { UserRolesComponent } from "./user-roles/user-roles.component";
import { NotFoundComponent } from "./views/not-found/not-found.component";

@NgModule({
    declarations: [
        AppComponent,
        QuestionListComponent,
        DemoWizardComponent,
        InlineWizardDemoComponent,
        CreateQuestionComponent,
        QuestionDetailComponent,
        PostComponent,
        PostFormComponent,
        NotFoundComponent,
        FromNowPipe,
        LoginComponent,
        AnswerComponent,
        SearchResultsComponent,
        UserRolesComponent,
    ],
    imports: [
        HttpClientModule,
        BrowserModule,
        BrowserAnimationsModule,
        ApolloModule,
        FormsModule,
        ReactiveFormsModule,
        NuiModule,
        AppRoutingModule,
    ],
    entryComponents: [
        InlineWizardDemoComponent,
    ],
    providers: [
        PostService,
        VoteService,
        QuestionService,
        DatePipe,
        { provide: TRANSLATIONS_FORMAT, useValue: "xlf" },
        { provide: MISSING_TRANSLATION_STRATEGY, useValue: MissingTranslationStrategy.Warning },
        // {provide: LOCALE_ID, useValue: "fr" }, // needed if using JIT compiler
        { provide: TRANSLATIONS, useValue: translationLibrary },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor(apollo: Apollo,
        toastService: ToastService) {
        const API_PORT = (<any>environment).apiPort || 4000;
        const API_HOST = (<any>environment).apiHost || "localhost";
        // const API_URI = `http://${API_HOST}:${API_PORT}/graphql`;
        // tslint:disable-next-line:no-console
        console.info("Built, using nova-bits version: ", (<any>environment).nuiVersion);

        const errorLink = onError(({ graphQLErrors, networkError }) => {
            if (graphQLErrors) {
                graphQLErrors.map((e) =>
                    toastService.error({ message: e.message, title: "GraphQL error" })
                );
            }

            if (networkError) {
                toastService.error({ message: networkError.message, title: "Network error" });
            }
        });


        const httpLinkInstance = createHttpLink({
            uri: "/api",
            credentials: "include",
        });

        apollo.create({
            link: errorLink.concat(httpLinkInstance),
            cache: new InMemoryCache(),
            defaultOptions: {
                watchQuery: {
                    fetchPolicy: "network-only",
                    errorPolicy: "all",
                },
                query: {
                    fetchPolicy: "network-only",
                    errorPolicy: "all",
                },
            },
        });
    }
}
