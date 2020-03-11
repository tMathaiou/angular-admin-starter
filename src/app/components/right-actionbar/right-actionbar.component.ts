import {Component, OnDestroy, OnInit} from '@angular/core';
import {faSignOutAlt} from '@fortawesome/free-solid-svg-icons';
import {IconDefinition} from '@fortawesome/fontawesome-common-types';
import {combineLatest, Observable} from 'rxjs';
import {LanguageClass} from '../../classes/language.class';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';
import {Select, Store} from '@ngxs/store';
import {AppState} from '../../store/state';
import {SetLangIdAction, SetTokenAction} from '../../store/actions';

@Component({
  selector: 'app-right-actionbar',
  templateUrl: './right-actionbar.component.html',
  styleUrls: ['./right-actionbar.component.css']
})
export class RightActionbarComponent implements OnInit, OnDestroy {
  public faSignOutAlt: IconDefinition = faSignOutAlt;
  @Select((AppState as any).langID()) langID$: Observable<number>;
  @Select((AppState as any).languages()) languages$: Observable<any[]>;
  public stateLanguages: LanguageClass[] = [];
  public langID: number;
  public messages: any = {};
  private subscriptions: any;

  constructor(
    private store: Store,
    private translateService: TranslateService,
  ) {

  }

  public setSelectedLanguage(lang: any): void {
    const langString = (lang.value === 0) ? 'en' : 'el';
    this.store.dispatch(new SetLangIdAction(lang.value));
    this.translateService.use(langString);
  }

  public ngOnInit(): void {
    this.subscriptions = combineLatest(
      this.langID$,
      this.translateService.onLangChange,
      this.languages$
    ).subscribe((result: [number, LangChangeEvent, LanguageClass[]]) => {
      console.log(result);
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
    this.store.dispatch(new SetTokenAction(null));
  }

}
