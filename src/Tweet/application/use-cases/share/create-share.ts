import AlreadyCreatedError from 'src/Shared/errors/alreadyCreated';
import { Share } from '../../entities/Share';
import AbstractShareRepository from '../../repositories/share';
import AbstractMessageBroker, {
  EVENT_TYPES_ENUM,
} from '../../services/messageBroker';
import AbstractTweetRepository from '../../repositories/post';
import NotFoundCustomError from 'src/Shared/errors/notFound';
import { TweetTypesEnum } from '../../entities/baseTweet';
import AbstractBaseTweetRepository from '../../repositories/base';
import WrongValueError from 'src/Shared/errors/wrongValue';

interface ICreateShareUseCaseParams {
  userId: string;
  content: string;
  mediaUrl?: string;
  creatorReferenceTweetId: string;
  parentId: string;
}

export default class CreateShareUseCase {
  constructor(
    private messageBrokerService: AbstractMessageBroker,
    private shareRepository: AbstractShareRepository,
    private baseTweetRepository: AbstractBaseTweetRepository,
  ) {}

  async execute({
    userId,
    content,
    mediaUrl,
    creatorReferenceTweetId,
    parentId,
  }: ICreateShareUseCaseParams) {
    const creatorReferenceTweet = await this.baseTweetRepository.findById(
      creatorReferenceTweetId,
    );
    if (!creatorReferenceTweet)
      throw new NotFoundCustomError('Reference tweet does not exists');

    if (creatorReferenceTweet.type == TweetTypesEnum.COMMENT)
      throw new WrongValueError('CreatorReference cannot be a comment');

    const parentBaseTweet = await this.baseTweetRepository.findById(parentId);
    if (!parentBaseTweet) throw new NotFoundCustomError('Parent not found');

    if (
      parentBaseTweet.creatorReferenceTweetId &&
      parentBaseTweet.creatorReferenceTweetId != creatorReferenceTweetId
    )
      throw new WrongValueError('Tweet id of parent is diferent for the share');

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
      creatorReferenceTweetId,
      parentId,
      parentType: parentBaseTweet.type,
    });

    await this.shareRepository.save(share);

    await this.messageBrokerService.sendEvent({
      eventType: EVENT_TYPES_ENUM.TWEET_SHARED,
      data: { userId, tweetId: creatorReferenceTweetId, shareId: share.id },
    });
  }
}
