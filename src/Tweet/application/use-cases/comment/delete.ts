import NotFoundCustomError from 'src/Shared/errors/notFound';
import { Share } from '../../entities/Share';
import AbstractShareRepository from '../../repositories/share';
import AbstractMessageBroker, {
  EVENT_TYPES_ENUM,
} from '../../services/messageBroker';

export default class DeleteShareUseCase {
  constructor(
    private shareRepository: AbstractShareRepository,
    private messageBrokerService: AbstractMessageBroker,
  ) {}

  async execute(shareId: string) {
    const share = await this.shareRepository.findById(shareId);

    if (!share) throw new NotFoundCustomError('Share not found');

    await this.shareRepository.deleteById(share.id);

    await this.messageBrokerService.sendEvent({
      eventType: EVENT_TYPES_ENUM.TWEET_UNSHARED,
      data: { shareId, userId: share.userId, tweetId: share.tweetId },
    });
  }
}
