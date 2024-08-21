import NotFoundCustomError from 'src/Shared/errors/notFound';
import { EVENT_TYPES_ENUM } from '../../services/messageBroker';
import { makePost } from '../../test/factories/makePost';
import { InMemoryBaseTweetRepository } from '../../test/repositories/inMemoryBaseTweetRepository';
import { MessageBrockerMock } from '../../test/services/messageBroker';
import { LikeBaseTweetUseCase } from './like';

const makeSut = () => {
  const baseTweetRepository = new InMemoryBaseTweetRepository();
  const messageBrokerService = new MessageBrockerMock();

  const likeBaseTweetUseCase = new LikeBaseTweetUseCase(
    baseTweetRepository,
    messageBrokerService,
  );

  return {
    likeBaseTweetUseCase,
    baseTweetRepository,
    messageBrokerService,
  };
};

describe('Like tweet use case', () => {
  it('Should like a tweet', async () => {
    const { likeBaseTweetUseCase, messageBrokerService, baseTweetRepository } =
      makeSut();

    messageBrokerService.sendEvent = jest.fn();

    const tweet = makePost();
    await baseTweetRepository.save(tweet);

    const likerUserId = 'userId';
    await likeBaseTweetUseCase.execute({
      baseTweetId: tweet.id,
      requesterUserId: likerUserId,
    });

    expect(baseTweetRepository.baseTweetDatabase[0].likes).toStrictEqual({
      [likerUserId]: true,
    });
    expect(messageBrokerService.sendEvent).toHaveBeenCalledWith({
      eventType: EVENT_TYPES_ENUM.TWEET_LIKED,
      data: {
        userId: tweet.userId,
        tweetId: tweet.id,
        requesterUserId: likerUserId,
      },
    });
  });

  it('Should throw an error if tweet does not exists', async () => {
    const { likeBaseTweetUseCase, messageBrokerService, baseTweetRepository } =
      makeSut();

    messageBrokerService.sendEvent = jest.fn();

    const likeBaseTweetUseCasePromise = likeBaseTweetUseCase.execute({
      baseTweetId: 'notExistsTweetId',
      requesterUserId: 'notExistsUserId',
    });

    expect(likeBaseTweetUseCasePromise).rejects.toThrow(NotFoundCustomError);
  });
});
