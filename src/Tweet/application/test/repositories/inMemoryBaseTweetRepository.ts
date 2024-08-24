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

  findManyByParentId(
    data: { parentId: string } & IFindManyPagination,
  ): Promise<BaseTweet[]> {
    throw new Error('Method not implemented.');
  }
  findManyTweetInfoByUserIdAndTypes(
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
    throw new Error('Method not implemented.');
  }
}
