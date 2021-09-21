export class Suggestion {
  constructor(init?: Partial<Suggestion>) {
    if (init) {
      Object.assign(this, init);
    }
  }

  id: string;
  title: string;
  description: string;
  suggestionStatus: SuggestionStatus;
  totalVotes: number;
  totalComments: number;
  createdOnUtc: Date;
  createdBy: string;
  lastModifiedOnUtc: Date;
  lastModifiedBy: string
};

export enum SuggestionStatus {
  created = 0,
  validated = 1,
  deleted = 2,
  hidden = 3
}

export class SuggestionVote {
  constructor(init?: Partial<SuggestionVote>) {
    if (init) {
      Object.assign(this, init);
    }
  }

  id: string;
  suggestionId: string;
  up: boolean;
  votedOnUtc: Date;
  votedBy: string
};

export class Comment {
  constructor(init?: Partial<Comment>) {
    if (init) {
      Object.assign(this, init);
    }
  }

  id: string;
  suggestionId: string;
  content: string;
  commentStatus: CommentStatus;
  totalVotes: number;
  createdOnUtc: Date;
  createdBy: string;
  lastModifiedOnUtc: Date;
  lastModifiedBy: string
};

export enum CommentStatus {
  created = 0,
  validated = 1,
  deleted = 2,
  hidden = 3
}

export class CommentHighlight {
  constructor(init?: Partial<CommentHighlight>) {
    if (init) {
      Object.assign(this, init);
    }
  }

  id: string;
  commentId: string;
  highlightedOnUtc: Date;
  highlightedBy: string
};

export class CommentVote {
  constructor(init?: Partial<CommentVote>) {
    if (init) {
      Object.assign(this, init);
    }
  }

  id: string;
  commentId: string;
  up: boolean;
  votedOnUtc: Date;
  votedBy: string
};
