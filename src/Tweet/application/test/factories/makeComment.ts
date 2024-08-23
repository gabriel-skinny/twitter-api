import { TweetTypesEnum } from '../../entities/baseTweet';
import { Comment } from '../../entities/Comment';

export const makeComment = (params?: Partial<Comment>) => {
  return new Comment({
    content: 'Teste',
    userId: 'id',
    creatorReferenceTweetId: 'referenceTweetId',
    parentId: 'parentId',
    parentType: TweetTypesEnum.COMMENT,
    ...params,
  });
};
