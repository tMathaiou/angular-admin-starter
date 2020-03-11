import {Action, StateContext} from '@ngxs/store';
import {SetLangIdAction, SetLoadingAction, SetTokenAction, ToggleSidebarAction} from './actions';
import {AppStateModel} from './state';

export class Reducers {
  @Action(ToggleSidebarAction)
  toggleSidebar(ctx: StateContext<AppStateModel>) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      isSidebarOpen: !state.isSidebarOpen
    });
  }

  @Action(SetLangIdAction)
  setLangId(ctx: StateContext<AppStateModel>, payload: SetLangIdAction) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      langID: payload.langId
    });
  }

  @Action(SetLoadingAction)
  setLoading(ctx: StateContext<AppStateModel>, payload: SetLoadingAction) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      loading: payload.loading
    });
  }

  @Action(SetTokenAction)
  setToken(ctx: StateContext<AppStateModel>, payload: SetTokenAction) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      loggedIn: !!(payload.token),
      token: payload.token,
    });
  }
}
