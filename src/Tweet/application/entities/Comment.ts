import { BaseTweet, IChildProps, TweetTypesEnum } from './baseTweet';

type IPropsComment = IChildProps & {
  creatorReferenceTweetId: string;
  parentId: string;
  parentType: TweetTypesEnum;
};

export class Comment extends BaseTweet {
  private _creatorReferenceTweetId: string;
  private _parentId: string;
  private _parentType: TweetTypesEnum;

  constructor(props: IPropsComment) {
    super({ ...props, type: TweetTypesEnum.COMMENT });

    this._creatorReferenceTweetId = props.creatorReferenceTweetId;
    this._parentId = props.parentId;
    this._parentType = props.parentType;
  }

  public get creatorReferenceTweetId() {
    return this._creatorReferenceTweetId;
  }

  public get parentId() {
    return this._parentId;
  }

  public get parentType() {
    return this._parentType;
  }
}
