import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { AppState } from '../../../state/app.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'angular-admin-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent {
  @Select(AppState.loading) public readonly loading$: Observable<boolean>;

  public spinnerDelay1 = { animationDelay: '0.1s' };
  public spinnerDelay2 = { animationDelay: '0.2s' };
  public spinnerDelay3 = { animationDelay: '0.3s' };
  public spinnerDelay4 = { animationDelay: '0.4s' };
  public spinnerDelay5 = { animationDelay: '0.5s' };
}
