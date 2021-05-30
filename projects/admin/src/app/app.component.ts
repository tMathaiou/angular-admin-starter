import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppState } from './state/app.state';
import { Select } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'angular-admin-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  @Select(AppState.isSidebarOpen)
  public readonly isSidebarOpen$: Observable<boolean>;
  @Select(AppState.loggedIn) public readonly loggedIn$: Observable<boolean>;
  @Select(AppState.loading) public readonly loading$: Observable<boolean>;
  public isSmallScreen = false;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private router: Router,
    private translateService: TranslateService,
    private breakpointObserver: BreakpointObserver
  ) {}

  public ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.XSmall])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => (this.isSmallScreen = result.matches));

    this.router.events
      .pipe(
        takeUntil(this.unsubscribe$),
        filter((e) => e instanceof NavigationEnd)
      )
      .subscribe((val: RouterEvent) => {
        if (val.url === '/') {
          return this.router.navigateByUrl('/view');
        }
      });
    const language = localStorage.getItem('language') || 'el';
    localStorage.setItem('language', language);
    this.translateService.use(language);
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
