import {Component, Input} from '@angular/core';
import {DefaultConfig} from '../../default-config';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent {
  @Input() public loading = false;
  @Input() public height = '35px';
  @Input() public width = '4px';
  @Input() public margin = '2px';
  @Input() public radius = '2px';

  public color =  DefaultConfig.primaryColor;
  public spinnerStyle = {
    backgroundColor: this.color,
    height: this.height,
    width: this.width,
    margin: this.margin,
    borderRadius: this.radius,
    display: 'inline-block',
    animationName: 'v-scaleStretchDelay',
    animationDuration: '1s',
    animationIterationCount: 'infinite',
    animationTimingFunction: 'cubic-bezier(.2,.68,.18,1.08)',
    animationFillMode: 'both',
  };
  public spinnerDelay1 = {...this.spinnerStyle, animationDelay: '0.1s'};
  public spinnerDelay2 = {...this.spinnerStyle, animationDelay: '0.2s'};
  public spinnerDelay3 = {...this.spinnerStyle, animationDelay: '0.3s'};
  public spinnerDelay4 = {...this.spinnerStyle, animationDelay: '0.4s'};
  public spinnerDelay5 = {...this.spinnerStyle, animationDelay: '0.5s'};
}
