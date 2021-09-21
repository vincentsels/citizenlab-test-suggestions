import { Component } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MatSelectChange } from '@angular/material/select';
import { TranslateService } from '@ngx-translate/core';

import { UserService } from '../../user/user.service';
import { LanguageService } from '../../common/language.service';

@Component({
  selector: 'app-navbar-profile-menu',
  templateUrl: './navbar-profile-menu.html',
  styleUrls: ['./navbar-profile-menu.scss'],
})
export class NavBarProfileMenuComponent {
  version = '0.1';

  languages = ['en', 'fr', 'nl'];
  language = null;
  userName = null;

  constructor(private userService: UserService, private languageService: LanguageService) {
    this.language = languageService.language.value;
    this.userName = userService.getUserName();
  }

  languageChanged(item: MatSelectChange) {
    const lang = item.value;
    this.language = lang;
    this.languageService.setLanguage(lang);
  }
}
