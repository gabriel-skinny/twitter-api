import { makePost } from '../../test/factories/makePost';
import { InMemoryPostRepository } from '../../test/repositories/inMemoryTweetRepository';
import { GetPostsByUserIds } from './get-many-by-user-ids';

describe('Get many by user ids use case', () => {
  it('Should return all posts from userIds', async () => {
    const postRepository = new InMemoryPostRepository();

    const userIds = ['user1', 'user2', 'user3'];
    const posts = [
      makePost({ userId: userIds[0] }),
      makePost({ userId: userIds[1] }),
      makePost({ userId: userIds[2] }),
    ];

    for (const post of posts) {
      await postRepository.save(post);
    }

    const useCase = new GetPostsByUserIds(postRepository);

    const response = await useCase.execute({
      userIds,
      startTimestamp: new Date(),
      perPage: 20,
      actualUserId: 'actualUserId',
    });

    expect(response).toStrictEqual(
      posts.map((post) => ({
        content: post.content,
        mediaUrl: post.mediaUrl,
        userId: post.userId,
        commentNumber: 0,
        likeNumber: Object.keys(post.likes).length,
        shareNumber: 0,
        wasSharedByActualUser: false,
        wasLikedByActualUser: false,
      })),
    );
  });
});
