import {Component, OnDestroy, OnInit} from '@angular/core';
import {faSignOutAlt} from '@fortawesome/free-solid-svg-icons';
import {IconDefinition} from '@fortawesome/fontawesome-common-types';
import {combineLatest} from 'rxjs';
import {ConfigService} from '../../services/configService';
import {LanguageClass} from '../../classes/language.class';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-right-actionbar',
  templateUrl: './right-actionbar.component.html',
  styleUrls: ['./right-actionbar.component.css']
})
export class RightActionbarComponent implements OnInit, OnDestroy {
  public faSignOutAlt: IconDefinition = faSignOutAlt;
  public langID: number;
  public stateLanguages: LanguageClass[] = [];
  public messages: any = {};
  private subscriptions: any;

  constructor(
    private configService: ConfigService,
    private translateService: TranslateService,
  ) {

  }

  setSelectedLanguage(lang: any) {
    const langString = (lang.value === 0) ? 'en' : 'el';
    this.translateService.use(langString);
    this.configService.setLangID(lang.value);
  }

  public ngOnInit(): void {
    this.subscriptions = combineLatest(
      this.configService.getLangID(),
      this.translateService.onLangChange,
      this.configService.getLanguages()
      ).subscribe((result: [number, LangChangeEvent, LanguageClass[]]) => {
      this.langID = result[0];
      this.messages = {
        english: result[1].translations.languages.english,
        greek: result[1].translations.languages.greek,
      };

      this.stateLanguages = result[2].map((language: LanguageClass): LanguageClass => {
        return {
          ...language,
          text: language.id === 0 ? this.messages.english : this.messages.greek,
        };
      });
    });
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.configService.setToken(null);
    this.configService.setLoggedIn(false);
  }

}
