import { Comment } from '../../entities/Comment';
import { IPagination } from '../../interfaces/pagination';
import AbstractCommentRepository from '../../repositories/comment';
import { AbstractCacheService } from '../../services/cacheService';

interface IGetCommentsByParentIdParams {
  parentId: string;
  actualUserId: string;
}

interface IGetCommentsByParentIdReturn {
  comment: Comment;
  likeNumber: number;
  shareNumber: number;
  commentNumber: number;
}

export class GetCommentsByParentIdUseCase {
  constructor(
    private commentRepository: AbstractCommentRepository,
    private cacheService: AbstractCacheService,
  ) {}

  async execute({
    parentId,
    actualUserId,
    page,
    perPage,
    order,
    orderBy,
  }: IGetCommentsByParentIdParams & IPagination): Promise<
    IGetCommentsByParentIdReturn[]
  > {
    const resultCached = await this.cacheService.getUseCaseResult<
      'parentId',
      IGetCommentsByParentIdReturn[]
    >({ parentId });

    if (resultCached) return resultCached;

    const comments = await this.commentRepository.findManyByParentId({
      parentId,
      actualUserId,
      limit: perPage,
      skip: page * perPage - perPage,
      order,
      orderBy,
    });

    const returnFormat: IGetCommentsByParentIdReturn[] = [];

    for (const comment of comments) {
      const likeNumber = Object.keys(comment.likes).length;
      returnFormat.push({
        comment,
        commentNumber: comment.commentNumber,
        likeNumber,
        shareNumber: comment.shareNumber,
      });
    }

    await this.cacheService.setUseCaseResult<
      'parentId',
      IGetCommentsByParentIdReturn[]
    >({ parentId, useCaseResult: returnFormat });

    return returnFormat;
  }
}
