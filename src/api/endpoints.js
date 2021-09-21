import bodyParser from 'body-parser';
import pgPromise from 'pg-promise';
import { Mail } from './mail.js';

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code = null) {
  console.log('ERROR: ' + reason);
  res.status(code || 500).json({'error': message});
}

export function bootstrap(app) {
  app.use(bodyParser.json());

  // Create a database variable outside of the database connection callback to reuse the connection pool in your app.
  const opts = process.env.DATABASE_URL ? {
    connectionString: process.env.DATABASE_URL || 'postgres://$(whoami)?sslmode=disable',
    ssl: { rejectUnauthorized: false }
  } : {
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'postgres',
  };

  var db = pgPromise()(opts);

  // Only get firstName, lastName, city; where public flag is true
  app.get('/api/mails/last', function(req, res) {
    db.any(`
      SELECT first_name as "firstName", substring(last_name, 1, 1) as "lastName", city, created_on as "sentOn"
      FROM mails
      WHERE allow_public = true
      ORDER BY created_on DESC
      LIMIT 10`)
      .then((result) => res.status(200).json(result.rows))
      .catch(err => handleError(res, err.message, "Failed to get contacts."));
  });

  app.get('/api/mails/:id', function(req, res) {
    db.one(`
      SELECT id, first_name as "firstName", last_name as "lastName", email, postal_code as "postalCode", city, lang, allow_public as "allowPublic", stay_up_to_date as "stayUpToDate", mail_to as "to", mail_subject as "subject", mail_body as "body", created_on as "sentOn"
      FROM mails
      WHERE id = $[id]`, { id: req.params.id })
      .then((result) => res.status(200).json(result))
      .catch(err => handleError(res, err.message, "Failed to get contacts."));
  });

  app.get('/api/mails', function(req, res) {
    let selectClause = `
      SELECT id, first_name as "firstName", last_name as "lastName", email, postal_code as "postalCode", city, lang, allow_public as "allowPublic", stay_up_to_date as "stayUpToDate", mail_to as "to", mail_subject as "subject", mail_body as "body", created_on as "sentOn" `

    let queryBody = `
        FROM mails
       WHERE ($[firstName] IS NULL OR first_name LIKE '%' || $[firstName] || '%')
         AND ($[lastName] IS NULL OR last_name LIKE '%' || $[lastName] || '%')
         AND ($[email] IS NULL OR email LIKE '%' || $[email] || '%')
         AND ($[postalCode] IS NULL OR postal_code = $[postalCode])
         AND ($[city] IS NULL OR city = $[city])
         AND ($[lang] IS NULL OR lang = $[lang])
         AND ($[allowPublic] IS NULL OR allow_public = $[allowPublic])
         AND ($[stayUpToDate] IS NULL OR stay_up_to_date = $[stayUpToDate])
         AND ($[to] IS NULL OR mail_to LIKE '%' || $[to] || '%')
         AND ($[subject] IS NULL OR mail_subject LIKE '%' || $[subject] || '%')
         AND ($[body] IS NULL OR mail_body LIKE '%' || $[body] || '%')
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
      orderByClause += " ORDER BY created_on DESC"
    }

    const limitClause = ` LIMIT ${10} OFFSET ${(req.query.page || 0) * 10}`;

    const query = selectClause + queryBody + orderByClause + limitClause;

    console.log('query', query);

    let params = Object.assign(new Mail(), req.query);

    console.log('params', params);

    db.one('select count(*) ' + queryBody, params)
      .then((result) => {
        db.any(query, params)
          .then((results) => res.status(200).json({ results, totalResults: Number(result.count) }))
          .catch(err => handleError(res, err.message, 'Query failed: ' + query));
      })
      .catch(err => handleError(res, err.message, 'Query failed: ' + query));
  });

  app.post('/api/mails', function(req, res) {
    const newMail = req.body;

    db.one(`
      INSERT INTO mails(first_name, last_name, email, postal_code, city, lang, allow_public, stay_up_to_date, mail_to, mail_subject, mail_body, created_on, sent_on)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id`,
      [newMail.firstName, newMail.lastName, newMail.email, newMail.postalCode, newMail.city, newMail.lang, newMail.allowPublic, newMail.stayUpToDate, newMail.to, newMail.subject, newMail.body, new Date(), null])
      .then((id) => {
        newMail.id = id;
        console.log('Created email record: ', id);
        res.status(201).json(newMail);
      })
      .catch(insertError => handleError(res, insertError.message, 'Failed to create new mail.'))
  });

  app.put('/api/mails', function(req, res) {
    const mail = req.body;

    db.none(`
      UPDATE mails
         SET first_name = $[firstName],
             last_name = $[lastName],
             email = $[email],
             postal_code = $[postalCode],
             city = $[city],
             lang = $[lang],
             allow_public = $[allowPublic],
             stay_up_to_date = $[stayUpToDate],
             mail_to = $[to],
             mail_subject = $[subject],
             mail_body = $[body]
       WHERE id = $[id]`, mail)
      .then(() => {
        console.log('Updated email record: ', mail.id);
        res.status(200).json(mail);
      })
      .catch(insertError => handleError(res, insertError.message, 'Failed to update mail.'))
  });
}
