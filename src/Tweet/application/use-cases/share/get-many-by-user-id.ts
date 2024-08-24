import { Share } from '../../entities/Share';
import { IPagination } from '../../interfaces/pagination';
import AbstractShareRepository from '../../repositories/share';
import {
  AbstractGetTweetBaseByIdUseCase,
  IGetBaseTweet,
} from '../base/get-by-id';

interface IGetShareByUserIdParams {
  userId: string;
}

interface IGetShareByUserIdReturn {
  tweetShared: IGetBaseTweet;
  share: Share;
  likeNumber: number;
  shareNumber: number;
  commentNumber: number;
}

export class GetSharesByUserId {
  constructor(
    private readonly shareRepository: AbstractShareRepository,
    private readonly getTweetBaseByIdUseCase: AbstractGetTweetBaseByIdUseCase,
  ) {}

  async execute({
    userId,
    page,
    perPage,
    orderBy,
    order,
  }: IGetShareByUserIdParams & IPagination): Promise<
    IGetShareByUserIdReturn[]
  > {
    const shares = await this.shareRepository.findManyByUserId({
      userId,
      limit: perPage,
      skip: page * perPage - perPage,
      order,
      orderBy,
    });

    const returnFormat: IGetShareByUserIdReturn[] = [];

    for (const share of shares) {
      const tweetSharedInfo = await this.getTweetBaseByIdUseCase.execute(
        share.creatorReferenceTweetId,
      );

      const shareInfo = await this.getTweetBaseByIdUseCase.execute(share.id);

      returnFormat.push({
        share: share,
        commentNumber: shareInfo.commentNumber,
        likeNumber: shareInfo.likeNumber,
        shareNumber: shareInfo.shareNumber,
        tweetShared: tweetSharedInfo,
      });
    }

    return returnFormat;
  }
}
