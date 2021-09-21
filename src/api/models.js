export class Suggestion {
  id;
  title;
  body;
  suggestionStatus;
  totalVotes;
  totalComments;
  createdOnUtc;
  createdBy;
  lastModifiedOnUtc;
  lastModifiedBy;
};

export class SuggestionVotes {
  id;
  suggestionId;
  up;
  votedOnUtc;
  votedBy;
};

export class Comments {
  id;
  suggestionId;
  content;
  commentStatus;
  totalVotes;
  createdOnUtc;
  createdBy;
  lastModifiedOnUtc;
  lastModifiedBy;
};

export class CommentHighlights {
  id;
  commentId;
  highlightedOnUtc;
  highlightedBy;
};

export class CommentVotes {
  id;
  commentId;
  up;
  votedOnUtc;
  votedBy;
};
