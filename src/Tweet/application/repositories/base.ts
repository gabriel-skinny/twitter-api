import { BaseTweet, TweetTypesEnum } from '../entities/baseTweet';

interface IFindManyPagination {
  skip?: number;
  limit?: number;
  order?: string;
  orderBy?: { id?: boolean; createdAt?: boolean };
}

export default abstract class AbstractBaseTweetRepository<T = BaseTweet> {
  abstract save(data: T): Promise<void>;
  abstract existsById(id: string): Promise<boolean>;
  abstract findById(id: string): Promise<T | null>;
  abstract deleteById(id: string): Promise<void>;
  abstract updateById(data: { id: string; data: Partial<T> }): Promise<void>;
  abstract findByUserId(userId: string): Promise<T | null>;
  abstract findManyByParentId(
    data: { parentId: string } & IFindManyPagination,
  ): Promise<T[]>;
  abstract findManyByUserId(
    data: {
      userId: string;
    } & IFindManyPagination,
  ): Promise<T[] | null>;
  abstract countByParentIdAndType(data: {
    parentId: string;
    tweetType: TweetTypesEnum;
  }): Promise<number>;
}
