import {
  BaseTweet,
  IChildProps,
  IPropsBaseTweet,
  TweetTypesEnum,
} from './baseTweet';

type IPropsShare = IChildProps & {
  tweetId: string;
  parentId: string;
  parentType: TweetTypesEnum;
};

export class Share extends BaseTweet {
  private _tweetId: string;
  private _parentId: string;
  private _parentType: string;

  constructor(props: IPropsShare) {
    super({ ...props, type: TweetTypesEnum.SHARE });
    this._tweetId = props.tweetId;
    this._parentId = props.parentId;
    this._parentType = props.parentType;
  }

  public get tweetId() {
    return this._tweetId;
  }

  public get parentId() {
    return this._parentId;
  }

  public get parentType() {
    return this._parentType;
  }
}
