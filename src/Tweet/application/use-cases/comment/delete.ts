import NotFoundCustomError from 'src/Shared/errors/notFound';
import AbstractCommentRepository from '../../repositories/comment';
import AbstractMessageBroker, {
  EVENT_TYPES_ENUM,
} from '../../services/messageBroker';

export default class DeleteCommentUseCase {
  constructor(
    private commentRepository: AbstractCommentRepository,
    private messageBrokerService: AbstractMessageBroker,
  ) {}

  async execute(commentId: string) {
    const comment = await this.commentRepository.findById(commentId);

    if (!comment) throw new NotFoundCustomError('Comment not found');

    await this.commentRepository.deleteById(comment.id);

    await this.messageBrokerService.sendEvent({
      eventType: EVENT_TYPES_ENUM.TWEET_UNCOMMENTED,
      data: {
        commentId,
        userId: comment.userId,
        creatorReferenceTweetId: comment.creatorReferenceTweetId,
        parentId: comment.parentId,
      },
    });
  }
}
