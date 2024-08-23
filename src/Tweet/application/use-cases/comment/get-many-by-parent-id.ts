import { Comment } from '../../entities/Comment';
import AbstractCommentRepository from '../../repositories/comment';
import { AbstractGetTweetBaseByIdUseCase } from '../base/get-by-id';

interface IGetCommentsByParentIdParams {
  parentId: string;
  page?: number;
  perPage?: number;
  order?: 'Asc' | 'Desc';
  orderBy?: { id?: boolean; createdAt?: boolean };
}

interface IGetCommentsByParentIdReturn {
  comment: Comment;
  likeNumber: number;
  shareNumber: number;
  commentNumber: number;
}

export class GetCommentsByParentId {
  constructor(
    private commentRepository: AbstractCommentRepository,
    private getTweetBaseByIdUseCase: AbstractGetTweetBaseByIdUseCase,
  ) {}

  async execute({
    parentId,
    page,
    perPage,
    order,
    orderBy,
  }: IGetCommentsByParentIdParams): Promise<IGetCommentsByParentIdReturn[]> {
    const comments = await this.commentRepository.findManyByParentId({
      parentId,
      limit: perPage,
      skip: page * perPage - perPage,
      order,
      orderBy,
    });

    const returnFormat: IGetCommentsByParentIdReturn[] = [];

    for (const comment of comments) {
      const commentInfo = await this.getTweetBaseByIdUseCase.execute(
        comment.id,
      );

      returnFormat.push({
        comment,
        commentNumber: commentInfo.commentNumber,
        likeNumber: commentInfo.likeNumber,
        shareNumber: commentInfo.shareNumber,
      });
    }

    return returnFormat;
  }
}
