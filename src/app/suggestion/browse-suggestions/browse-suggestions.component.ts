import { Component, ViewChild, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { UserService } from 'src/app/user/user.service';

import { MatSnackbarErrorHandler } from '../../common/mat-snackbar-error-handler';
import { Suggestion, SuggestionStatus } from '../models';
import { SuggestionFilters, SuggestionService } from '../suggestion.service';
import { DUMMY_SUGGESTIONS } from './dummy-suggestions';

const STORAGE_KEY_BROWSE_ACTION_FILTERS = 'browse_suggestion_filters';

@Component({
  selector: 'app-browse-suggestions',
  templateUrl: './browse-suggestions.component.html',
  styleUrls: ['./browse-suggestions.component.scss'],
})
export class BrowseSuggestionsComponent implements OnInit {
  modelChanged: Subject<string> = new Subject<string>();

  problems: boolean;
  filters: SuggestionFilters;
  downloading = false;

  sortTypes = [
    { column: 'createdOnUtc', desc: true, description: 'createdOnDesc' },
    { column: 'createdOnUtc', desc: false, description: 'createdOnAsc' },
  ];

  page = 0;

  loading: boolean;
  destroyed: boolean;
  suggestions: Suggestion[] = [];
  totalResults: number = 0;

  error: string;

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
    this.modelChanged.pipe(debounceTime(400)).subscribe(() => this.newSearch());

    this.newSearch();
    // this.suggestions = DUMMY_SUGGESTIONS; // TODO: remove
  }

  textInputChanged() {
    this.modelChanged.next();
  }

  newSearch() {
    localStorage.setItem(STORAGE_KEY_BROWSE_ACTION_FILTERS, JSON.stringify(this.filters));
    this.search();
  }

  search(page = 0, filtersChanged = true): Promise<any> {
    if (this.destroyed) return;
    if (filtersChanged) {
      page = 0;
      this.page = 0;
    } else {
      if (this.totalResults === this.suggestions.length) return;
    }

    this.page = page;
    this.error = null;
    this.loading = true;
    this.suggestionService.browseSuggestions(this.filters, page).then((response) => {
      this.totalResults = response.totalResults;
      if (filtersChanged) this.suggestions = response.results;
      else this.suggestions = this.suggestions.concat(response.results);

      if (this.totalResults > this.suggestions.length && response.results.length > 0) setTimeout(() => this.onWindowScroll()); // After redraw
    })
    .catch(err => this.errorHandler.handleError(err))
    .finally(() => {
      this.loading = false;
    });
  }

  clear() {
    this.filters = new SuggestionFilters();
    localStorage.removeItem(STORAGE_KEY_BROWSE_ACTION_FILTERS);
    setTimeout(() => this.newSearch());
  }

  // download() {
  //   this.downloading = true;
  //   this.suggestionService.downloadSuggestions(this.filters)
  //     .catch(err => this.errorHandler.handleError(err))
  //     .finally(() => this.downloading = false);
  // }

  ngOnDestroy() {
    this.destroyed = true;
  }

  voteUp(suggestion: Suggestion) {
    // TODO
  }

  voteDown(suggestion: Suggestion) {
    // TODO
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

  compareSortColumnAndOrder = (o1, o2) => o1 && o2 && o1.description === o2.description;
}
