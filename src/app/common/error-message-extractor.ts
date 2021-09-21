export function getErrorMessage(error) {
  if (!error) return 'Unknown error';

  let text = '';
  if (error.status === 0 && error.ok === false && error.name === 'HttpErrorResponse') {
    text = 'The server appears to be off-line. Contact the helpdesk in case the problem persists.';
  } else if (error.error) {
    text = error.error.ExceptionMessage || error.error.Message;
  }

  text = text || error.message || JSON.stringify(error) || 'Unknown error';

  return text;
}
