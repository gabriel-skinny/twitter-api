import { makeComment } from '../../test/factories/makeComment';
import { InMemoryCommentRepository } from '../../test/repositories/inMemoryCommentRepository';
import { CacheServiceMock } from '../../test/services/cacheService';
import { GetCommentsByParentIdUseCase } from './get-many-by-parent-id';

const makeSut = () => {
  const cacheService = new CacheServiceMock();
  const commentRepository = new InMemoryCommentRepository();
  const getCommentsByParentIdUseCase = new GetCommentsByParentIdUseCase(
    commentRepository,
    cacheService,
  );

  return { cacheService, getCommentsByParentIdUseCase, commentRepository };
};

describe('Get many by parent id', () => {
  it('Should return many comments by parent Id', async () => {
    const { cacheService, getCommentsByParentIdUseCase, commentRepository } =
      makeSut();

    const parentId = 'parentId123';
    const comments = [makeComment({ parentId }), makeComment({ parentId })];
    await commentRepository.save(comments[0]);
    await commentRepository.save(comments[1]);

    cacheService.setUseCaseResult = jest.fn();

    const formatedComments = comments.map((comment) => ({
      comment,
      commentNumber: 0,
      likeNumber: 0,
      shareNumber: 0,
    }));

    const result = await getCommentsByParentIdUseCase.execute({
      parentId,
      actualUserId: 'UserId',
    });

    expect(result).toStrictEqual(formatedComments);
    expect(cacheService.setUseCaseResult).toHaveBeenCalledWith({
      parentId,
      useCaseResult: formatedComments,
    });
  });

  it('Should return the cached value', async () => {
    const { cacheService, getCommentsByParentIdUseCase } = makeSut();

    cacheService.getUseCaseResult = jest.fn().mockReturnValueOnce(true);

    const result = await getCommentsByParentIdUseCase.execute({
      parentId: 'parentId',
      actualUserId: 'UserId',
    });

    expect(result).toBeTruthy();
  });

  it('Should return an empty array with non comments were found', async () => {
    const { cacheService, getCommentsByParentIdUseCase } = makeSut();

    cacheService.setUseCaseResult = jest.fn();

    const parentId = 'parentId123';
    const result = await getCommentsByParentIdUseCase.execute({
      parentId,
      actualUserId: 'UserId',
    });

    expect(result).toStrictEqual([]);
    expect(cacheService.setUseCaseResult).toHaveBeenCalledWith({
      parentId,
      useCaseResult: [],
    });
  });
});
