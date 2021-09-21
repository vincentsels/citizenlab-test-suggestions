import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackbarErrorHandler } from 'src/app/common/mat-snackbar-error-handler';
import { UserService } from 'src/app/user/user.service';
import { v4 as uuid } from 'uuid';
import { CommentService } from '../comment.service';

import { Suggestion, SuggestionStatus, Comment, CommentStatus } from '../models';
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
  commentAdded: boolean;

  newComment: string;

  constructor(private route: ActivatedRoute, private router: Router,
    private userService: UserService, private commentService: CommentService,
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

  addComment() {
    const newComment = new Comment({
      id: uuid(),
      suggestionId: this.suggestionId,
      commentStatus: CommentStatus.created,
      content: this.newComment,
      createdBy: this.userService.getUserName(),
      createdOnUtc: new Date(),
      lastModifiedBy: this.userService.getUserName(),
      lastModifiedOnUtc: new Date(),
      totalVotes: 0,
    });

    this.commentService.createComment(newComment)
      .then(() => {
        this.snackBar.open('Comment created successfully', null, { panelClass: 'snackbar-success' })
        this.suggestion.comments.unshift(newComment);
        this.commentAdded = true;
      })
      .catch(err => this.errorHandler.handleError(err));
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
