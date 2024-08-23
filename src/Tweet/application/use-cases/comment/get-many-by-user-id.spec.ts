import { makeComment } from '../../test/factories/makeComment';
import { makeMockReturnBaseTweet } from '../../test/factories/makeMockReturnBaseTweet';
import { makePost } from '../../test/factories/makePost';
import { makeShare } from '../../test/factories/makeShare';
import { InMemoryCommentRepository } from '../../test/repositories/inMemoryCommentRepository';
import { GetTweetBaseByIdUseCaseMock } from '../../test/use-cases/get-tweet-base-by-id';
import { GetCommentsByUserId } from './get-many-by-user-id';

const makeSut = (data?: { diferentCreatorReference: boolean }) => {
  const commentRepository = new InMemoryCommentRepository();
  const getTweetBaseByIdUseCase = new GetTweetBaseByIdUseCaseMock();

  const getCommentsByUserId = new GetCommentsByUserId(
    commentRepository,
    getTweetBaseByIdUseCase,
  );

  const mockedSharedTweetCommentedInfo = makeMockReturnBaseTweet(makeShare());
  const mockedPostCreatorReferenceInfo = makeMockReturnBaseTweet(makePost());
  let mockedComment = makeComment({
    parentId: mockedSharedTweetCommentedInfo.tweet.id,
    creatorReferenceTweetId: mockedSharedTweetCommentedInfo.tweet.id,
  });
  if (data?.diferentCreatorReference)
    mockedComment = makeComment({
      parentId: mockedSharedTweetCommentedInfo.tweet.id,
      creatorReferenceTweetId: mockedPostCreatorReferenceInfo.tweet.id,
    });

  const mockedCommentInfo = makeMockReturnBaseTweet(mockedComment);

  const getTweetBaseByIdUseCaseMockImplementation = (id: string) => {
    if (mockedComment.parentId == id) return mockedSharedTweetCommentedInfo;
    if (id == mockedComment.id) return mockedCommentInfo;
    if (id == mockedComment.creatorReferenceTweetId)
      return mockedPostCreatorReferenceInfo;
  };

  return {
    getCommentsByUserId,
    getTweetBaseByIdUseCase,
    commentRepository,
    getTweetBaseByIdUseCaseMockImplementation,
    mockedSharedTweetCommentedInfo,
    mockedPostCreatorReferenceInfo,
    mockedComment,
    mockedCommentInfo,
  };
};

describe('Get many comments by user id use case', () => {
  it('Should get many comments from a user with parentTweet', async () => {
    const {
      getCommentsByUserId,
      getTweetBaseByIdUseCase,
      commentRepository,
      mockedComment,
      getTweetBaseByIdUseCaseMockImplementation,
      mockedCommentInfo,
      mockedSharedTweetCommentedInfo,
    } = makeSut();
    const returnCommentsFindByMany = [
      mockedComment,
      mockedComment,
      mockedComment,
    ];
    commentRepository.findManyByUserId = jest
      .fn()
      .mockReturnValue(returnCommentsFindByMany);

    getTweetBaseByIdUseCase.execute = jest
      .fn()
      .mockImplementation(getTweetBaseByIdUseCaseMockImplementation);

    const response = await getCommentsByUserId.execute({
      userId: mockedComment.userId,
    });

    expect(response).toStrictEqual(
      returnCommentsFindByMany.map(() => ({
        comment: mockedComment,
        commentNumber: mockedCommentInfo.commentNumber,
        likeNumber: mockedCommentInfo.likeNumber,
        shareNumber: mockedCommentInfo.shareNumber,
        parentTweetInfo: mockedSharedTweetCommentedInfo,
        creatorRefereceInfo: undefined,
      })),
    );
    expect(response).toHaveLength(3);
  });

  it('Should get many comments from a user with parentTweet and creatorReference', async () => {
    const {
      getCommentsByUserId,
      getTweetBaseByIdUseCase,
      commentRepository,
      mockedComment,
      getTweetBaseByIdUseCaseMockImplementation,
      mockedCommentInfo,
      mockedSharedTweetCommentedInfo,
      mockedPostCreatorReferenceInfo,
    } = makeSut({ diferentCreatorReference: true });

    const returnCommentsFindByMany = [
      mockedComment,
      mockedComment,
      mockedComment,
    ];
    commentRepository.findManyByUserId = jest
      .fn()
      .mockReturnValue(returnCommentsFindByMany);

    getTweetBaseByIdUseCase.execute = jest
      .fn()
      .mockImplementation(getTweetBaseByIdUseCaseMockImplementation);

    const response = await getCommentsByUserId.execute({
      userId: mockedComment.userId,
    });

    expect(response).toStrictEqual(
      returnCommentsFindByMany.map(() => ({
        comment: mockedComment,
        commentNumber: mockedCommentInfo.commentNumber,
        likeNumber: mockedCommentInfo.likeNumber,
        shareNumber: mockedCommentInfo.shareNumber,
        parentTweetInfo: mockedSharedTweetCommentedInfo,
        creatorRefereceInfo: mockedPostCreatorReferenceInfo,
      })),
    );
    expect(response).toHaveLength(3);
  });

  it('Should return an emptyu array if user does not have posts', async () => {
    const { getCommentsByUserId, commentRepository } = makeSut();
    commentRepository.findManyByUserId = jest.fn().mockReturnValueOnce([]);

    const response = await getCommentsByUserId.execute({
      userId: 'nonExistingId',
    });

    expect(response).toStrictEqual([]);
  });
});
