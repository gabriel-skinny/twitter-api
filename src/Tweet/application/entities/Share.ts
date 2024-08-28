import { BaseTweet, IChildProps, TweetTypesEnum } from './baseTweet';

type IPropsShare = IChildProps & {
  creatorReferenceTweetId: string;
  parentId: string;
  parentType: TweetTypesEnum;
};

export class Share extends BaseTweet {
  public creatorReferenceTweetId: string;
  public parentId: string;
  public parentType: TweetTypesEnum;

  constructor(props: IPropsShare) {
    super({ ...props, type: TweetTypesEnum.SHARE });
    this.creatorReferenceTweetId = props.creatorReferenceTweetId;
    this.parentId = props.parentId;
    this.parentType = props.parentType;
  }
}
