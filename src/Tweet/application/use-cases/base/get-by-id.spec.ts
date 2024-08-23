import { BaseTweet, TweetTypesEnum } from '../../entities/baseTweet';
import { makeComment } from '../../test/factories/makeComment';
import { makePost } from '../../test/factories/makePost';
import { makeShare } from '../../test/factories/makeShare';
import { InMemoryBaseTweetRepository } from '../../test/repositories/inMemoryBaseTweetRepository';
import { CacheServiceMock } from '../../test/services/cacheService';
import { GetTweetBaseByIdUseCase } from './get-by-id';

const makeSharesAndComments = async (
  postId: string,
  baseTweetRepository: InMemoryBaseTweetRepository<BaseTweet>,
) => {
  const share1 = makeShare({
    creatorReferenceTweetId: postId,
    parentId: postId,
    parentType: TweetTypesEnum.POST,
  });
  await baseTweetRepository.save(share1);
  const share2 = makeShare({
    creatorReferenceTweetId: postId,
    parentId: postId,
    parentType: TweetTypesEnum.POST,
  });
  await baseTweetRepository.save(share2);

  const comment1 = makeComment({
    creatorReferenceTweetId: postId,
    parentId: postId,
    parentType: TweetTypesEnum.POST,
  });
  await baseTweetRepository.save(comment1);

  const comment2 = makeComment({
    creatorReferenceTweetId: postId,
    parentId: postId,
    parentType: TweetTypesEnum.POST,
  });
  await baseTweetRepository.save(comment2);
};

const makeUseCaseSut = () => {
  const baseTweetRepository = new InMemoryBaseTweetRepository();
  const cacheService = new CacheServiceMock();

  const getTweetBaseByIdUseCase = new GetTweetBaseByIdUseCase(
    baseTweetRepository,
    cacheService,
  );

  return { getTweetBaseByIdUseCase, baseTweetRepository, cacheService };
};

describe('Get Tweet base by id use case', () => {
  it('Should get a tweet base and save on cache', async () => {
    const { baseTweetRepository, getTweetBaseByIdUseCase, cacheService } =
      makeUseCaseSut();

    cacheService.set = jest.fn();

    const post = makePost();
    post.like('userId1');
    post.like('userId2');
    await baseTweetRepository.save(post);

    await makeSharesAndComments(post.id, baseTweetRepository);

    const response = await getTweetBaseByIdUseCase.execute(post.id);

    expect(response.tweet.id).toBe(post.id);
    expect(response.commentNumber).toBe(2);
    expect(response.likeNumber).toBe(2);
    expect(response.shareNumber).toBe(2);
    expect(cacheService.set).toHaveBeenCalledWith({
      key: post.id,
      value: response,
    });
  });

  it('should return cache value with exists', async () => {
    const { getTweetBaseByIdUseCase, cacheService } = makeUseCaseSut();

    const cacheReturn = {
      shareNumber: 2,
      likeNumber: 3,
      commentNumber: 2,
      tweet: { id: 12, content: 'Post content' },
    };
    cacheService.get = jest.fn().mockReturnValueOnce(cacheReturn);

    const response = await getTweetBaseByIdUseCase.execute('NonExistingPostId');

    expect(response).toStrictEqual(cacheReturn);
  });

  it('should return null with the tweet does not exists', async () => {
    const { getTweetBaseByIdUseCase } = makeUseCaseSut();

    const response = await getTweetBaseByIdUseCase.execute('NonExistingPostId');

    expect(response).toBeNull();
  });
});
