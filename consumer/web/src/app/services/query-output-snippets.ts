export const postFields = `
        _id
        text
        votes
        author
        creationDate
        lastUpdatedDate
    `;

export const partialQuestionFields = `
        _id
        title
        tags
        acceptedAnswerPostId
        questionPost {
            ${postFields}
        }
    `;

export const allQuestionFields = `
        ${partialQuestionFields}
        answerPosts {
            ${postFields}
        }
        userVotes {
            _id
            postId
            vote
        }
    `;
