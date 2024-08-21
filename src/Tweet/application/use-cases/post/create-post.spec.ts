import { TweetTypesEnum } from '../../entities/baseTweet';
import { EVENT_TYPES_ENUM } from '../../services/messageBroker';
import { makeGenericSut } from '../../test/factories/makeGenericSut';
import CreateTweetUseCase from './create';

describe('Create post use case', () => {
  it('Should create a post', async () => {
    const { useCase, messageBrocker, postRepository } =
      makeGenericSut<CreateTweetUseCase>({
        UseCaseClass: CreateTweetUseCase,
      });

    messageBrocker.sendEvent = jest.fn();

    await useCase.execute({
      userId: 'User',
      content: 'Conteudo do post',
    });

    expect(postRepository.baseTweetDatabase).toHaveLength(1);
    expect(postRepository.baseTweetDatabase[0].type).toBe(TweetTypesEnum.POST);
    expect(messageBrocker.sendEvent).toHaveBeenCalledWith({
      eventType: EVENT_TYPES_ENUM.TWEET_CREATION,
      data: {
        userId: postRepository.baseTweetDatabase[0].userId,
        tweetId: postRepository.baseTweetDatabase[0].id,
      },
    });
  });
});
