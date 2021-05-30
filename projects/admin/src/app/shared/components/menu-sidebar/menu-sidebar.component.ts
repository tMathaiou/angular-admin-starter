import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { DefaultConfig } from '../../../default-config';
import { Select } from '@ngxs/store';
import { AppState } from '../../../state/app.state';
import { routes } from '../../../app-routing.module';
import { RouterExtended } from '../../interfaces/router-extended';
import { filter, takeUntil } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'angular-admin-menu-sidebar',
  templateUrl: './menu-sidebar.component.html',
  styleUrls: ['./menu-sidebar.component.css']
})
export class MenuSidebarComponent implements OnInit, OnDestroy {
  @Select(AppState.isSidebarOpen)
  public readonly isSidebarOpen$: Observable<boolean>;
  public readonly primaryColor: string = DefaultConfig.primaryColor;
  public isHovering = false;
  public menu: RouterExtended[] = routes;
  public currentPage = '';
  public isSmallScreen = false;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private router: Router,
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
      .subscribe(() => {
        const route = this.router.config.find(
          (conf: RouterExtended) => conf.urlPath === this.router.url
        ) as RouterExtended;

        this.currentPage = !route?.name ? '' : route.name;
      });
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
