import { randomUUID } from 'crypto';
import { Share } from './Share';
import { Comment } from './Comment';
import NotFoundCustomError from 'src/Shared/errors/notFound';

export enum TweetTypesEnum {
  POST = 'post',
  SHARE = 'share',
  COMMENT = 'comment',
}

export type IChildProps = Omit<IPropsBaseTweet, 'type'>;
type LikeType = { [userId: string]: boolean };

export interface IPropsBaseTweet {
  id?: string;
  userId: string;
  content: string;
  type: TweetTypesEnum;
  active?: boolean;
  mediaUrl?: string;
  share?: Share[];
  likes?: LikeType;
  commentary?: Comment[];
  creatorReferenceTweetId?: string;
  parentId?: string;
  parentType?: TweetTypesEnum;
  createdAt?: Date;
}

type IRawValues = Omit<
  IPropsBaseTweet,
  'id' | 'createdAt' | 'active' | 'likes'
>;

export class BaseTweet {
  private _id: string;
  private _createdAt: Date;
  private _active: boolean;
  private _likes: LikeType;
  private _rawValues: IRawValues;

  constructor(props: IPropsBaseTweet) {
    this._id = props.id || randomUUID();
    this._createdAt = props.createdAt || new Date();
    this._active = props.active || true;
    this._likes = props.likes || {};

    this._rawValues = { ...props };
  }

  public get id() {
    return this._id;
  }
  public get userId() {
    return this._rawValues.userId;
  }

  public get content() {
    return this._rawValues.content;
  }

  public get type() {
    return this._rawValues.type;
  }

  public get mediaUrl() {
    return this._rawValues.mediaUrl;
  }

  public get share() {
    return this._rawValues.share;
  }

  public get likes() {
    return this._likes;
  }

  public like(requesterUserId: string) {
    if (this._likes[requesterUserId]) throw new Error('Already liked');
    else this._likes[requesterUserId] = true;
  }

  public deslike(requesterUserId: string) {
    if (!this._likes[requesterUserId])
      throw new NotFoundCustomError('Like not found');

    this._likes[requesterUserId] = false;
  }

  public get commentary() {
    return this._rawValues.commentary;
  }

  public get active() {
    return this._active;
  }

  public get creatorReferenceTweetId() {
    return this._rawValues.creatorReferenceTweetId;
  }

  public get parentId() {
    return this._rawValues.parentId;
  }

  public get parentType() {
    return this._rawValues.parentType;
  }

  public get createdAt() {
    return this._createdAt;
  }
}
