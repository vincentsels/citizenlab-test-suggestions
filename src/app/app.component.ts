import { Component } from '@angular/core';
import { LanguageService } from './common/language.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(languageService: LanguageService) {
    languageService.setLanguage('en');
  }
}
