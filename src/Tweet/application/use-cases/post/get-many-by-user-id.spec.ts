import { makeMockReturnBaseTweet } from '../../test/factories/makeMockReturnBaseTweet';
import { makePost } from '../../test/factories/makePost';
import { InMemoryPostRepository } from '../../test/repositories/inMemoryTweetRepository';
import { GetTweetBaseByIdUseCaseMock } from '../../test/use-cases/get-tweet-base-by-id';

import { GetPostsByUserId } from './get-many-by-user-id';

const makeSut = () => {
  const postRepository = new InMemoryPostRepository();
  const getTweetBaseByIdUseCase = new GetTweetBaseByIdUseCaseMock();

  const getPostsByUserId = new GetPostsByUserId(
    postRepository,
    getTweetBaseByIdUseCase,
  );

  return { getPostsByUserId, postRepository, getTweetBaseByIdUseCase };
};

describe('Get many posts by user id use case', () => {
  it('Should get many posts from a user', async () => {
    const { getPostsByUserId, postRepository, getTweetBaseByIdUseCase } =
      makeSut();
    const post = makePost();
    const returnFindByMany = [post, post, post];
    postRepository.findManyByUserId = jest
      .fn()
      .mockReturnValueOnce(returnFindByMany);

    const mockPostInfo = makeMockReturnBaseTweet(post);
    getTweetBaseByIdUseCase.execute = jest.fn().mockReturnValue(mockPostInfo);

    const response = await getPostsByUserId.execute({
      userId: 'userId',
    });

    expect(response).toStrictEqual(
      returnFindByMany.map(() => ({
        post,
        commentNumber: mockPostInfo.commentNumber,
        likeNumber: mockPostInfo.likeNumber,
        shareNumber: mockPostInfo.shareNumber,
      })),
    );
    expect(response).toHaveLength(3);
  });

  it('Should return an emptyu array if user does not have posts', async () => {
    const { getPostsByUserId, postRepository } = makeSut();
    postRepository.findManyByUserId = jest.fn().mockReturnValueOnce([]);

    const response = await getPostsByUserId.execute({
      userId: 'userId',
    });

    expect(response).toStrictEqual([]);
  });
});
