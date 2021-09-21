import { ErrorHandler, NgModule, NgZone } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MaterialModule } from './material.module';
import { LimitLengthPipe } from './common/limit-length.pipe';
import { MatSnackbarErrorHandler } from './common/mat-snackbar-error-handler';
import { UserService } from './user/user.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CreateEditSuggestionComponent } from './suggestion/create-edit-suggestion/create-edit-suggestion.component';
import { BrowseSuggestionsComponent } from './suggestion/browse-suggestions/browse-suggestions.component';
import { SuggestionService } from './suggestion/suggestion.service';

// AoT requires an exported function for factories
// tslint:disable-next-line:function-name
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DashboardComponent,
    CreateEditSuggestionComponent,
    BrowseSuggestionsComponent,
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
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    SuggestionService,
    UserService,
    MatSnackbarErrorHandler,
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 10000 } },
    { provide: ErrorHandler, useClass: MatSnackbarErrorHandler, deps: [MatSnackBar, NgZone] },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
