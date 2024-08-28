import NotFoundCustomError from 'src/Shared/errors/notFound';
import { BaseTweet, TweetTypesEnum } from './baseTweet';

describe('Tweet entity test', () => {
  it('Should creat a baseTweetEntity', () => {
    const baseTweet = new BaseTweet({
      content: 'Content',
      type: TweetTypesEnum.POST,
      userId: 'userId',
    });

    expect(baseTweet).toBeTruthy();
    expect(baseTweet.createdAt).toBeTruthy();
    expect(baseTweet.id).toBeTruthy();
  });

  it('Should like a tweet', () => {
    const baseTweet = new BaseTweet({
      content: 'Content',
      type: TweetTypesEnum.POST,
      userId: 'userId',
    });

    const userLikee = 'userLikeeId';
    baseTweet.like(userLikee);

    expect(baseTweet).toBeTruthy();
    expect(Object.keys(baseTweet.likes)).toHaveLength(1);
    expect(baseTweet.likes).toStrictEqual({ [userLikee]: true });
  });

  it('Should throw an error if the user already liked the tweet', () => {
    const baseTweet = new BaseTweet({
      content: 'Content',
      type: TweetTypesEnum.POST,
      userId: 'userId',
    });

    const userLikee = 'userLikeeId';
    baseTweet.like(userLikee);

    expect(async () => {
      baseTweet.like(userLikee);
    }).rejects.toStrictEqual(new Error('Already liked'));
  });

  it('Should deslike a tweet', () => {
    const baseTweet = new BaseTweet({
      content: 'Content',
      type: TweetTypesEnum.POST,
      userId: 'userId',
    });

    const userLikee = 'userLikeeId';
    baseTweet.like(userLikee);
    baseTweet.deslike(userLikee);

    expect(baseTweet).toBeTruthy();
    expect(Object.keys(baseTweet.likes)).toHaveLength(1);
    expect(baseTweet.likes).toStrictEqual({ [userLikee]: false });
  });

  it('Should throw an error if the try to deslike a tweet that was not liked', () => {
    const baseTweet = new BaseTweet({
      content: 'Content',
      type: TweetTypesEnum.POST,
      userId: 'userId',
    });

    const userLikee = 'userLikeeId';

    expect(async () => {
      baseTweet.deslike(userLikee);
    }).rejects.toStrictEqual(new NotFoundCustomError('Like not found'));
  });
});
