import {createSelector, State} from '@ngxs/store';
import {DefaultConfig} from '../default-config';
import {Reducers} from './reducers';

function Getters<T>(): any {
  return (target) =>
    Object.getOwnPropertyNames(new AppStateModel())
      .forEach((key: string) => target[key] = () => createSelector([target], (state: T) => state[key]));
}

export class AppStateModel {
  public isSidebarOpen: boolean = undefined;
  public langID: number = undefined;
  public loggedIn: boolean = undefined;
  public loading: boolean = undefined;
  public token: string = undefined;
  public languages: {
    imageSrc: string;
    path: string;
    text: string;
    id: number;
  }[] = [];
}


@State<AppStateModel>({
  name: 'appState',
  defaults: {
    isSidebarOpen: DefaultConfig.isSidebarOpen,
    langID: 0,
    loggedIn: !!localStorage.getItem('token'),
    loading: false,
    token: '',
    languages: [{
      imageSrc: '/assets/images/260-united-kingdom.svg',
      path: 'en',
      id: 0,
      text: '',
    }, {
      imageSrc: '/assets/images/170-greece.svg',
      path: 'el',
      id: 1,
      text: '',
    }],
  }
})
@Getters<AppStateModel>()
export class AppState extends Reducers {
}
