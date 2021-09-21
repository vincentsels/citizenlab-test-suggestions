import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackbarErrorHandler } from 'src/app/common/mat-snackbar-error-handler';

import { Mail } from '../mail';
import { MailService } from '../mail.service';

@Component({
  selector: 'app-create-edit-mail',
  templateUrl: './create-edit-mail.component.html',
  styleUrls: ['./create-edit-mail.component.scss']
})
export class CreateEditMailComponent implements OnInit {
  edit: boolean;
  mailId: string;
  mail: Mail;
  loading: boolean;
  saving: boolean;

  constructor(private route: ActivatedRoute, private router: Router,
    private mailService: MailService, private snackBar: MatSnackBar,
    private errorHandler: MatSnackbarErrorHandler) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      this.mailId = paramMap.get('mailId');
      if (this.mailId) {
        this.edit = true;
        this.loading = true;
        this.mailService.getMail(this.mailId)
          .then((mail) => {
            this.mail = mail;
          })
          .catch(err => this.errorHandler.handleError(err))
          .finally(() => this.loading = false);
      } else {
        this.edit = false;
        this.mail = new Mail({ lang: 'nl', email: 'vincent_sels@hotmail.com', to: 'vincent.sels@gmail.com', subject: 'test', body: 'test body', firstName: 'Vincent', lastName: 'Sels', sentOn: new Date() });
      }
    });
  }

  save() {
    this.saving = true;
    if (this.edit) {
      this.mailService.updateMail(this.mail)
        .then(() => {
          this.snackBar.open('Mail updated successfully', null, { panelClass: 'snackbar-success' })
          this.router.navigate(['/']);
        })
        .catch(err => this.errorHandler.handleError(err))
        .finally(() => this.saving = false);
    } else {
      this.mailService.createMail(this.mail)
        .then(() => {
          this.snackBar.open('Mail created successfully', null, { panelClass: 'snackbar-success' })
          this.router.navigate(['/']);
        })
        .catch(err => this.errorHandler.handleError(err))
        .finally(() => this.saving = false);
      }
  }
}
