import { TweetTypesEnum } from '../../entities/baseTweet';
import { Post } from '../../entities/Post';
import { Share } from '../../entities/Share';
import { makePost } from '../../test/factories/makePost';
import { makeShare } from '../../test/factories/makeShare';
import { InMemoryBaseTweetRepository } from '../../test/repositories/inMemoryBaseTweetRepository';
import { GetByUserIdAndTypesUseCase } from './get-by-user-id-and-types';

describe('Get by user id and types', () => {
  it('Should get tweets info from user by post types', async () => {
    const baseTweetRepository = new InMemoryBaseTweetRepository<Post | Share>();
    const getByUserIdAndTypesUseCase = new GetByUserIdAndTypesUseCase(
      baseTweetRepository,
    );

    const userId = 'userId123';
    const post = makePost({ userId });
    await baseTweetRepository.save(post);

    const share = makeShare({ userId });
    await baseTweetRepository.save(share);

    const response = await getByUserIdAndTypesUseCase.execute({
      userId,
      tweetTypes: [TweetTypesEnum.POST, TweetTypesEnum.SHARE],
    });
    const similarReponse = {
      wasLikedByUser: false,
      wasSharedByUser: false,
      commentNumber: 0,
      likeNumber: 0,
      shareNumber: 0,
      parentPostInfoWithClient: null,
    };
    expect(response).toHaveLength(2);
    expect(response[0]).toStrictEqual({
      content: post.content,
      mediaUrl: post.mediaUrl,
      createdAt: post.createdAt,
      ...similarReponse,
    });
    expect(response[1]).toStrictEqual({
      content: share.content,
      mediaUrl: share.mediaUrl,
      createdAt: share.createdAt,
      ...similarReponse,
    });
  });

  it('Should get tweets info from user by post types with their parents', async () => {
    const baseTweetRepository = new InMemoryBaseTweetRepository<Post | Share>();
    const getByUserIdAndTypesUseCase = new GetByUserIdAndTypesUseCase(
      baseTweetRepository,
    );

    const userId = 'userId123';
    const post = makePost({ userId: 'OtherUser' });
    await baseTweetRepository.save(post);

    const share = makeShare({ userId, parentId: post.id });
    await baseTweetRepository.save(share);

    const response = await getByUserIdAndTypesUseCase.execute({
      userId,
      tweetTypes: [TweetTypesEnum.POST, TweetTypesEnum.SHARE],
    });

    expect(response[0]).toStrictEqual({
      content: post.content,
      mediaUrl: post.mediaUrl,
      createdAt: post.createdAt,
      wasLikedByUser: false,
      wasSharedByUser: false,
      commentNumber: 0,
      likeNumber: 0,
      shareNumber: 0,
      parentPostInfoWithClient: {
        content: share.content,
        mediaUrl: share.mediaUrl,
        createdAt: share.createdAt,
        wasLikedByUser: false,
        wasSharedByUser: false,
        commentNumber: 0,
        likeNumber: 0,
        shareNumber: 0,
      },
    });
  });
});
