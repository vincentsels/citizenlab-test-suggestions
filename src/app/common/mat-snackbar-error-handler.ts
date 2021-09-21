import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getErrorMessage } from './error-message-extractor';

@Injectable()
export class MatSnackbarErrorHandler implements ErrorHandler {
  constructor(private snackBar: MatSnackBar, private zone: NgZone) {}

  handleError(error) {
    console.error(error);

    const title = error.statusText || 'Error';
    const text = getErrorMessage(error);

    if (error instanceof TypeError) {
      throw error; // https://github.com/angular/angular/issues/17010#issuecomment-519202602
    }

    this.zone.run(() => this.snackBar.open(title + ': ' + text, 'OK', { panelClass: 'error' }));
  }
}
