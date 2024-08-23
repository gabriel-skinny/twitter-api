import { BaseTweet } from '../../entities/baseTweet';
import { Post } from '../../entities/Post';
import { Share } from '../../entities/Share';
import { IGetBaseTweet } from '../../use-cases/base/get-by-id';

export const makeMockReturnBaseTweet = (
  tweet: Post | Share | Comment,
): IGetBaseTweet => {
  return {
    tweet: tweet as BaseTweet,
    likeNumber: 0,
    shareNumber: 0,
    commentNumber: 0,
  };
};
