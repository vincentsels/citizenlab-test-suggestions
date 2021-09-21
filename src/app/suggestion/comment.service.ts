import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Comment } from './models';
import { environment } from 'src/environments/environment';

@Injectable()
export class CommentService {
  private baseUrl = '/api/';

  constructor(private http: HttpClient) {}

  createComment(comment: Comment): Promise<void | Comment> {
    return this.http.post<Comment>(this.baseUrl + 'suggestions/' + comment.suggestionId + '/comments', comment)
      .toPromise();
  }

  updateComment(comment: Comment): Promise<void | Comment> {
    return this.http.put<Comment>(this.baseUrl, comment)
      .toPromise();
  }
}
