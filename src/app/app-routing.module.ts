import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BrowseSuggestionsComponent } from './suggestion/browse-suggestions/browse-suggestions.component';
import { CreateEditSuggestionComponent } from './suggestion/create-edit-suggestion/create-edit-suggestion.component';

const routes: Routes = [
  { path: '', component: BrowseSuggestionsComponent },
  { path: 'new-suggestion', component: CreateEditSuggestionComponent },
  { path: 'suggestion/:suggestionId', component: CreateEditSuggestionComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
