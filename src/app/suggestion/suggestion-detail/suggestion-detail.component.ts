import { Comment } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackbarErrorHandler } from 'src/app/common/mat-snackbar-error-handler';
import { UserService } from 'src/app/user/user.service';
import { v4 as uuid } from 'uuid';

import { Suggestion, SuggestionStatus } from '../models';
import { SuggestionService } from '../suggestion.service';

@Component({
  selector: 'app-suggestion-detail',
  templateUrl: './suggestion-detail.component.html',
  styleUrls: ['./suggestion-detail.component.scss']
})
export class SuggestionDetailComponent implements OnInit {
  suggestionId: string;
  suggestion: Suggestion;
  loading: boolean;

  newComment: string;

  constructor(private route: ActivatedRoute, private router: Router,
    private userService: UserService,
    private suggestionService: SuggestionService, private snackBar: MatSnackBar,
    private errorHandler: MatSnackbarErrorHandler) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      this.suggestionId = paramMap.get('suggestionId');
      if (this.suggestionId) {
        this.loading = true;
        this.suggestionService.getSuggestion(this.suggestionId)
          .then((suggestion) => {
            this.suggestion = suggestion;
          })
          .catch(err => this.errorHandler.handleError(err))
          .finally(() => this.loading = false);
      } else {
        throw new Error('Cannot load suggestion page without suggestion id')
      }
    });
  }

  add() {
    // TODO
  }

  voteUp() {
    // TODO
  }

  voteDown() {
    // TODO
  }

  voteCommentUp(event, comment: Comment) {
    event.stopPropagation();
    // TODO
  }

  voteCommentDown(event, comment: Comment) {
    event.stopPropagation();
    // TODO
  }
}
