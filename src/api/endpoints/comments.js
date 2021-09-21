import { handleError } from '../common.js';

export function setup(app, db) {
  app.post('/api/comments', function(req, res) {
    const comment = req.body;
    comment.createOnUtc = new Date();
    comment.lastModifiedOnUtc = new Date();

    db.tx(t => {
      const queryInsertComment = t.none(`
        INSERT INTO comments(id, suggestionId, content, commentStatus, totalVotes, createdOnUtc, createdBy, lastModifiedOnUtc, lastModifiedBy)
        VALUES ($[id], $[suggestionId], $[content], $[commentStatus], $[totalVotes], $[createdOnUtc], $[createdBy], $[lastModifiedOnUtc], $[lastModifiedBy])`,
        comment);
      const queryUpdateSuggestionTotalComments = t.none(`
        UPDATE suggestions
           SET totalComments = totalComments + 1
         WHERE id = $[suggestionId]
        `, { suggestionId: comment.suggestionId });

      t.batch([queryInsertComment, queryUpdateSuggestionTotalComments]);
    }).then(() => {
      console.log('Created comment', comment);
      res.status(201).json(comment);
    })
    .catch(insertError => handleError(res, insertError.message, 'Failed to create comment'))
  });

  app.put('/api/comments', function(req, res) {
    const comment = req.body;

    db.none(`
      UPDATE comments
         SET id = $[id],
             suggestionId = $[suggestionId],
             content = $[content],
             commentStatus = $[commentStatus],
             totalVotes = $[totalVotes],
             createdOnUtc = $[createdOnUtc],
             createdBy = $[createdBy],
             lastModifiedOnUtc = $[lastModifiedOnUtc],
             lastModifiedBy = $[lastModifiedBy],
       WHERE id = $[id]`, comment)
      .then(() => {
        console.log('Updated comment', comment);
        res.status(200).json(comment);
      })
      .catch(insertError => handleError(res, insertError.message, 'Failed to update comment.'))
  });
}
