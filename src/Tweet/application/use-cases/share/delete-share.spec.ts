import NotFoundCustomError from 'src/Shared/errors/notFound';
import { TweetTypesEnum } from '../../entities/baseTweet';
import { EVENT_TYPES_ENUM } from '../../services/messageBroker';
import { makeShare } from '../../test/factories/makeShare';

import { InMemoryShareRepository } from '../../test/repositories/inMemoryShareRepository';
import { MessageBrockerMock } from '../../test/services/messageBroker';
import DeleteShareUseCase from './delete-share';

describe('Delete tweet use case', () => {
  it('Should delete a share', async () => {
    const shareRepository = new InMemoryShareRepository();
    const messageBrocker = new MessageBrockerMock();
    const deleteShareUseCase = new DeleteShareUseCase(
      shareRepository,
      messageBrocker,
    );

    messageBrocker.sendEvent = jest.fn();

    const share = makeShare({
      parentId: 'parentId',
      parentType: TweetTypesEnum.POST,
      creatorReferenceTweetId: 'id',
    });
    await shareRepository.save(share);

    await deleteShareUseCase.execute(share.id);

    expect(shareRepository.baseTweetDatabase).toHaveLength(0);
    expect(messageBrocker.sendEvent).toHaveBeenCalledWith({
      eventType: EVENT_TYPES_ENUM.TWEET_UNSHARED,
      data: {
        shareId: share.id,
        userId: share.userId,
        creatorReferenceTweetId: share.creatorReferenceTweetId,
      },
    });
  });

  it('Should thrown an error if the share does not exists', async () => {
    const shareRepository = new InMemoryShareRepository();
    const messageBrocker = new MessageBrockerMock();
    const deleteShareUseCase = new DeleteShareUseCase(
      shareRepository,
      messageBrocker,
    );

    messageBrocker.sendEvent = jest.fn();

    const promiseUseCase = deleteShareUseCase.execute('notExistingShareId');

    expect(promiseUseCase).rejects.toThrow(NotFoundCustomError);
  });
});
