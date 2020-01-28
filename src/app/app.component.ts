import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ConfigService} from './services/configService';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  public loggedIn: boolean;
  public isSidebarOpen: boolean;
  public loading = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private translateService: TranslateService,
    private configService: ConfigService,
  ) {
    router.events.subscribe((val: any) => {
      if (val.url === '/') {
        return this.router.navigateByUrl('/view');
      }
    });

    translateService.use(localStorage.getItem('language') || 'el');
  }

  public ngOnInit(): void {
    this.subscriptions.push(this.configService.getIsSidebarOpen()
      .subscribe((isSidebarOpen: boolean) => this.isSidebarOpen = isSidebarOpen));
    this.subscriptions.push(this.configService.getLoggedIn()
      .subscribe((loggedIn: boolean) => this.loggedIn = loggedIn));
    this.subscriptions.push(this.configService.getLoading()
      .subscribe((loading: boolean) => this.loading = loading));
  }

  public ngOnDestroy(): void {
    this.subscriptions.map((sub: Subscription) => sub.unsubscribe());
  }
}

