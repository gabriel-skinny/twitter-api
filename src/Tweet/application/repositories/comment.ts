import { TweetTypesEnum } from '../entities/baseTweet';
import { Comment } from '../entities/Comment';
import AbstractBaseTweetRepository from './base';

export default abstract class AbstractCommentRepository extends AbstractBaseTweetRepository<Comment> {
  abstract existsByUserIdAndParentId(data: {
    userId: string;
    parentId: string;
    parentType: TweetTypesEnum;
  }): Promise<Comment | null>;
}
