import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {AuthService} from '../../services/auth.service';
import {ToastrService} from 'ngx-toastr';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';
import {ConfigService} from '../../services/configService';
import {Router} from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  public email = '';
  public password = '';
  public msgWrongCredential = '';
  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private toaster: ToastrService,
    private translateService: TranslateService,
    private configService: ConfigService,
    private router: Router
  ) {
  }

  public async login(e: Event): Promise<any> {
    e.preventDefault();
    this.subscriptions.push(this.authService.login(this.email, this.password).subscribe((data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      this.configService.setLoggedIn(true);
      this.configService.setToken(data.token);
      this.router.navigateByUrl('/view');
    }, () => this.toaster.error(this.msgWrongCredential)));
  }

  public ngOnInit(): void {
    this.subscriptions.push(this.translateService.onLangChange
      .subscribe((event: LangChangeEvent) => this.msgWrongCredential = event.translations.commons.wrong_credentials));
  }

  public ngOnDestroy(): void {
    this.subscriptions.map(sub => sub.unsubscribe());
  }
}
