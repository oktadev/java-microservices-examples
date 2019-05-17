import { Moment } from 'moment';
import { IBlog } from 'app/shared/model/blog/blog.model';
import { ITag } from 'app/shared/model/blog/tag.model';

export interface IPost {
  id?: number;
  title?: string;
  content?: any;
  date?: Moment;
  blog?: IBlog;
  tags?: ITag[];
}

export class Post implements IPost {
  constructor(
    public id?: number,
    public title?: string,
    public content?: any,
    public date?: Moment,
    public blog?: IBlog,
    public tags?: ITag[]
  ) {}
}
