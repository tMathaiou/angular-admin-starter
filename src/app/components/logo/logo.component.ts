import {Component, OnDestroy, OnInit} from '@angular/core';
import {DefaultConfig} from '../../default-config';
import {Subscription} from 'rxjs';
import {ConfigService} from '../../services/configService';


@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.css']
})
export class LogoComponent implements OnInit, OnDestroy {
  public primaryColor: string = DefaultConfig.primaryColor;
  public isSidebarOpen: boolean;
  private subscriptions: Subscription[] = [];

  constructor(
    private configService: ConfigService,
  ) {
  }

  public ngOnInit(): void {
    this.subscriptions.push(this.configService.getIsSidebarOpen()
      .subscribe((isSidebarOpen: boolean) => this.isSidebarOpen = isSidebarOpen));
  }

  public ngOnDestroy(): void {
    this.subscriptions.map((sub: Subscription) => sub.unsubscribe());
  }
}
