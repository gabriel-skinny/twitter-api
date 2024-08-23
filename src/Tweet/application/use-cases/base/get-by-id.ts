import { BaseTweet, TweetTypesEnum } from '../../entities/baseTweet';
import AbstractBaseTweetRepository from '../../repositories/base';
import { AbstractCacheService } from '../../services/cacheService';

export interface IGetBaseTweet {
  shareNumber: number;
  likeNumber: number;
  commentNumber: number;
  tweet: BaseTweet;
}

export abstract class AbstractGetTweetBaseByIdUseCase {
  abstract execute(id: string): Promise<IGetBaseTweet | null>;
}

export class GetTweetBaseByIdUseCase
  implements AbstractGetTweetBaseByIdUseCase
{
  constructor(
    private readonly baseTweetRepository: AbstractBaseTweetRepository,
    private readonly cacheService: AbstractCacheService,
  ) {}

  async execute(id: string): Promise<IGetBaseTweet | null> {
    const cachedTweet = (await this.cacheService.get(id)) as IGetBaseTweet;
    if (cachedTweet) return cachedTweet;

    const tweet = await this.baseTweetRepository.findById(id);

    if (!tweet) return null;

    const commentNumber = await this.baseTweetRepository.countByParentIdAndType(
      {
        parentId: tweet.id,
        tweetType: TweetTypesEnum.COMMENT,
      },
    );

    const shareNumber = await this.baseTweetRepository.countByParentIdAndType({
      parentId: tweet.id,
      tweetType: TweetTypesEnum.SHARE,
    });
    const likeNumber = Object.keys(tweet.likes).length;

    const returnObject = { shareNumber, likeNumber, commentNumber, tweet };

    await this.cacheService.set({ key: id, value: returnObject });

    return returnObject;
  }
}
