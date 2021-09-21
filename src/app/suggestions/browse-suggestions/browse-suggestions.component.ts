import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { UserService } from 'src/app/user/user.service';

import { MatSnackbarErrorHandler } from '../../common/mat-snackbar-error-handler';
import { SuggestionFilters, SuggestionService } from '../suggestion.service';

const STORAGE_KEY_BROWSE_ACTION_FILTERS = 'browse_suggestion_filters';

@Component({
  selector: 'app-browse-suggestions',
  templateUrl: './browse-suggestions.component.html',
  styleUrls: ['./browse-suggestions.component.scss'],
})
export class BrowseSuggestionsComponent implements OnInit {
  modelChanged: Subject<string> = new Subject<string>();

  public problems: boolean;
  public filters: SuggestionFilters;
  public downloading = false;

  public sortTypes = [
    { column: 'createdOnUtc', desc: true, description: 'createdOnDesc' },
    { column: 'createdOnUtc', desc: false, description: 'createdOnAsc' },
  ];

  constructor(private router: Router, private suggestionService: SuggestionService, private errorHandler: MatSnackbarErrorHandler, userService: UserService) {
    this.problems = router.url.includes('browse-problems');
  }

  ngOnInit(): void {
    const filtersFromStorage = JSON.parse(localStorage.getItem(STORAGE_KEY_BROWSE_ACTION_FILTERS));
    if (filtersFromStorage) {
      this.filters = new SuggestionFilters(filtersFromStorage);
    } else {
      this.filters = new SuggestionFilters();
    }
    this.modelChanged.pipe(debounceTime(400)).subscribe(() => this.search());
  }

  textInputChanged() {
    this.modelChanged.next();
  }

  search() {
    // TODO
    localStorage.setItem(STORAGE_KEY_BROWSE_ACTION_FILTERS, JSON.stringify(this.filters));
  }

  clear() {
    this.filters = new SuggestionFilters();
    localStorage.removeItem(STORAGE_KEY_BROWSE_ACTION_FILTERS);
    setTimeout(() => this.search());
  }

  // download() {
  //   this.downloading = true;
  //   this.suggestionService.downloadSuggestions(this.filters)
  //     .catch(err => this.errorHandler.handleError(err))
  //     .finally(() => this.downloading = false);
  // }

  compareSortColumnAndOrder = (o1, o2) => o1 && o2 && o1.description === o2.description;
}
