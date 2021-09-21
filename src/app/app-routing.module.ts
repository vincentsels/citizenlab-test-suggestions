import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BrowseMailsComponent } from './mail/browse-mails/browse-mails.component';
import { CreateEditMailComponent } from './mail/create-edit-mail/create-edit-mail.component';

const routes: Routes = [
  { path: '', component: BrowseMailsComponent },
  { path: 'new-mail', component: CreateEditMailComponent },
  { path: 'mail/:mailId', component: CreateEditMailComponent },
  // { path: 'device/:deviceId', component: DeviceDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
