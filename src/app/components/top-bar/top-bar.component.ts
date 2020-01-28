import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationEnd, Route, Router} from '@angular/router';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';
import {ConfigService} from '../../services/configService';
import {Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit, OnDestroy {
  public currentPage = '';
  private subscription: Subscription;

  constructor(
    private router: Router,
    private translateService: TranslateService,
    private configService: ConfigService
  ) {
  }

  public ngOnInit(): void {
    this.subscription = this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.router.events.pipe(filter((e) => e instanceof NavigationEnd))
        .subscribe(() => {
          const routes = this.printPaths('', this.router.config);
          let url = this.router.url;
          const splitUrl = url.split('/');
          if (!isNaN(splitUrl[splitUrl.length - 1] as any)) {
            splitUrl[splitUrl.length - 1] = ':id';
            url = splitUrl.join('/');
          }
          const route: any = routes.find((conf: any) => conf.path === url);
          this.currentPage = event.translations.menu[route.name];
        });
    });
  }

  printPaths(parent: string, routes: Route[], out = []) {
    const output = out;
    const getFullPath = (path?: string) => {
      if (path) {
        return parent + '/' + path;
      }

      return parent;
    };

    for (const route of routes) {
      const fullPath = getFullPath(route.path);

      output.push({
        path: parent + '/' + route.path,
        name: (route as any).name
      });

      if (route.children && route.children.length > 0) {
        this.printPaths(fullPath, route.children, out);
      }

      if (route.loadChildren && route.loadChildren.length > 0) {
        const routerConfig: any = (route as any)._loadedConfig as any;
        if (routerConfig) {
          this.printPaths(fullPath, routerConfig.routes, out);
        }
      }
    }
    return output;
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public toggleSidebar() {
    this.configService.setIsSidebarOpen();
  }

}
