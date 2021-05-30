import { Route } from '@angular/router';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

export interface RouterExtended extends Route {
  name: string;
  urlPath: string;
  icon: IconProp;
  menu: boolean;
}
