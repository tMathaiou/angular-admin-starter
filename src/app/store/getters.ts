import {createSelector} from '@ngxs/store';

export class Getters<T> {
  constructor(keys: T, cState) {
    Object.getOwnPropertyNames(keys).forEach((key: string) => this[`sel${key}`] = () => createSelector([cState], (state: T) => state[key]));
  }
}

