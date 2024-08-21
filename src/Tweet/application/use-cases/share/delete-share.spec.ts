import NotFoundCustomError from 'src/Shared/errors/notFound';
import { TweetTypesEnum } from '../../entities/baseTweet';
import { EVENT_TYPES_ENUM } from '../../services/messageBroker';
import { makeGenericSut } from '../../test/factories/makeGenericSut';
import { makeShare } from '../../test/factories/makeShare';
import DeleteShareUseCase from '../comment/delete';

describe('Delete tweet use case', () => {
  it('Should delete a share', async () => {
    const { useCase, messageBrocker, tweetRepository } =
      makeGenericSut<DeleteShareUseCase>({
        UseCaseClass: DeleteShareUseCase,
      });

    messageBrocker.sendEvent = jest.fn();

    const share = makeShare({
      parentId: 'parentId',
      parentType: TweetTypesEnum.POST,
      tweetId: 'id',
    });
    await tweetRepository.save(share);

    await useCase.execute(share.id);

    expect(tweetRepository.baseTweetDatabase).toHaveLength(0);
    expect(messageBrocker.sendEvent).toHaveBeenCalledWith({
      eventType: EVENT_TYPES_ENUM.TWEET_UNSHARED,
      data: { shareId: share.id, userId: share.userId, tweetId: share.tweetId },
    });
  });

  it('Should thrown an error with the share does not exists', async () => {
    const { useCase, messageBrocker } = makeGenericSut<DeleteShareUseCase>({
      UseCaseClass: DeleteShareUseCase,
    });

    messageBrocker.sendEvent = jest.fn();

    const promiseUseCase = useCase.execute('notExistingShareId');

    expect(promiseUseCase).rejects.toThrow(NotFoundCustomError);
  });
});
