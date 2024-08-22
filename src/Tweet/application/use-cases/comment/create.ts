import AlreadyCreatedError from 'src/Shared/errors/alreadyCreated';
import NotFoundCustomError from 'src/Shared/errors/notFound';
import { Comment } from '../../entities/Comment';
import { TweetTypesEnum } from '../../entities/baseTweet';
import AbstractBaseTweetRepository from '../../repositories/base';
import AbstractCommentRepository from '../../repositories/comment';
import AbstractTweetRepository from '../../repositories/post';
import AbstractMessageBroker, {
  EVENT_TYPES_ENUM,
} from '../../services/messageBroker';
import WrongValueError from 'src/Shared/errors/wrongValue';

interface ICreateCommentUseCaseParams {
  userId: string;
  content: string;
  mediaUrl?: string;
  creatorReferenceTweetId: string;
  parentId: string;
}

export default class CreateCommentUseCase {
  constructor(
    private commentRepository: AbstractCommentRepository,
    private messageBrokerService: AbstractMessageBroker,
    private baseTweetRepository: AbstractBaseTweetRepository,
  ) {}

  async execute({
    userId,
    content,
    mediaUrl,
    creatorReferenceTweetId,
    parentId,
  }: ICreateCommentUseCaseParams) {
    const creatorReferenceTweet = await this.baseTweetRepository.findById(
      creatorReferenceTweetId,
    );
    if (!creatorReferenceTweet)
      throw new NotFoundCustomError('Reference tweet does not exists');

    if (creatorReferenceTweet.type == TweetTypesEnum.COMMENT)
      throw new WrongValueError('CreatorReference cannot be a comment');

    const parentBaseTweet = await this.baseTweetRepository.findById(parentId);
    if (!parentBaseTweet) throw new NotFoundCustomError('Parent not found');

    if (parentBaseTweet.type == TweetTypesEnum.COMMENT) {
      if (parentBaseTweet.creatorReferenceTweetId !== creatorReferenceTweetId)
        throw new WrongValueError('Comment has to be the same reference');
    } else {
      if (parentBaseTweet.id !== creatorReferenceTweetId)
        throw new WrongValueError(
          'Comment of a Post or Share has to have the creatorReference being their id',
        );
    }

    const comment = new Comment({
      userId,
      content,
      mediaUrl,
      creatorReferenceTweetId,
      parentId,
      parentType: parentBaseTweet.type,
    });

    await this.commentRepository.save(comment);

    await this.messageBrokerService.sendEvent({
      eventType: EVENT_TYPES_ENUM.TWEET_COMMENTED,
      data: { userId, creatorReferenceTweetId, commentId: comment.id },
    });
  }
}
