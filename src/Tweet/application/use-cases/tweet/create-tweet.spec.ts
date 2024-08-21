import { TweetTypesEnum } from '../../entities/baseTweet';
import { EVENT_TYPES_ENUM } from '../../services/messageBroker';
import { InMemoryTweetRepository } from '../../test/repositories/inMemoryTweetRepository';
import { MessageBrockerMock } from '../../test/services/messageBroker';
import CreateTweetUseCase from './create-tweet';

const makeSut = () => {
  const tweetRepository = new InMemoryTweetRepository();
  const messageBrocker = new MessageBrockerMock();

  const createTweetUseCase = new CreateTweetUseCase(
    tweetRepository,
    messageBrocker,
  );

  return { createTweetUseCase, tweetRepository, messageBrocker };
};

describe('Create tweet use case', () => {
  it('Should create a tweet', async () => {
    const { createTweetUseCase, messageBrocker, tweetRepository } = makeSut();

    messageBrocker.sendEvent = jest.fn();

    await createTweetUseCase.execute({
      userId: 'User',
      content: 'Conteudo do post',
    });

    expect(tweetRepository.baseTweetDatabase).toHaveLength(1);
    expect(tweetRepository.baseTweetDatabase[0].type).toBe(TweetTypesEnum.POST);
    expect(messageBrocker.sendEvent).toHaveBeenCalledWith({
      eventType: EVENT_TYPES_ENUM.TWEET_CREATION,
      data: {
        userId: tweetRepository.baseTweetDatabase[0].userId,
        tweetId: tweetRepository.baseTweetDatabase[0].id,
      },
    });
  });
});
