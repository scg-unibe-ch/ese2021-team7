import { Category } from "./category";
import {VotingState} from "./voting-state";

export class Post {

  constructor(
    public postId: number,
    public title: string,
    public text: string,
    public image: string, // string containing the url to the image
    public score: number,
    public category: Category,
    public CreationUser: number, // id of the user who created the post
    public CreationUserName: string,
    public votingState: VotingState
  ) {}
}
