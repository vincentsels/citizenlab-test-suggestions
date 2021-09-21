import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackbarErrorHandler } from 'src/app/common/mat-snackbar-error-handler';
import { UserService } from 'src/app/user/user.service';
import { v4 as uuid } from 'uuid';

import { Suggestion, SuggestionStatus } from '../models';
import { SuggestionService } from '../suggestion.service';

@Component({
  selector: 'app-create-edit-suggestion',
  templateUrl: './create-edit-suggestion.component.html',
  styleUrls: ['./create-edit-suggestion.component.scss']
})
export class CreateEditSuggestionComponent implements OnInit {
  edit: boolean;
  suggestionId: string;
  suggestion: Suggestion;
  loading: boolean;
  saving: boolean;

  constructor(private route: ActivatedRoute, private router: Router,
    private userService: UserService,
    private suggestionService: SuggestionService, private snackBar: MatSnackBar,
    private errorHandler: MatSnackbarErrorHandler) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      this.suggestionId = paramMap.get('suggestionId');
      if (this.suggestionId) {
        this.edit = true;
        this.loading = true;
        this.suggestionService.getSuggestion(this.suggestionId)
          .then((suggestion) => {
            this.suggestion = suggestion;
          })
          .catch(err => this.errorHandler.handleError(err))
          .finally(() => this.loading = false);
      } else {
        this.edit = false;
        this.suggestion = new Suggestion({
          id: uuid(),
          createdBy: this.userService.getUserName(),
          lastModifiedBy: this.userService.getUserName(),
          suggestionStatus: SuggestionStatus.created,
          totalComments: 0,
          totalVotes: 0,
        });
      }
    });
  }

  save() {
    this.saving = true;
    if (this.edit) {
      this.suggestionService.updateSuggestion(this.suggestion)
        .then(() => {
          this.snackBar.open('Suggestion updated successfully', null, { panelClass: 'snackbar-success' })
          this.router.navigate(['/']);
        })
        .catch(err => this.errorHandler.handleError(err))
        .finally(() => this.saving = false);
    } else {
      this.suggestionService.createSuggestion(this.suggestion)
        .then(() => {
          this.snackBar.open('Suggestion created successfully', null, { panelClass: 'snackbar-success' })
          this.router.navigate(['/']);
        })
        .catch(err => this.errorHandler.handleError(err))
        .finally(() => this.saving = false);
      }
  }
}
