export class ToggleSidebarAction {
  static readonly type = '[AppState] Toggle SideBar';
  constructor() { }
}

export class SetLangIdAction {
  static readonly type = '[AppState] Set Language id';
  constructor(public langId: number) { }
}

export class SetLoadingAction {
  static readonly type = '[AppState] Set Loading';
  constructor(public loading: boolean) { }
}

export class SetTokenAction {
  static readonly type = '[AppState] Set Token Action';
  constructor(public token: string) { }
}
