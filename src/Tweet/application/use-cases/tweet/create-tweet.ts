import { Tweet } from '../../entities/Tweet';
import AbstractTweetRepository from '../../repositories/tweet';
import AbstractMessageBroker, {
  EVENT_TYPES_ENUM,
} from '../../services/messageBroker';

interface ICreateTweetUseCaseParams {
  userId: string;
  content: string;
  mediaUrl?: string;
}

export default class CreateTweetUseCase {
  constructor(
    private tweetRepository: AbstractTweetRepository,
    private messageBrokerService: AbstractMessageBroker,
  ) {}

  async execute({ userId, content, mediaUrl }: ICreateTweetUseCaseParams) {
    const tweet = new Tweet({
      userId,
      content,
      mediaUrl,
    });

    await this.tweetRepository.save(tweet);

    await this.messageBrokerService.sendEvent({
      eventType: EVENT_TYPES_ENUM.TWEET_CREATION,
      data: { userId, tweetId: tweet.id },
    });
  }
}
