import { ErrorHandler, NgModule, NgZone } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MaterialModule } from './material.module';
import { CreateEditMailComponent } from './mail/create-edit-mail/create-edit-mail.component';
import { MailService } from './mail/mail.service';
import { BrowseMailsComponent } from './mail/browse-mails/browse-mails.component';
import { BrowseMailsResultTableComponent } from './mail/browse-mails/browse-mails-result-table/browse-mails-result-table.component';
import { LimitLengthPipe } from './common/limit-length.pipe';
import { MatSnackbarErrorHandler } from './common/mat-snackbar-error-handler';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DashboardComponent,
    CreateEditMailComponent,
    BrowseMailsComponent,
    BrowseMailsResultTableComponent,
    LimitLengthPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
  ],
  providers: [
    MailService,
    MatSnackbarErrorHandler,
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 10000 } },
    { provide: ErrorHandler, useClass: MatSnackbarErrorHandler, deps: [MatSnackBar, NgZone] },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }