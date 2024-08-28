import { BaseTweet, IChildProps, TweetTypesEnum } from './baseTweet';

type IPropsComment = IChildProps & {
  creatorReferenceTweetId: string;
  parentId: string;
  parentType: TweetTypesEnum;
};

export class Comment extends BaseTweet {
  creatorReferenceTweetId: string;
  parentId: string;
  parentType: TweetTypesEnum;

  constructor(props: IPropsComment) {
    super({ ...props, type: TweetTypesEnum.COMMENT });

    this.creatorReferenceTweetId = props.creatorReferenceTweetId;
    this.parentId = props.parentId;
    this.parentType = props.parentType;
  }
}
