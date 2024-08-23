import { TweetTypesEnum } from '../../entities/baseTweet';
import { Post } from '../../entities/Post';
import { Share } from '../../entities/Share';
import AbstractBaseTweetRepository from '../../repositories/base';
import AbstractShareRepository from '../../repositories/share';
import { GetTweetBaseByIdUseCase } from '../base/get-by-id';

interface IGetShareByUserIdParams {
  userId: string;
  page?: number;
  perPage?: number;
  order?: 'Desc' | 'Asc';
  orderBy?: { id?: boolean; createdAt?: boolean };
}

interface IGetShareByUserIdReturn {
  tweetShared: {
    tweet: Post | Share | Comment | null;
    likeNumber: number;
    shareNumber: number;
    commentNumber: number;
  };
  share: Share;
  likeNumber: number;
  shareNumber: number;
  commentNumber: number;
}

export class GetShareByUserId {
  constructor(
    private readonly shareRepository: AbstractShareRepository,
    private readonly baseTweetRepository: AbstractBaseTweetRepository,
    private readonly getTweetBaseByIdUseCase: GetTweetBaseByIdUseCase,
  ) {}

  async execute({
    userId,
    page,
    perPage,
    orderBy,
    order,
  }: IGetShareByUserIdParams): Promise<IGetShareByUserIdReturn[]> {
    const shares = await this.shareRepository.findManyByUserId({
      userId,
      limit: perPage,
      skip: page * perPage - perPage,
      order,
      orderBy,
    });

    const returnFormat: IGetShareByUserIdReturn[] = [];

    for (const share of shares) {
      const tweetShared = await this.getTweetBaseByIdUseCase.execute(
        share.creatorReferenceTweetId,
      );

      const commentNumber =
        await this.baseTweetRepository.countByParentIdAndType({
          parentId: share.id,
          tweetType: TweetTypesEnum.COMMENT,
        });

      const shareNumber = await this.baseTweetRepository.countByParentIdAndType(
        {
          parentId: share.id,
          tweetType: TweetTypesEnum.SHARE,
        },
      );
      const likeNumber = Object.keys(share.likes).length;

      returnFormat.push({
        share,
        commentNumber,
        likeNumber,
        shareNumber,
        tweetShared,
      });
    }

    return returnFormat;
  }
}
