export class PostRequestParams {

  constructor(
    public title: string,
    public text: string,
    public image: string,
    public category: number,
    public postId?: number,
  ) {
  }

}
