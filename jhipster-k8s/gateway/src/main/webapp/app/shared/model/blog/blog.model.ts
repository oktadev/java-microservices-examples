import { IUser } from '@/shared/model/user.model';

export interface IBlog {
  id?: number;
  name?: string;
  handle?: string;
  user?: IUser | null;
}

export class Blog implements IBlog {
  constructor(public id?: number, public name?: string, public handle?: string, public user?: IUser | null) {}
}
