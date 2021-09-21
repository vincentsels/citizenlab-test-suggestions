import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { MatSnackbarErrorHandler } from '../../common/mat-snackbar-error-handler';
import { MailFilters, MailService } from '../mail.service';
import { BrowseMailsResultTableComponent } from './browse-mails-result-table/browse-mails-result-table.component';

const STORAGE_KEY_BROWSE_ACTION_FILTERS = 'browse_mail_filters';

@Component({
  selector: 'app-browse-mails',
  templateUrl: './browse-mails.component.html',
  styleUrls: ['./browse-mails.component.scss'],
})
export class BrowseMailsComponent implements OnInit {
  @ViewChild(BrowseMailsResultTableComponent) tableResults: BrowseMailsResultTableComponent;

  modelChanged: Subject<string> = new Subject<string>();

  public problems: boolean;
  public filters: MailFilters;
  public downloading = false;

  public sortTypes = [
    { column: 'a.CreatedOnUtc', desc: true, description: 'createdOnDesc' },
    { column: 'a.CreatedOnUtc', desc: false, description: 'createdOnAsc' },
  ];

  constructor(private router: Router, private mailService: MailService, private errorHandler: MatSnackbarErrorHandler) {
    this.problems = router.url.includes('browse-problems');
  }

  ngOnInit(): void {
    const filtersFromStorage = JSON.parse(localStorage.getItem(STORAGE_KEY_BROWSE_ACTION_FILTERS));
    if (filtersFromStorage) {
      this.filters = new MailFilters(filtersFromStorage);
    } else {
      this.filters = new MailFilters();
    }
    this.modelChanged.pipe(debounceTime(400)).subscribe(() => this.search());
  }

  textInputChanged() {
    this.modelChanged.next();
  }

  search() {
    setTimeout(() => {
      // Allow time for filters to propagate to child component
      this.tableResults.search(0, true);
    });

    localStorage.setItem(STORAGE_KEY_BROWSE_ACTION_FILTERS, JSON.stringify(this.filters));
  }

  clear() {
    this.filters = new MailFilters();
    localStorage.removeItem(STORAGE_KEY_BROWSE_ACTION_FILTERS);
    setTimeout(() => this.search());
  }

  // download() {
  //   this.downloading = true;
  //   this.mailService.downloadMails(this.filters)
  //     .catch(err => this.errorHandler.handleError(err))
  //     .finally(() => this.downloading = false);
  // }

  compareSortColumnAndOrder = (o1, o2) => o1 && o2 && o1.description === o2.description;
}
