import {Component, OnDestroy, OnInit} from '@angular/core';
import {DefaultConfig} from '../../default-config';
import {APP_ROUTES} from '../../app.routing.module';
import {Router} from '@angular/router';
import {ConfigService} from '../../services/configService';
import {Subscription} from 'rxjs';


@Component({
  selector: 'app-menu-sidebar',
  templateUrl: './menu-sidebar.component.html',
  styleUrls: ['./menu-sidebar.component.css']
})
export class MenuSidebarComponent implements OnInit, OnDestroy {
  public isHovering = false;
  public isSidebarOpen: boolean;
  public primaryColor: string = DefaultConfig.primaryColor;
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private configService: ConfigService,
  ) {
  }

  get currentPage(): string {
    const route: any = this.router.config.find((conf: any) => conf.urlPath === this.router.url);
    if (!route || !route.name) {
      return '';
    }
    return route.name;
  }

  get menu(): any[] {
    return APP_ROUTES;
  }

  public ngOnInit(): void {
    this.subscriptions.push(this.configService.getIsSidebarOpen()
      .subscribe((isSidebarOpen: boolean) => this.isSidebarOpen = isSidebarOpen));
  }

  public ngOnDestroy(): void {
    this.subscriptions.map((sub: Subscription) => sub.unsubscribe());
  }
}
