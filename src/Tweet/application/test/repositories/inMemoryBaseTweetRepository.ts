import { BaseTweet, TweetTypesEnum } from '../../entities/baseTweet';
import AbstractBaseTweetRepository, {
  IFindManyPagination,
} from '../../repositories/base';

export class InMemoryBaseTweetRepository<T extends BaseTweet>
  implements AbstractBaseTweetRepository
{
  public baseTweetDatabase: T[] = [];
  private _type?: TweetTypesEnum;

  constructor(type?: TweetTypesEnum) {
    this._type = type;
  }

  async save(data: T): Promise<void> {
    this.baseTweetDatabase.push(data);
  }

  async existsById(id: string): Promise<boolean> {
    return !!this.baseTweetDatabase.find((t) => t.id == id);
  }

  async findById(id: string): Promise<T | null> {
    return this.baseTweetDatabase.find((t) => t.id == id);
  }

  async deleteById(id: string): Promise<void> {
    this.baseTweetDatabase = this.baseTweetDatabase.filter((t) => t.id !== id);
  }

  async updateById(data: { id: string; data: Partial<T> }): Promise<void> {
    const foundIndex = this.baseTweetDatabase.findIndex((t) => t.id == data.id);

    this.baseTweetDatabase[foundIndex] = Object.assign(
      this.baseTweetDatabase[foundIndex],
      data.data,
    );
  }

  async findByUserId(userId: string): Promise<T | null> {
    return this.baseTweetDatabase.find((tweet) => tweet.userId == userId);
  }

  async findManyByUserId(data: {
    userId: string;
    skip?: number;
    limit?: number;
    order?: string;
    orderBy?: { id?: boolean; createdAt?: boolean };
  }): Promise<T[] | null> {
    return this.baseTweetDatabase.filter(
      (tweet) => tweet.userId == data.userId && tweet.type == this._type,
    );
  }

  async countByParentIdAndType(data: {
    parentId: string;
    tweetType: TweetTypesEnum;
  }): Promise<number> {
    return this.baseTweetDatabase.filter(
      (tweet) =>
        tweet.parentId == data.parentId && tweet.type == data.tweetType,
    ).length;
  }

  async findManyByParentId(
    data: { parentId: string } & IFindManyPagination,
  ): Promise<BaseTweet[]> {
    return this.baseTweetDatabase.filter(
      (tweet) => tweet.parentId == data.parentId,
    );
  }

  async findManyTweetInfoByUserIdAndTypes(
    data: {
      userId: string;
      tweetTypes: TweetTypesEnum[];
    } & IFindManyPagination,
  ): Promise<
    (BaseTweet & {
      shareNumber: number;
      commentNumber: number;
      wasSharedByUser: boolean;
      parentTweetInfo?: BaseTweet & {
        commentNumber: number;
        shareNumber: number;
        wasSharedByUser: boolean;
      };
    })[]
  > {
    const foundedTweets = this.baseTweetDatabase.filter(
      (tweet) =>
        tweet.userId == data.userId && data.tweetTypes.includes(tweet.type),
    );

    let formatReturn = [];
    for (const tweet of foundedTweets) {
      /*   const shareNumber = this.baseTweetDatabase.filter(
        (share) =>
          share.parentId == tweet.id && share.type == TweetTypesEnum.SHARE,
      ).length;
      const commentNumber = this.baseTweetDatabase.filter(
        (comment) =>
          comment.parentId == tweet.id &&
          comment.type == TweetTypesEnum.COMMENT,
      ).length;
      const wasSharedByUser = this.baseTweetDatabase.filter(
        (share) =>
          share.userId == data.userId &&
          share.parentId == tweet.id &&
          share.type == TweetTypesEnum.SHARE,
      ); */

      const parentTweet = this.baseTweetDatabase.find(
        (parent) => parent.id == tweet.parentId,
      );
      let parentTweetInfo = null;
      if (parentTweet) {
        parentTweetInfo = Object.assign(parentTweet, {
          commentNumber: 0,
          shareNumber: 0,
          wasSharedByUser: false,
        });
      }

      formatReturn.push(
        Object.assign(tweet, {
          shareNumber: 0,
          commentNumber: 0,
          wasSharedByUser: false,
          parentTweetInfo,
        }),
      );
    }

    return formatReturn;
  }
}
