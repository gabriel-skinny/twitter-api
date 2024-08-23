import { BaseTweet, TweetTypesEnum } from '../../entities/baseTweet';
import AbstractBaseTweetRepository from '../../repositories/base';

interface IGetPostByUserIdReturn {
  shareNumber: number;
  likeNumber: number;
  commentNumber: number;
  tweet: BaseTweet;
}

export class GetTweetBaseByIdUseCase {
  constructor(
    private readonly baseTweetRepository: AbstractBaseTweetRepository,
  ) {}

  async execute(id: string): Promise<IGetPostByUserIdReturn> {
    const tweet = await this.baseTweetRepository.findById(id);

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

    return { shareNumber, likeNumber, commentNumber, tweet };
  }
}
