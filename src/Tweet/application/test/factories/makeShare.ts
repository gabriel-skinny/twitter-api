import { TweetTypesEnum } from '../../entities/baseTweet';
import { Share } from '../../entities/Share';

export const makeShare = (params?: Partial<Share>) => {
  return new Share({
    content: 'Teste',
    userId: 'id',
    creatorReferenceTweetId: 'RandomReference',
    parentId: 'randonParentId',
    parentType: TweetTypesEnum.COMMENT,
    ...params,
  });
};
