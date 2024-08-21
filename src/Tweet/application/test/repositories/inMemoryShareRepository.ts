import { TweetTypesEnum } from '../../entities/baseTweet';
import { Share } from '../../entities/Share';
import AbstractShareRepository from '../../repositories/share';
import { InMemoryBaseTweetRepository } from './inMemoryBaseTweetRepository';

export class InMemoryShareRepository
  extends InMemoryBaseTweetRepository<Share>
  implements AbstractShareRepository
{
  constructor() {
    super(TweetTypesEnum.SHARE);
  }
  async existsByUserIdAndParentId(data: {
    userId: string;
    parentId: string;
  }): Promise<Share | null> {
    return this.baseTweetDatabase.find(
      (tweet) =>
        tweet.type == TweetTypesEnum.SHARE &&
        tweet.userId == data.userId &&
        tweet.parentId == data.parentId,
    );
  }
}
