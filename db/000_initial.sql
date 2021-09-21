CREATE TABLE suggestions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  suggestionStatus SMALLINT NOT NULL DEFAULT 0,
  totalVotes INTEGER NOT NULL DEFAULT 0,
  totalComments INTEGER NOT NULL DEFAULT 0,
  createdOnUtc TIMESTAMP NOT NULL,
  createdBy TEXT NOT NULL,
  lastModifiedOnUtc TIMESTAMP NOT NULL,
  lastModifiedBy TEXT NOT NULL
);

CREATE TABLE suggestionVotes (
  id TEXT PRIMARY KEY,
  suggestionId TEXT NOT NULL,
  up BOOLEAN NOT NULL,
  votedOnUtc TIMESTAMP NOT NULL,
  votedBy TEXT NOT NULL
);

ALTER TABLE suggestionVotes ADD CONSTRAINT uk_suggestionVotes_votedBy UNIQUE (suggestionId, votedBy);
ALTER TABLE suggestionVotes ADD CONSTRAINT fk_suggestionId_suggestions_id FOREIGN KEY (suggestionId) REFERENCES suggestions (id);

CREATE TABLE comments (
  id TEXT PRIMARY KEY,
  suggestionId TEXT NOT NULL,
  content TEXT NOT NULL,
  commentStatus SMALLINT NOT NULL DEFAULT 0,
  totalVotes INTEGER NOT NULL DEFAULT 0,
  createdOnUtc TIMESTAMP NOT NULL,
  createdBy TEXT NOT NULL,
  lastModifiedOnUtc TIMESTAMP NOT NULL,
  lastModifiedBy TEXT NOT NULL
);

CREATE TABLE commentHighlights (
  id TEXT PRIMARY KEY,
  commentId TEXT NOT NULL,
  highlightedOnUtc TIMESTAMP NOT NULL,
  highlightedBy TEXT NOT NULL
);

ALTER TABLE commentHighlights ADD CONSTRAINT uk_commentHighlights_highlightBy UNIQUE (commentId, highlightedBy);
ALTER TABLE commentHighlights ADD CONSTRAINT fk_commentId_comments_id FOREIGN KEY (commentId) REFERENCES comments (id);

CREATE TABLE commentVotes (
  id TEXT PRIMARY KEY,
  commentId TEXT NOT NULL,
  up BOOLEAN NOT NULL,
  votedOnUtc TIMESTAMP NOT NULL,
  votedBy TEXT NOT NULL
);

ALTER TABLE commentVotes ADD CONSTRAINT uk_commentVotes_votedBy UNIQUE (commentId, votedBy);
ALTER TABLE commentVotes ADD CONSTRAINT fk_commentId_comments_id FOREIGN KEY (commentId) REFERENCES comments (id);
