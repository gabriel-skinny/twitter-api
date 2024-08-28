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

export class BaseTweet {
  id: string;
  userId: string;
  content: string;
  type: TweetTypesEnum;
  active: boolean;
  mediaUrl?: string;
  share?: Share[];
  likes?: LikeType;
  commentary?: Comment[];
  creatorReferenceTweetId?: string;
  parentId?: string;
  parentType?: TweetTypesEnum;
  createdAt: Date;

  constructor(props: IPropsBaseTweet) {
    this.id = props.id || randomUUID();
    this.createdAt = props.createdAt || new Date();
    this.active = props.active || true;
    this.likes = props.likes || {};
  }

  public like(requesterUserId: string) {
    if (this.likes[requesterUserId]) throw new Error('Already liked');
    else this.likes[requesterUserId] = true;
  }

  public deslike(requesterUserId: string) {
    if (!this.likes[requesterUserId])
      throw new NotFoundCustomError('Like not found');

    this.likes[requesterUserId] = false;
  }
}
