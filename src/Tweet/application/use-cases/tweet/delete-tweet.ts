import NotFoundCustomError from 'src/Shared/errors/notFound';
import { Tweet } from '../../entities/Tweet';
import AbstractTweetRepository from '../../repositories/tweet';
import AbstractMessageBroker, {
  EVENT_TYPES_ENUM,
} from '../../services/messageBroker';

interface ICreateTweetUseCaseParams {
  userId: string;
  tweetId: string;
}

export default class DeleteTweetUseCase {
  constructor(
    private tweetRepository: AbstractTweetRepository,
    private messageBrokerService: AbstractMessageBroker,
  ) {}

  async execute({ userId, tweetId }: ICreateTweetUseCaseParams) {
    const tweet = await this.tweetRepository.existsById(tweetId);

    if (!tweet) throw new NotFoundCustomError('tweet');

    await this.tweetRepository.deleteById(tweetId);

    await this.messageBrokerService.sendEvent({
      eventType: EVENT_TYPES_ENUM.TWEET_DELETION,
      data: { userId, tweetId },
    });
  }
}
