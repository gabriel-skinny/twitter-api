import { makeMockReturnBaseTweet } from '../../test/factories/makeMockReturnBaseTweet';
import { makePost } from '../../test/factories/makePost';
import { makeShare } from '../../test/factories/makeShare';
import { InMemoryShareRepository } from '../../test/repositories/inMemoryShareRepository';
import { GetTweetBaseByIdUseCaseMock } from '../../test/use-cases/get-tweet-base-by-id';
import { GetSharesByUserId } from './get-many-by-user-id';

const makeSut = () => {
  const shareRepository = new InMemoryShareRepository();
  const getTweetBaseByIdUseCase = new GetTweetBaseByIdUseCaseMock();

  const getSharesByUserId = new GetSharesByUserId(
    shareRepository,
    getTweetBaseByIdUseCase,
  );

  return { getSharesByUserId, getTweetBaseByIdUseCase, shareRepository };
};

const mockedShare = makeShare();
const mockedTweetSharedInfo = makeMockReturnBaseTweet(makePost());
const mockedShareInfo = makeMockReturnBaseTweet(mockedShare);

const getTweetBaseByIdUseCaseMockImplementation = (id: string) => {
  if (mockedShare.creatorReferenceTweetId == id) return mockedTweetSharedInfo;
  if (id == mockedShare.id) return mockedShareInfo;
};

describe('Get many shares by user id use case', () => {
  it('Should get many shares from a user', async () => {
    const { getSharesByUserId, getTweetBaseByIdUseCase, shareRepository } =
      makeSut();
    const returnSharesFindByMany = [mockedShare, mockedShare, mockedShare];
    shareRepository.findManyByUserId = jest
      .fn()
      .mockReturnValue(returnSharesFindByMany);

    getTweetBaseByIdUseCase.execute = jest
      .fn()
      .mockImplementation(getTweetBaseByIdUseCaseMockImplementation);

    const response = await getSharesByUserId.execute({
      userId: mockedShareInfo.tweet.userId,
    });

    expect(response).toStrictEqual(
      returnSharesFindByMany.map(() => ({
        tweetShared: mockedTweetSharedInfo,
        share: mockedShare,
        commentNumber: mockedShareInfo.commentNumber,
        likeNumber: mockedShareInfo.likeNumber,
        shareNumber: mockedShareInfo.shareNumber,
      })),
    );
    expect(response).toHaveLength(3);
  });

  it('Should return an emptyu array if user does not have posts', async () => {
    const { getSharesByUserId, shareRepository } = makeSut();
    shareRepository.findManyByUserId = jest.fn().mockReturnValueOnce([]);

    const response = await getSharesByUserId.execute({
      userId: 'nonExistingId',
    });

    expect(response).toStrictEqual([]);
  });
});
