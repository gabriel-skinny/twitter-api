import { BaseTweet, IChildProps, TweetTypesEnum } from './baseTweet';

type IPropsShare = IChildProps & {
  creatorReferenceTweetId: string;
  parentId: string;
  parentType: TweetTypesEnum;
};

export class Share extends BaseTweet {
  private _creatorReferenceTweetId: string;
  private _parentId: string;
  private _parentType: TweetTypesEnum;

  constructor(props: IPropsShare) {
    super({ ...props, type: TweetTypesEnum.SHARE });
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
