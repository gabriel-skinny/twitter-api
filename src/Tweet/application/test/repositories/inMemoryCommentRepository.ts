import { TweetTypesEnum } from '../../entities/baseTweet';
import { Comment } from '../../entities/Comment';
import AbstractCommentRepository from '../../repositories/comment';
import { InMemoryBaseTweetRepository } from './inMemoryBaseTweetRepository';

export class InMemoryCommentRepository
  extends InMemoryBaseTweetRepository<Comment>
  implements AbstractCommentRepository
{
  constructor() {
    super(TweetTypesEnum.COMMENT);
  }
  async existsByUserIdAndParentId(data: {
    userId: string;
    parentId: string;
  }): Promise<Comment | null> {
    return this.baseTweetDatabase.find(
      (tweet) =>
        tweet.type == TweetTypesEnum.SHARE &&
        tweet.userId == data.userId &&
        tweet.parentId == data.parentId,
    );
  }
}
