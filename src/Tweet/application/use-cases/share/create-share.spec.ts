import NotFoundCustomError from 'src/Shared/errors/notFound';
import { TweetTypesEnum } from '../../entities/baseTweet';
import { EVENT_TYPES_ENUM } from '../../services/messageBroker';
import { makeComment } from '../../test/factories/makeComment';
import { makeGenericSut } from '../../test/factories/makeGenericSut';
import { makeShare } from '../../test/factories/makeShare';
import { makePost } from '../../test/factories/makePost';
import { InMemoryBaseTweetRepository } from '../../test/repositories/inMemoryBaseTweetRepository';
import { InMemoryShareRepository } from '../../test/repositories/inMemoryShareRepository';
import CreateShareUseCase from './create-share';
import WrongValueError from 'src/Shared/errors/wrongValue';
import AlreadyCreatedError from 'src/Shared/errors/alreadyCreated';
import { MessageBrockerMock } from '../../test/services/messageBroker';

const makeSut = () => {
  const messageBrocker = new MessageBrockerMock();
  const shareRepository = new InMemoryShareRepository();
  const baseTweetRepository = new InMemoryBaseTweetRepository();

  const useCase = new CreateShareUseCase(
    messageBrocker,
    shareRepository,
    baseTweetRepository,
  );

  return {
    useCase,
    messageBrocker,
    shareRepository,
    baseTweetRepository,
  };
};

