import AlreadyCreatedError from 'src/Shared/errors/alreadyCreated';
import { Share } from '../../entities/Share';
import AbstractShareRepository from '../../repositories/share';
import AbstractMessageBroker, {
  EVENT_TYPES_ENUM,
} from '../../services/messageBroker';
import AbstractTweetRepository from '../../repositories/tweet';
import NotFoundCustomError from 'src/Shared/errors/notFound';

interface ICreateShareUseCaseParams {
  userId: string;
  content: string;
  mediaUrl?: string;
  tweetId: string;
  parentId: string;
}

export default class CreateShareUseCase {
  constructor(
    private tweetRepository: AbstractTweetRepository,
    private shareRepository: AbstractShareRepository,
    private messageBrokerService: AbstractMessageBroker,
  ) {}

  async execute({
    userId,
    content,
    mediaUrl,
    tweetId,
    parentId,
  }: ICreateShareUseCaseParams) {
    if (!(await this.tweetRepository.existsById(tweetId)))
      throw new NotFoundCustomError('Tweet does not exists');
    if (
      await this.shareRepository.existsByUserIdAndParentId({
        parentId,
        userId,
      })
    )
      throw new AlreadyCreatedError('Can not share twice the same post');

    const share = new Share({
      userId,
      content,
      mediaUrl,
      tweetId,
      parentId,
    });

    await this.shareRepository.save(share);

    await this.messageBrokerService.sendEvent({
      eventType: EVENT_TYPES_ENUM.TWEET_SHARED,
      data: { userId, tweetId, shareId: share.id },
    });
  }
}
