import NotFoundCustomError from 'src/Shared/errors/notFound';
import { BaseTweet } from '../../entities/baseTweet';
import AbstractBaseTweetRepository from '../../repositories/base';
import AbstractMessageBroker, {
  EVENT_TYPES_ENUM,
} from '../../services/messageBroker';

interface IDeslikeBaseTweetUseCaseParams {
  tweetId: string;
  requesterUserId: string;
}

export class DeslikeBaseTweetUseCase<T extends BaseTweet> {
  constructor(
    private baseTweetRepository: AbstractBaseTweetRepository<T>,
    private messageBrokerService: AbstractMessageBroker,
  ) {}

  async execute({ requesterUserId, tweetId }: IDeslikeBaseTweetUseCaseParams) {
    const baseTweet = await this.baseTweetRepository.findById(tweetId);

    if (!baseTweet) throw new NotFoundCustomError('Tweet not found');

    baseTweet.deslike(requesterUserId);

    await this.baseTweetRepository.updateById({ id: tweetId, data: baseTweet });

    await this.messageBrokerService.sendEvent({
      eventType: EVENT_TYPES_ENUM.TWEET_DESLIKED,
      data: { userId: baseTweet.userId, tweetId, requesterUserId },
    });
  }
}
