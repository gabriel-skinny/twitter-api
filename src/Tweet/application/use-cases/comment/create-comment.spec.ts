import AlreadyCreatedError from 'src/Shared/errors/alreadyCreated';
import NotFoundCustomError from 'src/Shared/errors/notFound';
import WrongValueError from 'src/Shared/errors/wrongValue';
import { TweetTypesEnum } from '../../entities/baseTweet';
import { EVENT_TYPES_ENUM } from '../../services/messageBroker';
import { makeComment } from '../../test/factories/makeComment';
import { makePost } from '../../test/factories/makePost';
import { makeShare } from '../../test/factories/makeShare';
import { InMemoryBaseTweetRepository } from '../../test/repositories/inMemoryBaseTweetRepository';
import { InMemoryCommentRepository } from '../../test/repositories/inMemoryCommentRepository';
import { MessageBrockerMock } from '../../test/services/messageBroker';
import CreateCommentUseCase from './create';

const makeSut = () => {
  const messageBrocker = new MessageBrockerMock();
  const commentRepository = new InMemoryCommentRepository();
  const baseTweetRepository = new InMemoryBaseTweetRepository();

  const createCommentUseCase = new CreateCommentUseCase(
    commentRepository,
    messageBrocker,
    baseTweetRepository,
  );

  return {
    createCommentUseCase,
    messageBrocker,
    commentRepository,
    baseTweetRepository,
  };
};

