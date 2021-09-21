import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Suggestion } from './models';
import { environment } from 'src/environments/environment';

@Injectable()
export class SuggestionService {
  private baseUrl = '/api/suggestions';

  constructor(private http: HttpClient) {}

  browseSuggestions(filters: SuggestionFilters, page?: number) : Promise<any> {
    return this.http.get<Suggestion[]>(this.baseUrl, { params: filters.toHttpParams(page) })
      .toPromise();
  }

  getSuggestion(id: string) : Promise<any> {
    return this.http.get<Suggestion>(this.baseUrl+ '/' + id)
      .toPromise();
  }

  createSuggestion(suggestion: Suggestion): Promise<void | Suggestion> {
    return this.http.post<Suggestion>(this.baseUrl, suggestion)
      .toPromise();
  }

  updateSuggestion(suggestion: Suggestion): Promise<void | Suggestion> {
    return this.http.put<Suggestion>(this.baseUrl, suggestion)
      .toPromise();
  }
}

export class SuggestionFilters {
  constructor(props: Partial<SuggestionFilters> = {}) {
    Object.assign(this, props);
  }

  title: string;

  sortColumnAndOrder?: { column: string, desc: boolean, description: string };

  toHttpParams(page?: number) {
    let params = new HttpParams();

    if (page) params = params.set('page', page.toString());

    if (this.sortColumnAndOrder && this.sortColumnAndOrder.column) {
      params = params.set('sortColumn', this.sortColumnAndOrder.column);
      // tslint:disable-next-line: no-boolean-literal-compare
      if (this.sortColumnAndOrder.desc === true) params = params.set('sortDescending', 'true');
      else if (this.sortColumnAndOrder.desc === false) params = params.set('sortDescending', 'false');
    }

    if (this.title) params = params.set('title', this.title);

    // if (this.title) params = params.set('title', 'true');

    // if (this.sentOnFrom) {
    //   params = params.set('sentOnFrom', this.sentOnFrom.toISOString());
    // }
    // if (this.sentOnTo) {
    //   params = params.set('sentOnTo', this.sentOnTo.toISOString());
    // }

    return params;
  }
}
