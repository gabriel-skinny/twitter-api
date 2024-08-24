import { TweetTypesEnum } from '../../entities/baseTweet';
import { Post } from '../../entities/Post';
import { Share } from '../../entities/Share';
import { IPagination } from '../../interfaces/pagination';
import AbstractBaseTweetRepository from '../../repositories/base';

interface IGetByUserIdAndTypeParams {
  userId: string;
  tweetTypes: TweetTypesEnum[];
}

interface TweetInfo {
  content: string;
  mediaUrl?: string;
  createdAt: Date;
  likeNumber: number;
  shareNumber: number;
  commentNumber: number;
  wasLikedByUser: boolean;
  wasSharedByUser: boolean;
}

type IGetByUserIdAndTypesReturn = TweetInfo & {
  parentPostInfoWithClient?: TweetInfo;
};

export class GetByUserIdAndTypesUseCase {
  constructor(
    private readonly baseTweetRepository: AbstractBaseTweetRepository<
      Post | Share
    >,
  ) {}

  async execute({
    userId,
    tweetTypes,
    page,
    perPage,
    order,
    orderBy,
  }: IGetByUserIdAndTypeParams & IPagination): Promise<
    IGetByUserIdAndTypesReturn[]
  > {
    const tweetsInfo =
      await this.baseTweetRepository.findManyTweetInfoByUserIdAndTypes({
        userId,
        tweetTypes,
        limit: perPage,
        skip: page * perPage - perPage,
        order,
        orderBy,
      });

    const formatReturn: IGetByUserIdAndTypesReturn[] = [];

    for (const tweetInfo of tweetsInfo) {
      const wasLikedByUser = Boolean(tweetInfo.likes[userId]);
      const likeNumber = Object.keys(tweetInfo.likes).length;

      let parentPostInfoWithClient: TweetInfo | null = null;
      if (tweetInfo.parentTweetInfo) {
        parentPostInfoWithClient = {
          content: tweetInfo.parentTweetInfo.content,
          commentNumber: tweetInfo.parentTweetInfo.commentNumber,
          likeNumber: Object.keys(tweetInfo.parentTweetInfo.likes).length,
          shareNumber: tweetInfo.parentTweetInfo.shareNumber,
          wasLikedByUser: Boolean(tweetInfo.parentTweetInfo.likes[userId]),
          wasSharedByUser: tweetInfo.parentTweetInfo.wasSharedByUser,
          mediaUrl: tweetInfo.parentTweetInfo.mediaUrl,
          createdAt: tweetInfo.createdAt,
        };
      }

      formatReturn.push({
        content: tweetInfo.content,
        commentNumber: tweetInfo.commentNumber,
        likeNumber,
        shareNumber: tweetInfo.shareNumber,
        wasLikedByUser,
        wasSharedByUser: tweetInfo.wasSharedByUser,
        mediaUrl: tweetInfo.mediaUrl,
        parentPostInfoWithClient: parentPostInfoWithClient,
        createdAt: tweetInfo.createdAt,
      });
    }

    return formatReturn;
  }
}
