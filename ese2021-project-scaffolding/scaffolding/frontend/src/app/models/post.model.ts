export class Post {

  constructor(
    public postId: number,
    public feedId: number, // to indicate that it belongs to a certain feed
    public title: string,
    public text: string,
    public image: string, // string containing the url to the image
    public upvote: number,
    public downvote: number,
    public score: number,
    public category: string,
    public CreationDate: string,
    public CreationUser: number, // id of the user who created the post
    public CreationUserName: string
    // public lastUpdate: string,
    // public updateBy: number,
  ) {}
}