describe('Share tweet use case', () => {
  describe('Sucess cases', () => {
    it('Should share a tweet', async () => {
      const { useCase, messageBrocker, baseTweetRepository, shareRepository } =
        makeSut();

      messageBrocker.sendEvent = jest.fn();

      const tweet = makePost();
      await baseTweetRepository.save(tweet);

      const parentTweet = makePost();
      await baseTweetRepository.save(parentTweet);

      await useCase.execute({
        userId: 'User',
        content: 'Compartilhamento do post legal',
        parentId: parentTweet.id,
        creatorReferenceTweetId: tweet.id,
      });

      expect(shareRepository.baseTweetDatabase).toHaveLength(1);
      expect(shareRepository.baseTweetDatabase[0].type).toBe(
        TweetTypesEnum.SHARE,
      );
      expect(shareRepository.baseTweetDatabase[0].parentType).toBe(
        TweetTypesEnum.POST,
      );
      expect(messageBrocker.sendEvent).toHaveBeenCalledWith({
        eventType: EVENT_TYPES_ENUM.TWEET_SHARED,
        data: {
          userId: 'User',
          tweetId: tweet.id,
          shareId: shareRepository.baseTweetDatabase[0].id,
        },
      });
    });

    it('Should share a comment', async () => {
      const { useCase, messageBrocker, baseTweetRepository, shareRepository } =
        makeSut();

      messageBrocker.sendEvent = jest.fn();

      const tweet = makePost();
      await baseTweetRepository.save(tweet);

      const parentTweet = makeComment({
        parentId: tweet.id,
        creatorReferenceTweetId: tweet.id,
        parentType: TweetTypesEnum.POST,
      });
      await baseTweetRepository.save(parentTweet);

      await useCase.execute({
        userId: 'User',
        content: 'Compartilhamento do post legal',
        parentId: parentTweet.id,
        creatorReferenceTweetId: tweet.id,
      });

      expect(shareRepository.baseTweetDatabase).toHaveLength(1);
      expect(shareRepository.baseTweetDatabase[0].type).toBe(
        TweetTypesEnum.SHARE,
      );
      expect(shareRepository.baseTweetDatabase[0].parentType).toBe(
        TweetTypesEnum.COMMENT,
      );
      expect(messageBrocker.sendEvent).toHaveBeenCalledWith({
        eventType: EVENT_TYPES_ENUM.TWEET_SHARED,
        data: {
          userId: 'User',
          tweetId: tweet.id,
          shareId: shareRepository.baseTweetDatabase[0].id,
        },
      });
    });

    it('Should share a share', async () => {
      const { useCase, messageBrocker, baseTweetRepository, shareRepository } =
        makeSut();

      messageBrocker.sendEvent = jest.fn();

      const tweet = makePost();
      await baseTweetRepository.save(tweet);

      const parentTweet = makeShare({
        parentId: tweet.id,
        creatorReferenceTweetId: tweet.id,
        parentType: TweetTypesEnum.POST,
      });
      await baseTweetRepository.save(parentTweet);

      await useCase.execute({
        userId: 'User',
        content: 'Compartilhamento do post legal',
        parentId: parentTweet.id,
        creatorReferenceTweetId: tweet.id,
      });

      expect(shareRepository.baseTweetDatabase).toHaveLength(1);
      expect(shareRepository.baseTweetDatabase[0].parentType).toBe(
        TweetTypesEnum.SHARE,
      );
      expect(shareRepository.baseTweetDatabase[0].type).toBe(
        TweetTypesEnum.SHARE,
      );
      expect(messageBrocker.sendEvent).toHaveBeenCalledWith({
        eventType: EVENT_TYPES_ENUM.TWEET_SHARED,
        data: {
          userId: 'User',
          tweetId: tweet.id,
          shareId: shareRepository.baseTweetDatabase[0].id,
        },
      });
    });
  });

  describe('Exception cases', () => {
    it('Should throw a NotFound exception if the tweet passed does not exists', async () => {
      const { useCase } = makeSut();

      const promiseUseCase = useCase.execute({
        userId: 'User',
        content: 'Compartilhamento do post legal',
        parentId: 'notExistingParentId',
        creatorReferenceTweetId: 'notExistingTweetId',
      });

      expect(promiseUseCase).rejects.toThrow(NotFoundCustomError);
    });

    it('Should throw a WrongValue exception if the creatorReference is a Comment', async () => {
      const { useCase, baseTweetRepository } = makeSut();

      const comment = makeComment({
        creatorReferenceTweetId: 'randomId',
        parentId: 'parentId',
        parentType: TweetTypesEnum.POST,
      });
      await baseTweetRepository.save(comment);

      const promiseUseCase = useCase.execute({
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
      const { useCase, baseTweetRepository } = makeSut();

      const tweet = makePost();
      await baseTweetRepository.save(tweet);

      const promiseUseCase = useCase.execute({
        userId: 'User',
        content: 'Compartilhamento do post legal',
        parentId: 'notExistingParentId',
        creatorReferenceTweetId: tweet.id,
      });

      expect(promiseUseCase).rejects.toStrictEqual(
        new NotFoundCustomError('Parent not found'),
      );
    });

    it('Should throw a WrongValue exception if the parent tweetId is different than the tweet id passed', async () => {
      const { useCase, baseTweetRepository } = makeSut();

      const tweet = makePost();
      await baseTweetRepository.save(tweet);

      const commentFromDifferentTweet = makeComment({
        parentId: 'diferentTweetId',
        parentType: TweetTypesEnum.POST,
        creatorReferenceTweetId: 'diferenteTweetId',
      });
      await baseTweetRepository.save(commentFromDifferentTweet);

      const promiseUseCase = useCase.execute({
        userId: 'User',
        content: 'Compartilhamento do post legal',
        parentId: commentFromDifferentTweet.id,
        creatorReferenceTweetId: tweet.id,
      });

      expect(promiseUseCase).rejects.toStrictEqual(
        new WrongValueError('Tweet id of parent is diferent for the share'),
      );
    });

    it('Should throw a AlreadyCreatedError execption if the tweet was already shared', async () => {
      const { useCase, baseTweetRepository, shareRepository } = makeSut();

      const tweet = makePost();
      await baseTweetRepository.save(tweet);

      const alreadySharedComment = makeComment({
        parentId: tweet.id,
        parentType: TweetTypesEnum.POST,
        creatorReferenceTweetId: tweet.id,
      });
      await baseTweetRepository.save(alreadySharedComment);

      const shareUserId = 'userId';
      await shareRepository.save(
        makeShare({
          parentId: alreadySharedComment.id,
          parentType: TweetTypesEnum.COMMENT,
          creatorReferenceTweetId: tweet.id,
          userId: shareUserId,
        }),
      );

      const promiseUseCase = useCase.execute({
        userId: shareUserId,
        content: 'Compartilhamento do post legal',
        parentId: alreadySharedComment.id,
        creatorReferenceTweetId: tweet.id,
      });

      expect(promiseUseCase).rejects.toStrictEqual(
        new AlreadyCreatedError('Can not share twice the same post'),
      );
    });
  });
});
