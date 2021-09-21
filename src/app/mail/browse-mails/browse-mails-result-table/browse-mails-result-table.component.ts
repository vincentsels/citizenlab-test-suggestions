import { Component, OnInit, Input, Output, EventEmitter, HostListener, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { MailFilters, MailService } from '../../mail.service';
import { MatSnackbarErrorHandler } from '../../../common/mat-snackbar-error-handler';
import { Mail } from '../../mail';

@Component({
  selector: 'app-browse-mails-result-table',
  templateUrl: './browse-mails-result-table.component.html',
  styleUrls: ['./browse-mails-result-table.component.scss'],
})
export class BrowseMailsResultTableComponent implements OnInit, OnDestroy {
  @Input() public filters = new MailFilters();
  @Input() public displayedColumns = ['subject', 'sentOn'];

  page = 0;

  loading: boolean;
  destroyed: boolean;
  mails: Mail[] = [];
  totalResults: number = 0;

  error: string;

  constructor(private mailService: MailService, private dialog: MatDialog, private errorHandler: MatSnackbarErrorHandler) {
  }

  ngOnInit(): void {
    this.search(0, true);
  }

  ngOnDestroy() {
    this.destroyed = true;
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    if (this.loading || this.destroyed) return;
    const buffer = 100;
    if ((window.innerHeight + window.scrollY + buffer) >= document.body.offsetHeight) {
      this.page++;
      this.search(this.page, false);
    }
  }

  search(page = 0, filtersChanged = true): Promise<any> {
    if (this.destroyed) return;
    if (filtersChanged) {
      page = 0;
      this.page = 0;
    } else {
      if (this.totalResults === this.mails.length) return;
    }

    this.page = page;
    this.error = null;
    this.loading = true;
    this.mailService.browseMails(this.filters, page).then((response) => {
      this.totalResults = response.totalResults;
      if (filtersChanged) this.mails = response.results;
      else this.mails = this.mails.concat(response.results);

      if (this.totalResults > this.mails.length && response.results.length > 0) setTimeout(() => this.onWindowScroll()); // After redraw
    })
    .catch(err => this.errorHandler.handleError(err))
    .finally(() => {
      this.loading = false;
    });
  }

  // assignMailToSelf(mail: Mail) {
  //   mail.owner = this.userService.user.userId;
  //   this.mailService.updateMail(mail).then(() => this.mailAssignedEmitter.emit(mail));
  // }

  // openMail(mail: Mail) {
  //   const ref = this.dialog.open(MailDetailDialogComponent, { data: {
  //     mailId: mail.id,
  //   }, autoFocus: false});


  //   ref.afterClosed().subscribe((mail: Mail) => {
  //     if (!mail) return; // Canceled

  //     this.mails = this.mails.map(a => a.id === mail.id ? mail : a);
  //   });
  // }
}
