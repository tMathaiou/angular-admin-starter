import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DefaultConfig } from '../../../default-config';
import { Select } from '@ngxs/store';
import { AppState } from '../../../state/app.state';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'angular-admin-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.css']
})
export class LogoComponent implements OnInit, OnDestroy {
  @Select(AppState.isSidebarOpen)
  public readonly isSidebarOpen$: Observable<boolean>;
  public primaryColor: string = DefaultConfig.primaryColor;
  public isSmallScreen = false;
  private unsubscribe$ = new Subject<void>();

  constructor(private breakpointObserver: BreakpointObserver) {}

  public ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.XSmall])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => (this.isSmallScreen = result.matches));
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
