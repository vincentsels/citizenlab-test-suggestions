import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DateAdapter } from '@angular/material/core';
import { BehaviorSubject } from 'rxjs';

export const LOCAL_STORAGE_KEY_LANGUAGE = 'language';

@Injectable()
export class LanguageService {
  constructor(private translate: TranslateService, private adapter: DateAdapter<any>) {
    this.language.next(localStorage.getItem(LOCAL_STORAGE_KEY_LANGUAGE));
  }

  language = new  BehaviorSubject<string>(localStorage.getItem(LOCAL_STORAGE_KEY_LANGUAGE) || 'en');

  setLanguage(inputLang: string) {
    const lang = inputLang.toLowerCase();
    this.language.next(lang);
    localStorage.setItem(LOCAL_STORAGE_KEY_LANGUAGE, lang);
    this.translate.use(lang);
    this.adapter.setLocale(lang + '-BE');
  }
}
