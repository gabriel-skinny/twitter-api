import NotFoundCustomError from 'src/Shared/errors/notFound';
import { TweetTypesEnum } from '../../entities/baseTweet';
import { EVENT_TYPES_ENUM } from '../../services/messageBroker';
import { makePost } from '../../test/factories/makePost';
import { InMemoryBaseTweetRepository } from '../../test/repositories/inMemoryBaseTweetRepository';
import { MessageBrockerMock } from '../../test/services/messageBroker';
import { LikeBaseTweetUseCase } from './like';
import { DeslikeBaseTweetUseCase } from './deslike';

const makeSut = () => {
  const baseTweetRepository = new InMemoryBaseTweetRepository();
  const messageBrokerService = new MessageBrockerMock();

  const deslikeBaseTweetUseCase = new DeslikeBaseTweetUseCase(
    baseTweetRepository,
    messageBrokerService,
  );

  return {
    deslikeBaseTweetUseCase,
    baseTweetRepository,
    messageBrokerService,
  };
};

describe('Deslike tweet use case', () => {
  it('Should deslike a tweet', async () => {
    const {
      deslikeBaseTweetUseCase,
      messageBrokerService,
      baseTweetRepository,
    } = makeSut();

    messageBrokerService.sendEvent = jest.fn();

    const userLikerId = 'userId123';
    const tweet = makePost({
      likes: {
        [userLikerId]: true,
      },
    });
    await baseTweetRepository.save(tweet);

    await deslikeBaseTweetUseCase.execute({
      tweetId: tweet.id,
      requesterUserId: userLikerId,
    });

    expect(baseTweetRepository.baseTweetDatabase[0].likes).toStrictEqual({
      [userLikerId]: false,
    });
    expect(messageBrokerService.sendEvent).toHaveBeenCalledWith({
      eventType: EVENT_TYPES_ENUM.TWEET_DESLIKED,
      data: {
        userId: tweet.userId,
        tweetId: tweet.id,
        requesterUserId: userLikerId,
      },
    });
  });

  it('Should throw an error if tweet does not exists', async () => {
    const { deslikeBaseTweetUseCase, messageBrokerService } = makeSut();

    messageBrokerService.sendEvent = jest.fn();

    const deslikeBaseTweetUseCasePromise = deslikeBaseTweetUseCase.execute({
      tweetId: 'notExistsTweetId',
      requesterUserId: 'notExistsUserId',
    });

    expect(deslikeBaseTweetUseCasePromise).rejects.toStrictEqual(
      new NotFoundCustomError('Tweet not found'),
    );
  });

  it('Should throw an error if tweet does not have a like by that user', async () => {
    const {
      deslikeBaseTweetUseCase,
      messageBrokerService,
      baseTweetRepository,
    } = makeSut();

    messageBrokerService.sendEvent = jest.fn();

    const userLikerId = 'userId123';
    const tweet = makePost({
      likes: {
        [userLikerId]: true,
      },
    });
    await baseTweetRepository.save(tweet);
    await deslikeBaseTweetUseCase.execute({
      tweetId: tweet.id,
      requesterUserId: userLikerId,
    });

    const deslikeBaseTweetUseCasePromise = deslikeBaseTweetUseCase.execute({
      tweetId: tweet.id,
      requesterUserId: userLikerId,
    });

    expect(deslikeBaseTweetUseCasePromise).rejects.toStrictEqual(
      new NotFoundCustomError('Like not found'),
    );
  });
});
