import { User } from '../shared/interfaces/user';

export class ToggleSidebar {
  static readonly type = '[UserState] Toggle sidebar';
}

export class SetLangID {
  static readonly type = '[UserState] Set Lang id';

  constructor(public langID: number) {}
}

export class SetLoggedIn {
  static readonly type = '[UserState] Set Logged in';

  constructor(public loggedIn: boolean) {}
}

export class SetLoading {
  static readonly type = '[UserState] Set loading';

  constructor(public loading: boolean) {}
}

export class SetToken {
  static readonly type = '[UserState] Set token';

  constructor(public token: string) {}
}

export class SetUser {
  static readonly type = '[UserState] Set user';

  constructor(public user: User) {}
}

export class Logout {
  static readonly type = '[UserState] Logout';
}

export class LoginUser {
  static readonly type = '[UserState] Login';

  constructor(public email: string, public password: string) {}
}
