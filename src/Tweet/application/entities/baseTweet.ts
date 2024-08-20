import { randomUUID } from 'crypto';
import { Share } from './Share';
import { Comment } from './Comment';

export enum TweetTypesEnum {
  POST = 'post',
  SHARE = 'share',
  COMMENT = 'comment',
}

export type IChildProps = Omit<IPropsBaseTweet, 'type'>;

export interface IPropsBaseTweet {
  id?: string;
  userId: string;
  content: string;
  type: TweetTypesEnum;
  active?: boolean;
  mediaUrl?: string;
  share?: Share[];
  likes?: { [userId: string]: boolean };
  commentary?: Comment[];
  createdAt?: Date;
}

type IRawValues = Omit<IPropsBaseTweet, 'id' | 'createdAt' | 'active'>;

export class BaseTweet {
  private _id: string;
  private _createdAt: Date;
  private _active: boolean;
  private _rawValues: IRawValues;

  constructor(props: IPropsBaseTweet) {
    this._id = props.id || randomUUID();
    this._createdAt = props.createdAt || new Date();
    this._active = props.active || true;
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
    return this._rawValues.likes;
  }

  public like(requesterUserId: string) {
    if (this._rawValues.likes[requesterUserId])
      throw new Error('Already liked');
    else this._rawValues.likes[requesterUserId] = true;
  }

  public deslike(requesterUserId: string) {
    this._rawValues.likes[requesterUserId] = false;
  }

  public get commentary() {
    return this._rawValues.commentary;
  }

  public get active() {
    return this._active;
  }

  public get createdAt() {
    return this._createdAt;
  }
}