describe('Create comment use case', () => {
  describe('Sucess cases', () => {
    it('Should comment a tweet', async () => {
      const {
        createCommentUseCase,
        messageBrocker,
        baseTweetRepository,
        commentRepository,
      } = makeSut();

      messageBrocker.sendEvent = jest.fn();

      const tweet = makePost();
      await baseTweetRepository.save(tweet);

      await createCommentUseCase.execute({
        userId: 'UserId',
        content: 'Comentario do post legal',
        parentId: tweet.id,
        creatorReferenceTweetId: tweet.id,
      });

      expect(commentRepository.baseTweetDatabase).toHaveLength(1);
      expect(commentRepository.baseTweetDatabase[0].type).toBe(
        TweetTypesEnum.COMMENT,
      );
      expect(commentRepository.baseTweetDatabase[0].parentType).toBe(
        TweetTypesEnum.POST,
      );
      expect(messageBrocker.sendEvent).toHaveBeenCalledWith({
        eventType: EVENT_TYPES_ENUM.TWEET_COMMENTED,
        data: {
          userId: 'UserId',
          creatorReferenceTweetId: tweet.id,
          commentId: commentRepository.baseTweetDatabase[0].id,
        },
      });
    });

    it('Should comment a comment', async () => {
      const {
        createCommentUseCase,
        messageBrocker,
        baseTweetRepository,
        commentRepository,
      } = makeSut();

      messageBrocker.sendEvent = jest.fn();

      const tweet = makePost();
      await baseTweetRepository.save(tweet);

      const parentTweet = makeComment({
        parentId: tweet.id,
        creatorReferenceTweetId: tweet.id,
        parentType: TweetTypesEnum.POST,
      });
      await baseTweetRepository.save(parentTweet);

      await createCommentUseCase.execute({
        userId: 'UserId',
        content: 'Comentario do comentario',
        parentId: parentTweet.id,
        creatorReferenceTweetId: tweet.id,
      });

      expect(commentRepository.baseTweetDatabase).toHaveLength(1);
      expect(commentRepository.baseTweetDatabase[0].type).toBe(
        TweetTypesEnum.COMMENT,
      );
      expect(commentRepository.baseTweetDatabase[0].parentType).toBe(
        TweetTypesEnum.COMMENT,
      );
      expect(messageBrocker.sendEvent).toHaveBeenCalledWith({
        eventType: EVENT_TYPES_ENUM.TWEET_COMMENTED,
        data: {
          userId: 'UserId',
          creatorReferenceTweetId: tweet.id,
          commentId: commentRepository.baseTweetDatabase[0].id,
        },
      });
    });

    it('Should comment a share', async () => {
      const {
        createCommentUseCase,
        messageBrocker,
        baseTweetRepository,
        commentRepository,
      } = makeSut();

      messageBrocker.sendEvent = jest.fn();

      const tweet = makePost();
      await baseTweetRepository.save(tweet);

      const parentTweet = makeShare({
        parentId: tweet.id,
        creatorReferenceTweetId: tweet.id,
        parentType: TweetTypesEnum.POST,
      });
      await baseTweetRepository.save(parentTweet);

      await createCommentUseCase.execute({
        userId: 'UserId',
        content: 'Compartilhamento do post legal',
        parentId: parentTweet.id,
        creatorReferenceTweetId: parentTweet.id,
      });

      expect(commentRepository.baseTweetDatabase).toHaveLength(1);
      expect(commentRepository.baseTweetDatabase[0].parentType).toBe(
        TweetTypesEnum.SHARE,
      );
      expect(commentRepository.baseTweetDatabase[0].type).toBe(
        TweetTypesEnum.COMMENT,
      );
      expect(messageBrocker.sendEvent).toHaveBeenCalledWith({
        eventType: EVENT_TYPES_ENUM.TWEET_COMMENTED,
        data: {
          userId: 'UserId',
          creatorReferenceTweetId: parentTweet.id,
          commentId: commentRepository.baseTweetDatabase[0].id,
        },
      });
    });
  });

  describe('Exception cases', () => {
    it('Should throw a NotFound exception if the tweet passed does not exists', async () => {
      const { createCommentUseCase } = makeSut();

      const promiseUseCase = createCommentUseCase.execute({
        userId: 'User',
        content: 'Compartilhamento do post legal',
        parentId: 'notExistingParentId',
        creatorReferenceTweetId: 'notExistingTweetId',
      });

      expect(promiseUseCase).rejects.toThrow(NotFoundCustomError);
    });

    it('Should throw a WrongValue exception if the creatorReference is a Comment', async () => {
      const { createCommentUseCase, baseTweetRepository } = makeSut();

      const comment = makeComment({
        creatorReferenceTweetId: 'randomId',
        parentId: 'parentId',
        parentType: TweetTypesEnum.POST,
      });
      await baseTweetRepository.save(comment);

      const promiseUseCase = createCommentUseCase.execute({
        userId: 'User',
        content: 'Compartilhamento do post legal',
        parentId: 'notExistingParentId',
        creatorReferenceTweetId: comment.id,
      });

      expect(promiseUseCase).rejects.toStrictEqual(
        new WrongValueError('CreatorReference cannot be a comment'),
      );
    });

    it('Should throw a NotFound exception if the parent tweet passed does not exists', async () => {
      const { createCommentUseCase, baseTweetRepository } = makeSut();

      const tweet = makePost();
      await baseTweetRepository.save(tweet);

      const promiseUseCase = createCommentUseCase.execute({
        userId: 'User',
        content: 'Compartilhamento do post legal',
        parentId: 'notExistingParentId',
        creatorReferenceTweetId: tweet.id,
      });

      expect(promiseUseCase).rejects.toStrictEqual(
        new NotFoundCustomError('Parent not found'),
      );
    });

    it('if the parent tweet is a Comment and their creatorReference is different than the one passed should throw a WrongValue exception', async () => {
      const { createCommentUseCase, baseTweetRepository } = makeSut();

      const tweet = makePost();
      await baseTweetRepository.save(tweet);

      const parentCommentWihtOtherReference = makeComment({
        parentId: 'diferentTweetId',
        parentType: TweetTypesEnum.POST,
        creatorReferenceTweetId: 'diferenteReferenceId',
      });
      await baseTweetRepository.save(parentCommentWihtOtherReference);

      const promiseUseCase = createCommentUseCase.execute({
        userId: 'User',
        content: 'Compartilhamento do post legal',
        parentId: parentCommentWihtOtherReference.id,
        creatorReferenceTweetId: tweet.id,
      });

      expect(promiseUseCase).rejects.toStrictEqual(
        new WrongValueError('Comment has to be the same reference'),
      );
    });

    it('if parent type is not a Comment and their id are not the creatorReference passed should trhow a WrongValueError', async () => {
      const { createCommentUseCase, baseTweetRepository, commentRepository } =
        makeSut();

      const tweet = makePost();
      await baseTweetRepository.save(tweet);

      const parentShare = makeShare({
        parentId: tweet.id,
        parentType: TweetTypesEnum.POST,
        creatorReferenceTweetId: tweet.id,
      });
      await baseTweetRepository.save(parentShare);

      const promiseUseCase = createCommentUseCase.execute({
        userId: 'userId',
        content: 'Compartilhamento do post legal',
        parentId: parentShare.id,
        creatorReferenceTweetId: tweet.id,
      });

      expect(promiseUseCase).rejects.toStrictEqual(
        new WrongValueError(
          'Comment of a Post or Share has to have the creatorReference being their id',
        ),
      );
    });
  });
});
