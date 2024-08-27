import AbstractPostRepository from '../../repositories/post';

interface IGetPostsByUserIdsParams {
  userIds: string[];
  startTimestamp: Date;
  perPage: number;
  actualUserId: string;
}

type IGetPostsByUserIdsReturn = {
  mediaUrl?: string;
  content: string;
  userId: string;
  likeNumber: number;
  shareNumber: number;
  commentNumber: number;
  wasLikedByActualUser: boolean;
  wasSharedByActualUser: boolean;
};

export class GetPostsByUserIds {
  constructor(private postRepository: AbstractPostRepository) {}

  async execute({
    userIds,
    startTimestamp,
    perPage,
    actualUserId,
  }: IGetPostsByUserIdsParams): Promise<IGetPostsByUserIdsReturn[]> {
    const posts = await this.postRepository.findByUserIdsAndTimeStamp({
      userIds,
      startTimestamp,
      limit: perPage,
      actualUserId,
    });

    const formatedReturn: IGetPostsByUserIdsReturn[] = [];

    for (const post of posts) {
      const wasLikedByActualUser = Boolean(post.likes[actualUserId]);

      formatedReturn.push({
        content: post.content,
        mediaUrl: post.mediaUrl,
        userId: post.userId,
        commentNumber: post.commentNumber,
        likeNumber: Object.keys(post.likes).length,
        shareNumber: post.shareNumber,
        wasSharedByActualUser: post.wasSharedByActualUser,
        wasLikedByActualUser,
      });
    }

    return formatedReturn;
  }
}
