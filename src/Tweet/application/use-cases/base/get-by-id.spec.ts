import { BaseTweet, TweetTypesEnum } from '../../entities/baseTweet';
import { makeComment } from '../../test/factories/makeComment';
import { makePost } from '../../test/factories/makePost';
import { makeShare } from '../../test/factories/makeShare';
import { InMemoryBaseTweetRepository } from '../../test/repositories/inMemoryBaseTweetRepository';
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

describe('Get Tweet base by id use case', () => {
  it('Should get a tweet base', async () => {
    const baseTweetRepository = new InMemoryBaseTweetRepository();
    const getTweetBaseByIdUseCase = new GetTweetBaseByIdUseCase(
      baseTweetRepository,
    );

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
  });

  it('should return null with the tweet does not exists', async () => {
    const baseTweetRepository = new InMemoryBaseTweetRepository();
    const getTweetBaseByIdUseCase = new GetTweetBaseByIdUseCase(
      baseTweetRepository,
    );

    const response = await getTweetBaseByIdUseCase.execute('NonExistingPostId');

    expect(response).toBeNull();
  });
});
