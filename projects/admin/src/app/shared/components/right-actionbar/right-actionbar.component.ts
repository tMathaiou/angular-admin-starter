import { Component, OnDestroy, OnInit } from '@angular/core';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { Observable, Subject } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { AppState } from '../../../state/app.state';
import { languages } from '../../constants/languages';
import { Logout, SetLangID } from '../../../state/app.actions';
import { takeUntil } from 'rxjs/operators';
import { Language } from '../../interfaces/language';

@Component({
  selector: 'angular-admin-right-actionbar',
  templateUrl: './right-actionbar.component.html',
  styleUrls: ['./right-actionbar.component.css']
})
export class RightActionbarComponent implements OnInit, OnDestroy {
  @Select(AppState.langID) public readonly langID$: Observable<number>;
  public languages = languages;
  public faSignOutAlt: IconDefinition = faSignOutAlt;
  public selectedLanguage: Language = null;
  private unsubscribe$ = new Subject<void>();

  constructor(private store: Store) {}

  public ngOnInit(): void {
    this.langID$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (id) =>
          (this.selectedLanguage = this.languages.find(
            (lang) => lang.id === id
          ))
      );
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public setSelectedLanguage({ value }: { value: number }): void {
    this.store.dispatch(new SetLangID(value));
  }

  public logout(): void {
    this.store.dispatch(new Logout());
  }
}
