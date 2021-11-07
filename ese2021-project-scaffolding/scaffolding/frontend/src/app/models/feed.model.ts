import { Post } from './post.model';

export class Feed {

  constructor(
    public feedId: number,
    public name: string,
    public posts: Post[]
  ) {}
}
