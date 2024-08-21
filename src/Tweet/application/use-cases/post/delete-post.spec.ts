import NotFoundCustomError from 'src/Shared/errors/notFound';
import { EVENT_TYPES_ENUM } from '../../services/messageBroker';
import { makeGenericSut } from '../../test/factories/makeGenericSut';
import { makePost } from '../../test/factories/makePost';
import DeleteTweetUseCase from './delete';

describe('Delete post use case', () => {
  it('Should delete a post', async () => {
    const { useCase, messageBrocker, postRepository } =
      makeGenericSut<DeleteTweetUseCase>({
        UseCaseClass: DeleteTweetUseCase,
      });

    messageBrocker.sendEvent = jest.fn();

    const tweet = makePost();
    await postRepository.save(tweet);

    await useCase.execute({
      userId: tweet.userId,
      postId: tweet.id,
    });

    expect(postRepository.baseTweetDatabase).toHaveLength(0);
    expect(messageBrocker.sendEvent).toHaveBeenCalledWith({
      eventType: EVENT_TYPES_ENUM.TWEET_DELETION,
      data: {
        userId: tweet.userId,
        tweetId: tweet.id,
      },
    });
  });

  it('Should thrown an error with the post does not exists', async () => {
    const { useCase, messageBrocker } = makeGenericSut<DeleteTweetUseCase>({
      UseCaseClass: DeleteTweetUseCase,
    });

    messageBrocker.sendEvent = jest.fn();

    const promiseUseCase = useCase.execute({
      userId: 'NonExistingUserId',
      postId: 'NonExistingTweetId',
    });

    expect(promiseUseCase).rejects.toStrictEqual(
      new NotFoundCustomError('post'),
    );
  });
});
