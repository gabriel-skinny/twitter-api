import { Comment } from '../../entities/Comment';
import { IPagination } from '../../interfaces/pagination';
import AbstractCommentRepository from '../../repositories/comment';
import {
  AbstractGetTweetBaseByIdUseCase,
  IGetBaseTweet,
} from '../base/get-by-id';

interface IGetCommentByUserIdParams {
  userId: string;
}

interface IGetCommentByUserIdReturn {
  parentTweetInfo: IGetBaseTweet | null;
  creatorRefereceInfo?: IGetBaseTweet | null;
  comment: Comment;
  likeNumber: number;
  shareNumber: number;
  commentNumber: number;
}

export class GetCommentsByUserId {
  constructor(
    private readonly commentRepository: AbstractCommentRepository,
    private readonly getTweetBaseByIdUseCase: AbstractGetTweetBaseByIdUseCase,
  ) {}

  async execute({
    userId,
    page,
    perPage,
    orderBy,
    order,
  }: IGetCommentByUserIdParams & IPagination): Promise<
    IGetCommentByUserIdReturn[]
  > {
    const comments = await this.commentRepository.findManyByUserId({
      userId,
      limit: perPage,
      skip: page * perPage - perPage,
      order,
      orderBy,
    });

    const returnFormat: IGetCommentByUserIdReturn[] = [];

    for (const comment of comments) {
      const parentTweetInfo = await this.getTweetBaseByIdUseCase.execute(
        comment.parentId,
      );
      let creatorRefereceInfo: IGetBaseTweet | null;
      if (comment.parentId !== comment.creatorReferenceTweetId) {
        creatorRefereceInfo = await this.getTweetBaseByIdUseCase.execute(
          comment.creatorReferenceTweetId,
        );
      }

      const commentInfo = await this.getTweetBaseByIdUseCase.execute(
        comment.id,
      );

      returnFormat.push({
        comment,
        commentNumber: commentInfo.commentNumber,
        likeNumber: commentInfo.likeNumber,
        shareNumber: commentInfo.shareNumber,
        parentTweetInfo,
        creatorRefereceInfo,
      });
    }

    return returnFormat;
  }
}
