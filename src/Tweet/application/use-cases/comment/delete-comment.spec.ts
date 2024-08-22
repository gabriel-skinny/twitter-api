import NotFoundCustomError from 'src/Shared/errors/notFound';
import { TweetTypesEnum } from '../../entities/baseTweet';
import { EVENT_TYPES_ENUM } from '../../services/messageBroker';
import { makeComment } from '../../test/factories/makeComment';
import { InMemoryCommentRepository } from '../../test/repositories/inMemoryCommentRepository';
import { MessageBrockerMock } from '../../test/services/messageBroker';
import DeleteCommentUseCase from '../comment/delete';

describe('Delete a comment use case', () => {
  it('Should delete a comment', async () => {
    const commentRepository = new InMemoryCommentRepository();
    const messageBrocker = new MessageBrockerMock();
    const deleteCommentUseCase = new DeleteCommentUseCase(
      commentRepository,
      messageBrocker,
    );

    messageBrocker.sendEvent = jest.fn();

    const comment = makeComment({
      parentId: 'parentId',
      parentType: TweetTypesEnum.POST,
      creatorReferenceTweetId: 'id',
    });
    await commentRepository.save(comment);

    await deleteCommentUseCase.execute(comment.id);

    expect(commentRepository.baseTweetDatabase).toHaveLength(0);
    expect(messageBrocker.sendEvent).toHaveBeenCalledWith({
      eventType: EVENT_TYPES_ENUM.TWEET_UNCOMMENTED,
      data: {
        commentId: comment.id,
        userId: comment.userId,
        creatorReferenceTweetId: comment.creatorReferenceTweetId,
        parentId: comment.parentId,
      },
    });
  });

  it('Should thrown an error with the share does not exists', async () => {
    const commentRepository = new InMemoryCommentRepository();
    const messageBrocker = new MessageBrockerMock();
    const deleteCommentUseCase = new DeleteCommentUseCase(
      commentRepository,
      messageBrocker,
    );

    messageBrocker.sendEvent = jest.fn();

    const promiseUseCase = deleteCommentUseCase.execute('notExistingShareId');

    expect(promiseUseCase).rejects.toThrow(NotFoundCustomError);
  });
});
