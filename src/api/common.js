// Generic error handler used by all endpoints.
function handleError(res, reason, message, code = null) {
  console.log('ERROR: ' + reason);
  res.status(code || 500).json({'error': message});
}
