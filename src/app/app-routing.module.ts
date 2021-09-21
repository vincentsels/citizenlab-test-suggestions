import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BrowseSuggestionsComponent } from './suggestion/browse-suggestions/browse-suggestions.component';
import { CreateEditSuggestionComponent } from './suggestion/create-edit-suggestion/create-edit-suggestion.component';
import { SuggestionDetailComponent } from './suggestion/suggestion-detail/suggestion-detail.component';

const routes: Routes = [
  { path: '', component: BrowseSuggestionsComponent },
  { path: 'new-suggestion', component: CreateEditSuggestionComponent },
  { path: 'edit-suggestion/:suggestionId', component: CreateEditSuggestionComponent },
  { path: 'suggestion/:suggestionId', component: SuggestionDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
