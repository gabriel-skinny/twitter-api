import NotFoundCustomError from 'src/Shared/errors/notFound';
import { BaseTweet } from '../../entities/baseTweet';
import AbstractBaseTweetRepository from '../../repositories/base';
import AbstractMessageBroker, {
  EVENT_TYPES_ENUM,
} from '../../services/messageBroker';

interface ILikeTweetUseCaseParams {
  baseTweetId: string;
  requesterUserId: string;
}

export class LikeBaseTweetUseCase<T extends BaseTweet> {
  constructor(
    private baseTweetRepository: AbstractBaseTweetRepository<T>,
    private messageBrokerService: AbstractMessageBroker,
  ) {}

  async execute({ requesterUserId, baseTweetId }: ILikeTweetUseCaseParams) {
    const baseTweet = await this.baseTweetRepository.findById(baseTweetId);

    if (!baseTweet) throw new NotFoundCustomError('Tweet not found');

    baseTweet.like(requesterUserId);

    await this.baseTweetRepository.updateById({
      id: baseTweetId,
      data: baseTweet,
    });

    await this.messageBrokerService.sendEvent({
      eventType: EVENT_TYPES_ENUM.TWEET_LIKED,
      data: { userId: baseTweet.userId, baseTweetId, requesterUserId },
    });
  }
}
