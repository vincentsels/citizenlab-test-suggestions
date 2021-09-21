import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Mail } from './mail';
import { environment } from 'src/environments/environment';

@Injectable()
export class MailService {
    private baseUrl = '/api/mails';

    constructor(private http: HttpClient) {}

    browseMails(filters: MailFilters, page?: number) : Promise<any> {
      return this.http.get<Mail[]>(this.baseUrl, { params: filters.toHttpParams(page) })
        .toPromise();
    }

    getMail(id: string) : Promise<any> {
      return this.http.get<Mail>(this.baseUrl+ '/' + id)
        .toPromise();
    }

    getLastMails(): Promise<void | Mail[]> {
      return this.http.get<Mail[]>(this.baseUrl + '/last')
        .toPromise();
    }

    createMail(newMail: Mail): Promise<void | Mail> {
      return this.http.post<Mail>(this.baseUrl, newMail)
        .toPromise();
    }

    updateMail(mail: Mail): Promise<void | Mail> {
      return this.http.put<Mail>(this.baseUrl, mail)
        .toPromise();
    }
}

export class MailFilters {
  constructor(props: Partial<MailFilters> = {}) {
    Object.assign(this, props);
    if (props.sentOnFrom) this.sentOnFrom = new Date(props.sentOnFrom);
    if (props.sentOnTo) this.sentOnTo = new Date(props.sentOnTo);
  }

  firstName: string;
  lastName: string;
  email: string;
  postalCode: string;
  city: string;
  lang: string;
  allowPublic: boolean;
  allowReplies: boolean;
  stayUpToDate: boolean;
  to: string;
  subject: string;
  body: string;
  sentOnFrom: Date;
  sentOnTo: Date;

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

    if (this.allowPublic) params = params.set('allowPublic', 'true');
    if (this.allowReplies) params = params.set('allowReplies', 'true');
    if (this.stayUpToDate) params = params.set('stayUpToDate', 'true');

    if (this.firstName) params = params.set('firstName', this.firstName);
    if (this.lastName) params = params.set('lastName', this.lastName);
    if (this.email) params = params.set('email', this.email);
    if (this.subject) params = params.set('subject', this.subject);
    if (this.body) params = params.set('body', this.body);
    if (this.to) params = params.set('to', this.to);

    if (this.sentOnFrom) {
      params = params.set('sentOnFrom', this.sentOnFrom.toISOString());
    }
    if (this.sentOnTo) {
      params = params.set('sentOnTo', this.sentOnTo.toISOString());
    }

    return params;
  }
}
