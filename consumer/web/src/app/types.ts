export interface IPost {
    _id: string;
    text: string;
    votes: number;
    author: string;
    creationDate: Date;
    lastUpdatedDate: Date;
}

export interface IQuestion {
    _id: string;
    title: string;
    tags: string[];
    acceptedAnswerPostId: string;
    questionPost: IPost;
    answerPosts?: IPost[];
    userVotes?: IVote[];
}

export interface IQuestionsPayload {
    total: number;
    questions: IQuestion[];
}

export interface IUser {
    username: string;
    roles?: string[];
}

export interface IQuery {
    questions: IQuestionsPayload;
}

export interface IVote {
    _id: string;
    postId: string;
    vote: number;
}

export interface IAddQuestionInput {
    title: string;
    text: string;
    author: string;
}

export interface IQuestionsInput {
    searchValue?: string;
    start?: number;
    end?: number;
    sortBy?: string;
    direction?: string;
}

export interface IAuthenticationInput {
    username: string;
    password: string;
}

export interface IQuestionUpdateInput {
    id: string;
    title: string;
    text: string;
}

export interface IAnswerQuestionInput {
    id: string;
    text: string;
    author: string;
}

export interface IPostUpdateInput {
    id: string;
    text: string;
}

export interface IRegisterVoteInput {
    postId: string;
    vote: number;
}

export interface IDeleteAnswerInput {
    questionId: string;
    answerId: string;
}

export interface IMarkAcceptedAnswerInput {
    questionId: string;
    acceptedAnswerPostId: string;
}
