// Generic error handler used by all endpoints.
export function handleError(res, reason, message, code = null) {
  console.error('ERROR: ' + reason);
  res.status(code || 500).json({'error': message});
}
