import { handleError } from '../common.js';
import { Suggestion } from '../models.js';

export function setup(app, db) {
  app.get('/api/suggestions/:id', function(req, res) {
    db.one(`
      SELECT id as "id",
             title as "title",
             description as "description",
             suggestionStatus as "suggestionStatus",
             totalVotes as "totalVotes",
             totalComments as "totalComments",
             createdOnUtc as "createdOnUtc",
             createdBy as "createdBy",
             lastModifiedOnUtc as "lastModifiedOnUtc",
             lastModifiedBy as "lastModifiedBy"
        FROM suggestions
      WHERE id = $[id]`, { id: req.params.id })
      .then((suggestion) => {
        db.any(`
          SELECT id as id,
                 suggestionId as "suggestionId",
                 content as "content",
                 commentStatus as "commentStatus",
                 totalVotes as "totalVotes",
                 createdOnUtc as "createdOnUtc",
                 createdBy as "createdBy",
                 lastModifiedOnUtc as "lastModifiedOnUtc",
                 lastModifiedBy as "lastModifiedBy"
            FROM comments
           WHERE suggestionId = $[id]`, { id: req.params.id })
          .then((comments) => {
            suggestion.comments = comments;
            res.status(200).json(suggestion);
          })
      })
      .catch(err => handleError(res, err.message, "Failed to get suggestion."));
  });

  app.get('/api/suggestions', function(req, res) {
    let selectClause = `
      SELECT id as "id",
             title as "title",
             description as "description",
             suggestionStatus as "suggestionStatus",
             totalVotes as "totalVotes",
             totalComments as "totalComments",
             createdOnUtc as "createdOnUtc",
             createdBy as "createdBy",
             lastModifiedOnUtc as "lastModifiedOnUtc",
             lastModifiedBy as "lastModifiedBy"`

    let queryBody = `
        FROM suggestions
       WHERE ($[title] IS NULL OR title LIKE '%' || $[title] || '%')
       `;

    let orderByClause = '';
    if (req.query.sortColumn) {
      orderByClause += ' ORDER BY ' + req.query.sortColumn;
      if (req.query.sortDescending) {
        orderByClause += ' DESC';
      } else {
        orderByClause += ' ASC';
      }
    } else {
      orderByClause += " ORDER BY createdOnUtc DESC"
    }

    const limitClause = ` LIMIT ${10} OFFSET ${(req.query.page || 0) * 10}`;

    const query = selectClause + queryBody + orderByClause + limitClause;

    console.log('query', query);

    let params = Object.assign({ title: null }, req.query);

    console.log('params', params);

    db.one('select count(*) ' + queryBody, params)
      .then((result) => {
        db.any(query, params)
          .then((results) => res.status(200).json({ results, totalResults: Number(result.count) }))
          .catch(err => handleError(res, err.message, 'Query failed: ' + query));
      })
      .catch(err => handleError(res, err.message, 'Query failed: ' + query));
  });

  app.post('/api/suggestions', function(req, res) {
    let suggestion = Object.assign(new Suggestion(), req.body);

    suggestion.createdOnUtc = new Date();
    suggestion.lastModifiedOnUtc = new Date();

    console.log('Creating suggestion', suggestion);

    db.none(`
      INSERT INTO suggestions(id, title, description, suggestionStatus, totalVotes, totalComments, createdOnUtc, createdBy, lastModifiedOnUtc, lastModifiedBy)
      VALUES ($[id], $[title], $[description], $[suggestionStatus], $[totalVotes], $[totalComments], $[createdOnUtc], $[createdBy], $[lastModifiedOnUtc], $[lastModifiedBy])`,
      suggestion)
      .then(() => {
        console.log('Created successfully');
        res.status(201).json(suggestion);
      })
      .catch(insertError => handleError(res, insertError.message, 'Failed to create suggestion'))
  });

  app.put('/api/suggestions', function(req, res) {
    const suggestion = req.body;
    suggestion.lastModifiedOnUtc = new Date();

    db.none(`
      UPDATE suggestions
         SET id = $[id],
             title = $[title],
             description = $[description],
             suggestionStatus = $[suggestionStatus],
             totalVotes = $[totalVotes],
             totalComments = $[totalComments],
             createdOnUtc = $[createdOnUtc],
             createdBy = $[createdBy],
             lastModifiedOnUtc = $[lastModifiedOnUtc],
             lastModifiedBy = $[lastModifiedBy]
       WHERE id = $[id]`, suggestion)
      .then(() => {
        console.log('Updated suggestion', suggestion);
        res.status(200).json(suggestion);
      })
      .catch(insertError => handleError(res, insertError.message, 'Failed to update suggestion.'))
  });

  // app.post('/api/suggestions/:suggestionId/vote', function(req, res) {

  // });
}
