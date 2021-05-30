import { User } from '../../shared/interfaces/user';
import { UserFilters } from '../../shared/interfaces/userFilters';

export class SetPage {
  static readonly type = '[UserState] Set page';

  constructor(public page: number) {}
}

export class SetSize {
  static readonly type = '[UserState] Set size';

  constructor(public size: number) {}
}

export class SetFilters {
  static readonly type = '[UserState] Set filters';

  constructor(public filters: UserFilters) {}
}

export class SetTotalElements {
  static readonly type = '[UserState] Set total elements';

  constructor(public totalElements: number) {}
}

export class FetchUsers {
  static readonly type = '[UserState] Fetch Users';
}

export class FetchUser {
  static readonly type = '[UserState] Fetch User';

  constructor(public id: number) {}
}

export class SetUser {
  static readonly type = '[UserState] Set User';

  constructor(public user: User) {}
}

export class SaveUser {
  static readonly type = '[UserState] Save User';

  constructor(public user: User) {}
}

export class UpdateUser {
  static readonly type = '[UserState] Update User';

  constructor(public user: User) {}
}

export class DeleteUser {
  static readonly type = '[UserState] Delete User';

  constructor(public id: number) {}
}
