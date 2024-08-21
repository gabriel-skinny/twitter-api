import AlreadyCreatedError from 'src/Shared/errors/alreadyCreated';
import { Share } from '../../entities/Share';
import AbstractShareRepository from '../../repositories/share';
import AbstractMessageBroker, {
  EVENT_TYPES_ENUM,
} from '../../services/messageBroker';
import AbstractTweetRepository from '../../repositories/tweet';
import NotFoundCustomError from 'src/Shared/errors/notFound';
import AbstractCommentRepository from '../../repositories/comment';
import { Comment } from '../../entities/Comment';
import { TweetTypesEnum } from '../../entities/baseTweet';
import AbstractBaseTweetRepository from '../../repositories/base';

interface ICreateCommentUseCaseParams {
  userId: string;
  content: string;
  mediaUrl?: string;
  tweetId: string;
  parentId: string;
  parentType: TweetTypesEnum;
}

export default class CreateCommentUseCase {
  constructor(
    private tweetRepository: AbstractTweetRepository,
    private commentRepository: AbstractCommentRepository,
    private messageBrokerService: AbstractMessageBroker,
    private baseTweetRepository: AbstractBaseTweetRepository,
  ) {}

  async execute({
    userId,
    content,
    mediaUrl,
    tweetId,
    parentId,
    parentType,
  }: ICreateCommentUseCaseParams) {
    if (!(await this.tweetRepository.existsById(tweetId)))
      throw new NotFoundCustomError('Tweet does not exists');

    if (!(await this.baseTweetRepository.existsById(parentId)))
      throw new NotFoundCustomError('Parent not found');

    if (
      await this.commentRepository.existsByUserIdAndParentId({
        parentId,
        userId,
        parentType,
      })
    )
      throw new AlreadyCreatedError('Can not comment twice the same post');

    const comment = new Comment({
      userId,
      content,
      mediaUrl,
      tweetId,
      parentId,
      parentType,
    });

    await this.commentRepository.save(comment);

    await this.messageBrokerService.sendEvent({
      eventType: EVENT_TYPES_ENUM.TWEET_COMMENTED,
      data: { userId, tweetId, commentId: comment.id },
    });
  }
}
