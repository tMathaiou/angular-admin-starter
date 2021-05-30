import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { delay, filter, takeUntil } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { ToggleSidebar } from '../../../state/app.actions';
import { RouterExtended } from '../../interfaces/router-extended';

@Component({
  selector: 'angular-admin-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit, OnDestroy {
  public currentPage = '';
  private unsubscribe$ = new Subject<void>();

  constructor(
    private router: Router,
    private translateService: TranslateService,
    private store: Store
  ) {}

  public ngOnInit(): void {
    this.router.events
      .pipe(
        takeUntil(this.unsubscribe$),
        filter((e) => e instanceof NavigationEnd),
        delay(0)
      )
      .subscribe(() => this.setCurrentPage());

    this.translateService.onLangChange
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.setCurrentPage());
  }

  public setCurrentPage(): void {
    const route = this.router.config.find(
      (conf: RouterExtended) => conf.urlPath === this.router.url
    ) as RouterExtended;

    this.currentPage = !route?.name
      ? ''
      : this.translateService.instant(`menu.${route.name}`);
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public toggleSidebar(): void {
    this.store.dispatch(new ToggleSidebar());
  }
}
